// The service categories shown on the homepage and (later) the Services page.
// Kept here so copy is easy to edit in one place.
//
// LEGAL FRAMING (PROJECT_BRIEF.md §5): in Missouri, non-trivial plumbing and
// electrical work requires a licensed contractor. So those two categories are
// deliberately scoped to MINOR repairs / small jobs — faucet & fixture swaps,
// outlet/switch replacement — never full installs or "licensed trade" work.
// TODO(owner): confirm exactly what's legally offerable in KC / Jackson / Clay /
// Platte counties before this list is considered final.

export interface Service {
  icon: string; // key into the Icon.astro icon set (e.g. "hammer")
  title: string;
  blurb: string;
  examples: string[];
}

export const services: Service[] = [
  {
    icon: "hammer",
    title: "Carpentry & Repair",
    blurb: "Trim, doors, drywall, and the framing fixes that keep your house solid.",
    examples: ["Trim & molding", "Door repair & hanging", "Drywall patching", "Framing fixes"],
  },
  {
    icon: "wrench",
    title: "Minor Plumbing",
    blurb: "Small plumbing jobs done right — the leaks and swaps that don't need a remodel.",
    examples: ["Faucet & fixture swaps", "Toilet repair", "Garbage disposals", "Leak fixes"],
  },
  {
    icon: "outlet",
    title: "Minor Electrical",
    blurb: "Everyday electrical fixes — replacing what's worn out, not rewiring the house.",
    examples: ["Light fixtures", "Outlet replacement", "Switch & dimmer swaps", "Fixture swaps"],
  },
  {
    icon: "roller",
    title: "Painting & Finishing",
    blurb: "Fresh paint and clean finish work for rooms, trim, and touch-ups.",
    examples: ["Interior touch-ups", "Small rooms", "Trim & doors", "Caulking & finishing"],
  },
  {
    icon: "tree",
    title: "Outdoor & Decks",
    blurb: "Keeping the outside of your home in good shape, season after season.",
    examples: ["Fence repair", "Deck boards", "Gutter repair", "Pressure washing"],
  },
  {
    icon: "tv",
    title: "Mounting & Assembly",
    blurb: "We hang it, mount it, and put it together — straight and secure.",
    examples: ["TV mounting", "Shelving", "Flat-pack furniture", "Baby gates"],
  },
  {
    icon: "leaf",
    title: "Seasonal Upkeep",
    blurb: "The seasonal maintenance that's easy to put off — handled.",
    examples: ["Gutter cleaning", "Weatherstripping", "Storm prep", "Winterizing"],
  },
];
