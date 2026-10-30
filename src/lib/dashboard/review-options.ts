/**
 * "Ways to review" on the dashboard, beside the Practice card: the review
 * options worth doing now — your misses, cards you got right but shakily
 * (`shaky.ts`), the path you're on (review it before you continue), your other
 * paths with cards due, your saved decks, and what you saved as "Didn't get
 * it". Each says how much is waiting.
 */
export type ReviewIcon = "misses" | "shaky" | "path" | "deck" | "flagged";

export type ReviewOption = {
  id: string;
  icon: ReviewIcon;
  /** For path rows: which path, so the row wears that path's own icon. */
  pathSlug: string | null;
  /** The cards this set covers: its own memory curve is drawn from them. */
  cardIds: string[];
  /** Cards a review of it takes now (for "about N min"); 0 when nothing's waiting. */
  toDo: number;
  title: string;
  detail: string;
  /** "3 to fix", "12 due", "All clear". */
  badge: string;
  /** Something is waiting: drawn stronger. */
  waiting: boolean;
  href: string;
};

export type ReviewOptionsInput = {
  /** Cards you missed that are due again now. */
  misses: string[];
  missesHref: string;
  /** Cards you got right but slowly, or just after missing them. */
  shaky: { ids: string[]; slow: number; href: string | null };
  /** Each path's cards you've unlocked, by Practice path slug. */
  pathCards: Record<string, string[]>;
  /** Cards due now, by Practice path slug. */
  dueByPath: Record<string, number>;
  /** The path you're on (from Your paths); its review sits first after misses. */
  activePath: { slug: string; title: string } | null;
  /** Your other joined paths. */
  otherPaths: { slug: string; title: string }[];
  pathHref: (slug: string, due: number) => string;
  decks: { id: string; name: string; due: number; total: number; href: string | null; cardIds: string[] }[];
  /** "Didn't get it" bookmarks, and the Practice cards among them. */
  flagged: { count: number; cardIds: string[] };
};

const due = (n: number) => `${n} due`;

export function buildReviewOptions(input: ReviewOptionsInput): ReviewOption[] {
  const options: ReviewOption[] = [
    {
      id: "misses",
      icon: "misses",
      pathSlug: null,
      cardIds: input.misses,
      toDo: input.misses.length,
      title: "Fix your misses",
      detail: "The cards you got wrong, while they're fresh.",
      badge: input.misses.length > 0 ? `${input.misses.length} to fix` : "All clear",
      waiting: input.misses.length > 0,
      href: input.missesHref,
    },
  ];

  if (input.shaky.ids.length > 0 && input.shaky.href) {
    options.push({
      id: "shaky",
      icon: "shaky",
      pathSlug: null,
      cardIds: input.shaky.ids,
      toDo: input.shaky.ids.length,
      title: "Right, but shaky",
      detail:
        input.shaky.slow > 0
          ? "Cards you got right, but slowly or just after missing them."
          : "Cards you got right just after missing them.",
      badge: `${input.shaky.ids.length} ${input.shaky.ids.length === 1 ? "card" : "cards"}`,
      waiting: true,
      href: input.shaky.href,
    });
  }

  if (input.activePath) {
    const n = input.dueByPath[input.activePath.slug] ?? 0;
    options.push({
      id: `path:${input.activePath.slug}`,
      icon: "path",
      pathSlug: input.activePath.slug,
      cardIds: input.pathCards[input.activePath.slug] ?? [],
      toDo: n,
      title: `Review ${input.activePath.title}`,
      detail: "Your current path: review what you've learned on it before you continue.",
      badge: n > 0 ? due(n) : "All clear",
      waiting: n > 0,
      href: input.pathHref(input.activePath.slug, n),
    });
  }

  for (const path of input.otherPaths) {
    const n = input.dueByPath[path.slug] ?? 0;
    if (n === 0) continue;
    options.push({
      id: `path:${path.slug}`,
      icon: "path",
      pathSlug: path.slug,
      cardIds: input.pathCards[path.slug] ?? [],
      toDo: n,
      title: path.title,
      detail: "Another path you follow, with cards waiting.",
      badge: due(n),
      waiting: true,
      href: input.pathHref(path.slug, n),
    });
  }

  for (const deck of input.decks) {
    if (!deck.href) continue;
    options.push({
      id: `deck:${deck.id}`,
      icon: "deck",
      pathSlug: null,
      cardIds: deck.cardIds,
      toDo: deck.due,
      title: deck.name,
      detail: "Your custom deck.",
      badge: deck.due > 0 ? due(deck.due) : `${deck.total} ${deck.total === 1 ? "card" : "cards"}`,
      waiting: deck.due > 0,
      href: deck.href,
    });
  }

  if (input.flagged.count > 0) {
    options.push({
      id: "flagged",
      icon: "flagged",
      pathSlug: null,
      cardIds: input.flagged.cardIds,
      toDo: 0,
      title: "Didn't get it",
      detail: "What you saved in Bookmarks to come back to.",
      badge: `${input.flagged.count} saved`,
      waiting: true,
      href: "/bookmarks",
    });
  }

  // Misses and shaky cards first, then the current path; after that, what's waiting before what's clear.
  const lead = options.filter((o) => o.id === "misses" || o.id === "shaky");
  const current = options.filter((o) => input.activePath && o.id === `path:${input.activePath.slug}`);
  const rest = options.filter((o) => !lead.includes(o) && !current.includes(o));
  return [...lead, ...current, ...rest.sort((a, b) => Number(b.waiting) - Number(a.waiting))];
}
