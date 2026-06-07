// Customer testimonials (PROJECT_BRIEF.md §6 #5 — "3 short ones pulled from Google
// reviews").
//
// ⚠️ PLACEHOLDER CONTENT — these are invented stand-ins to show the layout. Replace
// every one with a REAL quote pulled from an actual Google review before launch
// (quoting real reviews is both more convincing and avoids misrepresentation).

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  rating: number; // out of 5
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Showed up right on time and fixed three things off my list in one visit. Honest about the price up front. Will absolutely call again.",
    name: "Sarah M.",
    location: "Liberty, MO",
    rating: 5,
  },
  {
    quote:
      "Great communication and clean work. He mounted our TV and patched some drywall the same afternoon. Looks like new.",
    name: "Dave R.",
    location: "Gladstone, MO",
    rating: 5,
  },
  {
    quote:
      "Finally a handyman who calls back and shows up. Fair, friendly, and did exactly what he said he would. Highly recommend.",
    name: "Linda K.",
    location: "Parkville, MO",
    rating: 5,
  },
];
