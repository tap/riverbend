// TEMPORARY staging password gate (HTTP Basic Auth).
//
// Protects the whole site with a single shared password while content is being
// refined, so the public/search engines can't see draft content.
//
// ON/OFF is controlled entirely by the SITE_PASSWORD secret:
//   • SITE_PASSWORD set    → every page requires the password (any username).
//   • SITE_PASSWORD unset  → middleware does nothing; the site is fully public.
// So to lift the gate, just DELETE the SITE_PASSWORD secret in Cloudflare — no deploy.
//
// To remove the machinery entirely later: delete this file and remove `output: 'server'`
// from astro.config.mjs (returns pages to static rendering). See STACK.md.
//
// Note: this requires `output: 'server'` — Astro middleware does not run on
// prerendered pages, so the pages must be rendered on-demand for the gate to apply.

import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";

export const onRequest = defineMiddleware(async (context, next) => {
  const password = (env as Record<string, string | undefined>).SITE_PASSWORD;

  // No password configured → gate is off, site is public.
  if (!password) return next();

  // Parse "Authorization: Basic base64(user:pass)" and check the password part.
  const header = context.request.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  let providedPassword = "";
  if (scheme === "Basic" && encoded) {
    try {
      // Everything after the first ":" is the password (username is ignored).
      providedPassword = atob(encoded).split(":").slice(1).join(":");
    } catch {
      // malformed header → treat as no credentials
    }
  }

  if (providedPassword !== password) {
    return new Response("This site is private while we finish setting it up.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="River Bend — private preview", charset="UTF-8"',
      },
    });
  }

  return next();
});
