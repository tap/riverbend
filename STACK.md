# River Bend Handyman — Technology & Operations Reference

The single source of truth for how this website is built, hosted, and run. If you
need to understand or change anything about the *infrastructure* (as opposed to the
*content*), start here.

> For **content edits** (services, testimonials, FAQ, etc.) jump to
> [Where the content lives](#where-the-content-lives) and [Runbook](#runbook-common-tasks).
> For the *why* behind the site (audience, brand, scope) see `PROJECT_BRIEF.md`.

---

## At a glance

| Thing | What it is |
| --- | --- |
| **Site** | https://riverbendhandymankc.com |
| **Framework** | [Astro](https://astro.build) 6 (static pages + one serverless function) |
| **Language** | TypeScript (strict), plain CSS |
| **Hosting** | Cloudflare Workers (worker name: `riverbend`) |
| **Repo** | github.com/tap/riverbend (branch `main`) |
| **Deploy** | Auto: every push to `main` builds & deploys (~60s) |
| **Form email — sending** | [Resend](https://resend.com) API |
| **Email — receiving** | Cloudflare Email Routing → forwards to `hello@timothy.place` |
| **DNS + registrar** | Cloudflare (domain bought through Cloudflare Registrar) |

---

## Accounts & services

Three external accounts power everything. Know which does what:

| Service | Used for | Where to manage |
| --- | --- | --- |
| **GitHub** | Source code; pushing to `main` triggers deploys | github.com/tap/riverbend |
| **Cloudflare** | Hosting (Workers), DNS, the domain, inbound email (Email Routing), production secrets | dash.cloudflare.com |
| **Resend** | Sending the quote-form emails (outbound only) | resend.com |

Everything except outbound email lives inside Cloudflare, which keeps the moving
parts few.

---

## Domains & URLs

| URL | Purpose |
| --- | --- |
| `https://riverbendhandymankc.com` | The live site (canonical) |
| `https://www.riverbendhandymankc.com` | www variant (also live) |
| `https://riverbend.timothyaplace.workers.dev` | Cloudflare's default Worker URL (still works; the custom domain is the real one) |
| `info@riverbendhandymankc.com` | Public business email (forwards to owner) |
| `quotes@riverbendhandymankc.com` | The form's "From" address (forwards to owner) |

Present the domain capitalized for readability — **RiverBendHandymanKC.com** — even
though the actual URL is lowercase.

---

## Technology stack

| Layer | Choice | Version | Notes |
| --- | --- | --- | --- |
| Framework | Astro | `^6.4.4` | Ships near-zero JS; content-focused |
| Adapter | `@astrojs/cloudflare` | `^13.6.1` | Targets the Cloudflare Workers runtime |
| Deploy CLI | Wrangler | `^4.98.0` | Cloudflare's build/deploy tool |
| Build tool | Vite | `^7` (override) | Used by Astro under the hood |
| Runtime | Node | `>=22.12.0` | For local dev/build only |
| Language | TypeScript | strict | `astro/tsconfigs/strict` |
| Styling | Plain CSS | — | Scoped per-component + one global file; **no Tailwind** |

There is **no test runner** and **no separate linter** configured. The closest thing
to a lint/typecheck is `npm run astro check` (which prompts to install `@astrojs/check`
the first time).

---

## How the site renders

This is the key architectural fact: the site is **mostly static, with one dynamic
endpoint.**

- Every **page** (`/`, `/about/`, `/faq/`, `/thank-you/`) is **prerendered to static
  HTML** at build time. Fast, cacheable, no server work per request.
- The **one exception** is `src/pages/api/quote.ts`, marked `export const prerender = false`.
  It runs as a **Cloudflare serverless function** to handle quote-form submissions.

  Because of that one server route, the build runs in Astro's hybrid/`server` mode: it
  produces a Worker that serves the static assets *and* runs the function. You get
  static-site speed everywhere except the form handler.

> **Currently overridden:** while the [staging password gate](#staging-password-gate-temporary)
> is in place, `astro.config.mjs` sets `output: 'server'`, so *all* pages render
> on-demand (not prerendered). Removing that line restores static prerendering.

> **Astro runtime note (v6):** environment variables/secrets are read via
> `import { env } from "cloudflare:workers"`. The older `Astro.locals.runtime.env`
> was **removed in Astro 6** — don't use it.

URLs are served with a **trailing slash** (`/about/`); the site redirects the
non-slash form. Internal nav links already use the trailing-slash form.

---

## Project structure

```
riverbend/
├── astro.config.mjs        # Astro + Cloudflare adapter config (site URL, image service)
├── wrangler.jsonc          # Cloudflare Worker deploy config (name, bindings)
├── tsconfig.json           # Strict TypeScript
├── package.json            # Deps + scripts
├── .dev.vars               # LOCAL secrets (gitignored — never committed)
├── CLAUDE.md               # Guidance for AI assistants working in the repo
├── PROJECT_BRIEF.md        # The business/content spec (the "why")
├── STACK.md                # This file
│
├── public/                 # Served as-is (not processed)
│   ├── favicon.ico, favicon-16/32.png, apple-touch-icon.png   # from the logo
│   ├── robots.txt
│   └── sitemap.xml         # Static — keep in sync when pages change
│
└── src/
    ├── assets/             # Build-processed images (optimized by <Image>)
    │   ├── riverbend-logo.jpg
    │   └── gallery/        # Project photos (originals; optimized at build)
    │
    ├── data/               # ★ Content lives here (edit these, not the markup)
    │   ├── business.ts     # NAP, hours, service-area cities, social, email, proof stats
    │   ├── services.ts     # The 7 service categories
    │   ├── testimonials.ts # Customer reviews (currently placeholder)
    │   └── faq.ts          # FAQ questions/answers
    │
    ├── styles/
    │   └── global.css      # Brand tokens (colors/fonts), reset, shared button styles
    │
    ├── layouts/
    │   └── BaseLayout.astro # Shared <head> (SEO, schema, OG), Header + Footer wrapper
    │
    ├── components/         # UI building blocks (one per homepage section + shared)
    │   ├── Header.astro / Footer.astro
    │   ├── Icon.astro      # Inline SVG icon set (size/strokeWidth props)
    │   ├── TrustStrip / Services / Gallery / Testimonials /
    │   │   ServiceArea / HowItWorks / Contact .astro
    │
    └── pages/              # Routes (file-based)
        ├── index.astro     # Homepage (composes the section components)
        ├── about.astro
        ├── faq.astro       # + FAQPage structured data
        ├── thank-you.astro # Form success page
        └── api/quote.ts    # ★ The serverless form handler
```

*(`src/assets/astro.svg` and `background.svg` are leftover starter files and can be deleted.)*

---

## Where the content lives

Content is deliberately separated from markup. To change words/data, edit these files —
the components read from them:

| To change… | Edit |
| --- | --- |
| Phone, hours, service-area cities, social links, business email | `src/data/business.ts` |
| Years-in-business / Google rating shown in the trust strip | `src/data/business.ts` → `proof` (null = hidden) |
| The 7 services and their example jobs | `src/data/services.ts` |
| Testimonials | `src/data/testimonials.ts` |
| FAQ questions/answers | `src/data/faq.ts` |
| Gallery photos | add files to `src/assets/gallery/`, reference in `src/components/Gallery.astro` |
| Brand colors / fonts | `src/styles/global.css` (`:root` variables) |
| Owner story / photo | `src/pages/about.astro` |

**`business.ts` is the single source of truth for NAP** (Name/Address/Phone). It feeds
the header, footer, schema markup, and form — change the phone number once there and it
updates everywhere. This consistency matters for local SEO.

---

## Systems in detail

### 1. Hosting & deployment

- **Model:** Cloudflare Workers (the newer Workers-with-static-assets model), configured
  by `wrangler.jsonc`. Worker name: `riverbend`. Bindings: `ASSETS` (static files),
  `SESSION` (KV, added automatically by the adapter). Observability (logs) is enabled.
- **Auto-deploy:** the GitHub repo is connected via **Cloudflare Workers Builds**. On
  every push to `main`, Cloudflare runs `npm run build` then `npx wrangler deploy`. Live
  in roughly a minute. No manual step.
- **Manual deploy (rarely needed):** `npm run build && npx wrangler deploy` (requires
  `npx wrangler login` first).

### 2. Image optimization

- All images go through Astro's `<Image>` component. Originals live in `src/assets/`.
- `astro.config.mjs` sets `imageService: 'compile'` → images are optimized **at build
  time with sharp** into small, static, modern-format files (webp). No runtime/plan
  dependency. (Example: a 6.3 MB phone photo ships as ~57 KB.)
- The gallery uses `import.meta.glob` to load the whole `src/assets/gallery/` folder.
- **Never** drop a raw multi-MB image into a plain `<img>` — always import + `<Image>`.

### 3. The quote-form pipeline (end to end)

```
Visitor fills form (Contact.astro)
   │  POST (normal HTML form, no JS) to /api/quote
   ▼
src/pages/api/quote.ts  (Cloudflare function)
   │  • Astro CSRF check: rejects POSTs whose Origin ≠ the site (403)
   │  • Honeypot: hidden "company" field filled ⇒ silently drop (it's a bot)
   │  • Validate required fields: name, phone, description (else 400)
   │  • Send email via Resend API (reply-to = customer's email if valid)
   │  • If no Resend key configured ⇒ log the lead instead (nothing lost)
   ▼
303 redirect → /thank-you/   (visitor sees confirmation)
   +
Email lands in hello@timothy.place
```

- **No JavaScript** is involved — it's a plain form POST, robust by default.
- The form has **no file upload** (a v1 decision); visitors are pointed to *text* a
  photo instead.

### 4. Email

Two independent halves:

**Sending (outbound)** — [Resend](https://resend.com):
- The function calls `https://api.resend.com/emails`.
- Domain `riverbendhandymankc.com` is **verified** in Resend (DKIM/SPF DNS records),
  so mail sends from `quotes@riverbendhandymankc.com` to any inbox.
- Resend's mail DNS lives on the `send.` subdomain — isolated from the root domain.

**Receiving (inbound)** — Cloudflare Email Routing:
- There is **no real mailbox**. Email Routing *forwards* addresses to the owner.
- `info@` and `quotes@` (and a catch-all) → `hello@timothy.place`.
- This is why mail to those addresses doesn't bounce, even though we only ever *send*
  from them.

### 5. SEO

Built into `BaseLayout.astro` (so every page gets it) unless noted:
- **`<title>` + meta description** — per page (required props on the layout).
- **Canonical `<link>`** — one authoritative URL per page.
- **Open Graph / Twitter tags** — nice link previews in texts/social.
- **`LocalBusiness` JSON-LD** — built from `business.ts`, carries the full NAP, service
  area, and hours. Helps Google's local results.
- **`FAQPage` JSON-LD** — on `/faq/` (from `faq.ts`); can earn rich results.
- **`public/sitemap.xml`** + **`public/robots.txt`** — static; sitemap lists `/`,
  `/about/`, `/faq/`. Update the sitemap if pages are added/removed.
- `site:` in `astro.config.mjs` makes all the absolute URLs above correct.

> **To do once:** submit `https://riverbendhandymankc.com/sitemap.xml` in Google Search
> Console to speed up indexing.

---

## Configuration & secrets

The form needs three values. They live in **two places** — local dev and production —
and are **never committed to Git**.

| Variable | Meaning | Example |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend API key (the actual secret) | `re_…` |
| `QUOTE_TO_EMAIL` | Where leads are delivered | `hello@timothy.place` |
| `QUOTE_FROM_EMAIL` | The "From" line on lead emails | `River Bend Handyman <quotes@riverbendhandymankc.com>` |
| `SITE_PASSWORD` | Staging gate (see below). Set = site requires password; unset = public | *(unset in production once launched)* |

**Local development** → `.dev.vars` (gitignored). Read automatically by `astro dev` via
the Cloudflare adapter. Edit the file, restart the dev server.

**Production** → Cloudflare dashboard → the `riverbend` Worker → **Settings → Variables
and Secrets**. Set **all three as type "Secret"** (encrypted).

> **Why all three as Secrets:** secrets survive every redeploy and stay out of the repo.
> If a value were put in `wrangler.jsonc` instead, it'd be committed to GitHub *and* a
> redeploy could wipe dashboard-set plaintext vars. Secrets avoid both problems.

The code reads them with `import { env } from "cloudflare:workers"` (see
`src/pages/api/quote.ts`).

---

## Staging password gate (temporary)

A **password screen** can be put in front of the whole site while content is being
refined, so the public and search engines can't see draft content. It's HTTP Basic
Auth implemented in `src/middleware.ts`.

**It's controlled by the `SITE_PASSWORD` secret — nothing else:**

| `SITE_PASSWORD` | Result |
| --- | --- |
| Set to a value | Whole site requires the password (any username + that password) |
| Unset / empty | Site is fully public (middleware does nothing) |

### Turn the gate ON
Set the secret in Cloudflare → `riverbend` Worker → **Settings → Variables and Secrets**
→ add **`SITE_PASSWORD`** (type **Secret**) with your chosen password. Live within a
few seconds. Share the password with anyone who needs in (username can be anything).

### Turn the gate OFF (re-open to the public)
**Delete the `SITE_PASSWORD` secret** in that same screen. The site is public again
immediately — no code change, no deploy.

### Remove the machinery entirely (optional cleanup, post-launch)
The gate relies on `output: 'server'` in `astro.config.mjs`, which makes pages render
on-demand instead of as static files (a small speed cost). Once the gate is gone for
good and you want the fully static/fast setup back:
1. Delete `src/middleware.ts`
2. Remove the `output: 'server'` line from `astro.config.mjs`
3. Commit + push

> **Why `output: 'server'` is needed:** Astro middleware doesn't run on prerendered
> (static) pages, so the pages must be rendered on-demand for the gate to intercept
> them. Static assets (`/_astro/*`, favicons) are served directly and bypass the gate —
> harmless, since they're not the draft *content*.

For **local** testing, set `SITE_PASSWORD` in `.dev.vars` and run `npx wrangler dev`
(plain `astro dev` runs middleware on everything regardless, so it can't tell you
whether the production gate truly covers the static pages — use `wrangler dev` to verify).

---

## Local development

Node `>=22.12.0` required. From the repo root:

```sh
npm install              # first time
npm run dev              # dev server at http://localhost:4321
npm run dev -- --host    # also expose on your LAN (to preview on a phone)
npm run build            # production build to ./dist/
npm run preview          # preview the built site locally
npm run astro check      # typecheck (.astro + TS); prompts to install @astrojs/check
```

**Phone preview:** run with `--host`, connect the phone to the same Wi-Fi, and open the
`Network` URL it prints (e.g. `http://192.168.x.x:4321/`). Without `--host` the phone
can't reach it.

**Testing the form locally:** a real browser submit works; a raw `curl` POST needs an
`-H "Origin: http://localhost:4321"` header (Astro's CSRF check rejects mismatched
origins).

---

## Runbook (common tasks)

**Change the phone number / hours / service area**
→ edit `src/data/business.ts`, commit, push. Updates everywhere (incl. schema).

**Replace the placeholder testimonials**
→ edit `src/data/testimonials.ts` with real Google-review quotes.

**Show the Google rating / years-in-business in the trust strip**
→ set `proof.googleRating`, `proof.reviewCount`, `proof.yearsExperience` in
`business.ts` (they're `null` = hidden until filled).

**Add a gallery photo**
→ drop the image in `src/assets/gallery/`, add an entry (filename + caption + category)
in `src/components/Gallery.astro`. It gets optimized automatically.

**Add/edit an FAQ**
→ edit `src/data/faq.ts` (also updates the FAQ structured data).

**Change where leads are delivered**
→ update `QUOTE_TO_EMAIL` (the Secret in Cloudflare, and `.dev.vars` for local).

**Add another forwarding email address (e.g. `tim@…`)**
→ Cloudflare → domain → Email → Email Routing → add a route.

**Deploy a change**
→ `git push origin main`. That's it — Cloudflare builds and deploys automatically.

---

## Outstanding placeholders (content to replace before/at launch)

All wired — each drops into the spot noted and appears automatically:

- [ ] Real **testimonials** — `src/data/testimonials.ts`
- [ ] **Google rating + years in business** — `business.ts` `proof`
- [ ] **Before/after photos + real captions** — `src/assets/gallery/` + `Gallery.astro`
- [ ] **Owner story + headshot** — `src/pages/about.astro`
- [ ] **Confirmed service-area cities** — `business.ts` `serviceAreaCities`
- [ ] **FAQ answers** for pricing / payment / cancellation / licensing — `src/data/faq.ts`
- [ ] **Facebook + Google Business Profile URLs** — `business.ts` `social`
- [ ] Submit **sitemap to Google Search Console**
- [ ] Legal: confirm the **minor plumbing/electrical** wording is within what an
      unlicensed handyman may advertise in MO (see `PROJECT_BRIEF.md` §5)

---

## Gotchas worth remembering

- **Scoped CSS doesn't reach child components.** A `<style>` in component A can't size an
  SVG rendered by `Icon.astro` (the SVG carries Icon's scope). `Icon.astro` sizes itself
  via a `size` prop (inline style). Color still works because `color` *inherits*.
- **`--host` is required** to preview on a phone in dev (not needed in production).
- **CSRF origin check** returns 403 on cross-origin POSTs — that's protection, not a bug.
- **Astro v6 env access** is `import { env } from "cloudflare:workers"`, not
  `Astro.locals.runtime.env`.
- **Favicons cache hard** in browsers — use a private window to see updates.
