// FAQ content (PROJECT_BRIEF.md "FAQ" — good for SEO). Drives both the visible
// accordion and the FAQPage structured data.
//
// Several answers are marked PLACEHOLDER — TODO(owner): confirm pricing structure,
// payment methods, and cancellation policy before launch.

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: "What areas do you serve?",
    a: "We serve Kansas City, MO and the surrounding Northland communities — including Liberty, Gladstone, Smithville, Parkville, North Kansas City and more. Not sure if you're in range? Just give us a call.",
  },
  {
    q: "How does pricing work?",
    // TODO(owner): confirm — hourly vs. flat rate, and whether there's a minimum charge.
    a: "Every job is a little different, so we give you a clear estimate before any work starts. There's no charge for the estimate, and we'll never start work without your go-ahead.",
  },
  {
    q: "How do estimates work?",
    a: "Estimates are free. Tell us about the job — a photo helps — and we'll give you an honest price up front. No pressure and no obligation.",
  },
  {
    q: "What payment methods do you accept?",
    // TODO(owner): confirm accepted methods (cash, check, card, etc.).
    a: "We accept several convenient payment options. We'll go over the details with you when we confirm your estimate.",
  },
  {
    q: "Who supplies the materials?",
    a: "Whatever's easiest for you. We're happy to pick up materials for the job, or use what you already have on hand — just let us know.",
  },
  {
    q: "Are you licensed and insured?",
    // TODO(owner): confirm exact licensing/insurance wording you can legally make.
    a: "Yes — we're licensed and insured, so you can feel comfortable having us work in your home.",
  },
  {
    q: "What size jobs do you take on?",
    a: "We specialize in small-to-midsize repairs and home projects — carpentry, painting, mounting, minor plumbing and electrical, and more. For larger jobs that legally require a licensed trade contractor, we'll tell you straight and can point you to a pro we trust.",
  },
  {
    q: "What's your cancellation policy?",
    // TODO(owner): confirm cancellation/rescheduling policy.
    a: "Life happens — just give us a call to reschedule and we'll find a new time that works.",
  },
];
