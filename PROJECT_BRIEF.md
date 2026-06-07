# PROJECT BRIEF — River Bend Handyman LLC Website

> This document is the planning + content reference for the site. It is meant to be
> read by Claude Code at the start of a build session. `CLAUDE.md` should reference
> this file rather than duplicating it.

---

## 1. Overview

A lightweight marketing/brochure website for **River Bend Handyman LLC**, a handyman
service based in **Kansas City, MO**. The site's job is to legitimize the business and
convert visitors into phone calls and quote requests. It is **not** an app — no login,
no database, no booking engine.

Primary visitor mindset: someone with a broken thing or a list of nagging home projects,
usually skimming on a phone, deciding quickly whether to call.

**Primary conversion goal:** phone call or quote request.
**Secondary goal:** legitimize the business when someone Googles it after a referral or yard sign.

---

## 2. Tech stack

- **Framework:** Astro (basic starter as the base)
- **Hosting/deploy:** Cloudflare Pages (`@astrojs/cloudflare` adapter)
- **Language:** TypeScript (strict)
- **Styling:** {{ decide — plain CSS / Tailwind / Astro scoped styles. Keep it simple. }}
- **Images:** Astro `<Image>` component required for all photos. No raw multi-MB phone
  photos shipped to the browser — every image goes through optimization.
- **Contact form backend:** static site, so the form needs a third-party endpoint.
  Candidates: Web3Forms, Formspree, or a Cloudflare Pages Function. {{ decide }}

---

## 3. Brand

- **Name:** River Bend Handyman LLC
- **Location tagline:** Kansas City, MO
- **Logo:** circular brown badge — house silhouette + hammer + river curve (provided separately)
- **Primary color:** dark brown — *sample the exact hex from the logo file* rather than guessing
- **Aesthetic:** rustic, trustworthy, local, hands-on. Plain-spoken, not corporate.
- **Voice:** honest, direct, friendly. Talks like a reliable neighbor, not a marketing department.
  Example value prop: "Honest, on-time handyman work in the Northland."

---

## 4. NAP (Name / Address / Phone) — CRITICAL for local SEO

These MUST be byte-for-byte identical everywhere they appear (site, footer, schema markup,
Google Business Profile, Facebook, directories). Inconsistency hurts local ranking.

- **Name:** River Bend Handyman LLC
- **Address:** {{ TO CONFIRM — or "service-area business, no storefront" }}
- **Phone:** {{ TO CONFIRM }}
- **Email:** {{ TO CONFIRM }}
- **Hours:** {{ TO CONFIRM }}
- **Service area:** Kansas City metro + suburbs — {{ confirm list, e.g. Liberty, Smithville,
  Parkville, Gladstone, North Kansas City }}

---

## 5. Legal / compliance note (IMPORTANT)

In Missouri, certain **plumbing and electrical** work requires a licensed contractor.
Service copy must stay within what an unlicensed handyman can legally advertise and perform.

- Frame plumbing/electrical offerings as **minor repairs / small jobs** only
  (e.g. "faucet and fixture swaps," "outlet and switch replacement"), not full installs.
- Do NOT advertise licensed trades work.
- {{ Owner to confirm exactly what they can legally do in KC / Jackson / Clay / Platte
  counties before the services list is finalized. }}

---

## 6. Site information architecture

### Home (single scrolling page does most of the work)
1. **Hero** — business name, one-line value prop, prominent phone number, "Get a Quote"
   button, service area line.
2. **Trust strip** — licensed / insured / bonded badges, years of experience, jobs completed,
   Google rating + star count.
3. **Services overview** — 6–8 tiles or a clean icon list.
4. **Before/after gallery** — 4–6 best pairs, link to full gallery.
5. **Testimonials** — 3 short ones pulled from Google reviews.
6. **Service area** — simple map or list of cities/zips.
7. **How it works** — 3 steps: Call → Free estimate → We fix it.
8. **Final CTA** — phone + quote form.

### Services
Grouped by category for scannability (see section 7).

### Gallery
- Organized by category matching services.
- Before/after pairs, 1–2 sentence captions.
- Lazy-loaded, optimized images.

### About
- Owner photo (big trust driver — people want to see who's coming to their house).
- Short story: why they started, local roots, family.
- Values: punctuality, clean work, honest pricing.
- Licensed/insured statement.
- Truck/branding photo if available.

### Contact / Request a Quote
- Phone number (largest element on the page).
- Text-message option (homeowners love texting photos of the problem).
- Email.
- Form fields: name, phone, address/zip, type of work, description, optional photo upload,
  preferred contact method.
- Hours of operation.
- Response-time expectation ("We respond within 24 hours").

### FAQ (good for SEO)
- Service area boundaries
- Pricing structure (hourly vs flat? minimum charge?)
- How estimates work
- Payment methods
- Cancellation policy
- Who supplies materials
- Insurance/licensing specifics
- Small-job vs big-job thresholds

### Footer (every page)
- Phone, email, service area, hours
- Social links (Facebook especially — where local trades customers are)
- Link to Google Business Profile for reviews
- "Licensed & Insured" line

---

## 7. Service categories

Keep wording within the legal framing in section 5.

- **Carpentry & repair** — trim, doors, drywall, framing fixes
- **Plumbing (minor)** — faucets, toilets, garbage disposals, leaks
- **Electrical (minor)** — fixtures, outlets, switches
- **Painting & finishing** — interior touch-ups, small rooms
- **Outdoor & decks** — fence repair, deck boards, gutters, pressure washing
- **Mounting & assembly** — TVs, shelving, flat-pack furniture, baby gates
- **Seasonal** — gutter cleaning, weatherstripping

---

## 8. SEO essentials (bake in from the start)

- Page title pattern: `Service — River Bend Handyman | Kansas City, MO`
- `Schema.org` **LocalBusiness** markup with NAP, consistent everywhere.
- Meta descriptions per page.
- Semantic HTML, proper heading hierarchy.
- Fast loads (Astro ships minimal JS by default — keep it that way).
- Sitemap + robots.txt.
- City + service combo pages (e.g. "drywall repair Liberty MO") — **later**, not v1.

---

## 9. v1 scope

**In scope:**
- Home, Services, Gallery, About, Contact/Quote, FAQ
- Working quote form (third-party endpoint)
- Optimized image pipeline
- LocalBusiness schema + on-page SEO
- Mobile-first responsive design

**Out of scope (do NOT build in v1):**
- Online booking / scheduling
- Blog
- Live chat
- Pricing calculators
- Multi-language
- Any login / account system

Add these later only if there's a real, stated reason.

---

## 10. Design direction

- **Mobile-first.** Most visitors are on a phone, in a hurry.
- Phone number visible and tappable (`tel:` link) at the top of every page.
- Big, obvious CTAs. Minimal cognitive load.
- Warm, earthy palette anchored on the logo's brown.
- Real photos > stock photos. Real owner photo > generic clip art.
- Accessible: sufficient contrast, alt text on all images, keyboard-navigable.

---

## 11. Open items for the owner to supply

- [ ] Phone, email, hours, address (or confirm service-area-only)
- [ ] Confirmed list of service-area cities
- [ ] Licensing/insurance/bonding details + what's legally offerable
- [ ] Before/after project photos
- [ ] Owner headshot + short bio
- [ ] Google Business Profile URL (set this up — it drives more leads than the site)
- [ ] Facebook page URL
- [ ] Domain name
- [ ] Real customer reviews to quote as testimonials
