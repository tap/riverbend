# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/brochure website for **River Bend Handyman LLC**, a handyman service in Kansas City, MO. It is a static site — no login, database, or booking engine. The goal is to convert phone-skimming visitors into phone calls and quote requests.

**Read `PROJECT_BRIEF.md` first.** It is the source of truth for scope, content, brand, information architecture, and the open items the owner still needs to supply. Do not duplicate its content here or in code comments — reference it.

## Stack

- Astro + TypeScript (strict)
- Deployed to Cloudflare Pages (`@astrojs/cloudflare` adapter)
- Mobile-first; minimal JS (lean on Astro's static output)

## Repository layout

The Astro app lives at the **repo root** (not in a subfolder). It is the Astro "basics" starter with the Cloudflare adapter already installed and configured.

```
src/                 ← pages, layouts, components, assets
public/              ← served as-is (favicon, robots.txt, etc.)
astro.config.mjs     ← registers the @astrojs/cloudflare adapter
wrangler.jsonc       ← Cloudflare deploy config (serves ./dist via ASSETS binding)
tsconfig.json        ← extends astro/tsconfigs/strict
PROJECT_BRIEF.md     ← planning + content reference (read this first)
```

Cloudflare is already wired up: `astro.config.mjs` imports and registers `@astrojs/cloudflare`, and the adapter is in `package.json`. Styling uses **Astro scoped `<style>` blocks per component plus one small global stylesheet** (brand tokens/fonts/reset) loaded by the base layout — plain CSS, no framework.

## Commands

Run from the repo root (Node >= 22.12.0):

```sh
npm install          # install deps
npm run dev          # dev server at localhost:4321
npm run build        # production build to ./dist/
npm run preview      # preview the build locally
npm run astro check  # type-check / diagnostics (Astro's lint equivalent)
```

There is no separate lint or test setup yet. TypeScript is **strict** (`website/tsconfig.json` extends `astro/tsconfigs/strict`).

## Constraints that must hold (from the brief)

These are easy to violate and matter for the business, so keep them front of mind:

- **NAP consistency** — business Name, Address, Phone must be byte-for-byte identical everywhere they appear (page copy, footer, `LocalBusiness` schema). Inconsistency hurts local SEO.
- **Legal framing** — Missouri requires licensed contractors for non-trivial plumbing/electrical. Service copy must stay within what an unlicensed handyman can advertise: frame plumbing/electrical as *minor repairs / small jobs* (faucet swaps, outlet replacement), never full installs or "licensed" trades work.
- **Image optimization** — every photo goes through Astro's `<Image>` component. Never ship raw multi-MB phone photos to the browser.
- **Minimal JS** — Astro ships near-zero JS by default; keep it that way. This is a content site, not an app.
- **Mobile-first** — most visitors are on a phone in a hurry. Tappable `tel:` phone link at the top of every page; big, obvious CTAs.
- **SEO baked in** — `LocalBusiness` schema, per-page meta descriptions, semantic HTML/heading hierarchy, sitemap + robots.txt.

## Workflow preferences

- Build in this order: BaseLayout → Header/Footer → homepage hero → remaining homepage
  sections → other pages. Get one page fully right before fanning out.
- Keep components small and composable.
- Prefer Astro's built-in features over adding dependencies. Ask before adding a package.
- Match the brand voice in `PROJECT_BRIEF.md`: honest, plain-spoken, local. Not corporate.

## v1 scope

In: Home, Services, Gallery, About, Contact/Quote, FAQ; working quote form via a third-party endpoint; optimized images; schema + on-page SEO; responsive design. **Out (do not build): online booking, blog, live chat, pricing calculators, multi-language, any account/login system.** See brief §9.

## Ask before you act

Stop and confirm with me before:

- Adding any npm dependency
- Choosing/wiring the contact-form backend (Web3Forms / Formspree / Pages Function)
- Anything touching deploy config or Cloudflare settings
- Filling in any real business data (NAP, hours, service area)
