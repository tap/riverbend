// Quote-form handler. Runs as a Cloudflare serverless function (not prerendered).
// The static site POSTs the form here; we validate, email the lead, then redirect
// the visitor to /thank-you.
//
// EMAIL DELIVERY IS NOT LIVE YET. It needs two things that arrive at deploy time:
//   1. A domain (so we have a real from/to address).
//   2. A Resend account + API key, set as Cloudflare secrets (NOT committed):
//        wrangler secret put RESEND_API_KEY
//      plus vars QUOTE_TO_EMAIL and QUOTE_FROM_EMAIL (wrangler.jsonc [vars] or dashboard).
// Until those exist, submissions are logged to Cloudflare observability so nothing
// is lost, and the visitor still reaches the thank-you page.

import type { APIRoute } from "astro";
// Astro v6 + @astrojs/cloudflare: env vars / secrets / bindings come from this
// virtual module (the old Astro.locals.runtime.env was removed in v6).
import { env } from "cloudflare:workers";

export const prerender = false; // opt this route into on-demand (server) rendering

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const val = (k: string) => (form.get(k) ?? "").toString().trim();

  // Honeypot: a real person never fills the hidden "company" field. Bots do.
  // Pretend success so the bot doesn't retry.
  if (val("company")) return redirect("/thank-you", 303);

  const lead = {
    name: val("name"),
    phone: val("phone"),
    email: val("email"),
    location: val("location"),
    service: val("service"),
    contactMethod: val("contact_method"),
    description: val("description"),
  };

  // Server-side validation of the required fields.
  if (!lead.name || !lead.phone || !lead.description) {
    return new Response("Please fill in your name, phone, and a description.", {
      status: 400,
    });
  }

  // Cloudflare secrets/vars (set via `wrangler secret put` / wrangler.jsonc [vars]).
  const cfEnv = env as Record<string, string | undefined>;
  const apiKey = cfEnv.RESEND_API_KEY;
  const to = cfEnv.QUOTE_TO_EMAIL;
  const from = cfEnv.QUOTE_FROM_EMAIL || "River Bend Handyman <onboarding@resend.dev>";

  const body = [
    `New quote request from the website:`,
    ``,
    `Name:            ${lead.name}`,
    `Phone:           ${lead.phone}`,
    `Email:           ${lead.email || "—"}`,
    `Address / ZIP:   ${lead.location || "—"}`,
    `Type of work:    ${lead.service || "—"}`,
    `Preferred reply: ${lead.contactMethod || "—"}`,
    ``,
    `Details:`,
    lead.description,
  ].join("\n");

  if (apiKey && to) {
    // Only set reply_to when the visitor gave a valid email, so hitting "Reply"
    // goes straight back to them. (Resend rejects a non-email reply_to.)
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        ...(validEmail ? { reply_to: lead.email } : {}),
        subject: `New quote request — ${lead.name}`,
        text: body,
      }),
    });
    if (!res.ok) {
      console.error("[quote] Resend send failed:", res.status, await res.text());
      // Still send the visitor to thank-you; we logged the lead below as a fallback.
      console.log("[quote] lead (send failed):", JSON.stringify(lead));
    }
  } else {
    // Email not configured yet — log so the lead is recoverable from Cloudflare logs.
    console.log("[quote] new submission (email not configured):", JSON.stringify(lead));
  }

  return redirect("/thank-you", 303);
};
