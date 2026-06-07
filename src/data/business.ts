// Single source of truth for the business's contact facts (NAP — Name / Address /
// Phone — plus hours, service area, social). EVERYTHING on the site reads from here:
// header, footer, page copy, and the LocalBusiness schema markup we'll add later.
//
// Why this matters: inconsistent NAP across a site hurts local-search ranking, so the
// phone number / name / hours must be byte-for-byte identical everywhere. Centralizing
// them here means there's exactly one place to edit. See PROJECT_BRIEF.md §4.

export const business = {
  name: "River Bend Handyman LLC",
  shortName: "River Bend Handyman",
  tagline: "Honest, on-time handyman work in the Kansas City metro.",
  location: "Kansas City, MO",

  // Phone has two forms derived from the same number:
  //   `display` is what people read; `href` is what a browser dials on tap.
  phone: {
    display: "(417) 830-5628",
    href: "tel:+14178305628",
  },

  // Hours of operation, written the way it'll appear on the page.
  hours: "Mon–Fri, 9am – 5pm",

  serviceArea: "Kansas City metro",

  // ── Still to confirm with the owner (PROJECT_BRIEF.md §4 & §11) ──
  // Leave as empty strings/null until provided; templates check before rendering.
  email: "", // TODO(owner): confirm email address
  address: null as string | null, // service-area business, no storefront? TODO(owner): confirm
  social: {
    facebook: "", // TODO(owner): Facebook page URL
    googleBusiness: "", // TODO(owner): Google Business Profile URL (drives the most leads)
  },
} as const;

// Numeric social-proof shown in the trust strip. Each renders ONLY once it has a
// real value — we don't ship invented stats. Fill these in when the owner confirms.
// (Typed separately from `business` so TypeScript allows a number later.)
export const proof: {
  yearsExperience: number | null;
  googleRating: number | null; // e.g. 4.9
  reviewCount: number | null; // e.g. 37
} = {
  yearsExperience: null, // TODO(owner)
  googleRating: null, // TODO(owner)
  reviewCount: null, // TODO(owner)
};
