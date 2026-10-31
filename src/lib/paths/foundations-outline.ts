/**
 * Foundations course outline data.
 * UI renders live rows in topic cards (lessons + projects); soon/link kept for later.
 */

export type FoundationsItemRole = "lesson" | "project";

export type FoundationsOutlineItem =
  | {
      kind: "live";
      slug: string;
      title: string;
      timeMin: number;
      /** Default lesson; projects get a distinct outline icon. */
      role?: FoundationsItemRole;
    }
  | {
      kind: "soon";
      id: string;
      title: string;
      timeMin?: number;
      role?: FoundationsItemRole;
    }
  | {
      kind: "link";
      id: string;
      title: string;
      href: string;
      hint?: string;
    };

export type FoundationsOutlineSection = {
  id: string;
  title: string;
  /** Short overview of what this block teaches. */
  blurb?: string;
  items: FoundationsOutlineItem[];
};

export const FOUNDATIONS_LEVEL = "level-00-bits-logic" as const;

export const FOUNDATIONS_OUTLINE: FoundationsOutlineSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    blurb: "How this course works and why we start at the machine.",
    items: [
      {
        kind: "soon",
        id: "how-this-course-works",
        title: "How this course will work",
        timeMin: 5,
      },
      {
        kind: "soon",
        id: "why-the-machine-first",
        title: "Why start with the machine",
        timeMin: 6,
      },
    ],
  },
  {
    id: "bits",
    title: "Bits & representation",
    blurb: "What a bit is, and how patterns of bits become numbers.",
    items: [
      {
        kind: "live",
        slug: "what-is-a-bit",
        title: "What is a bit?",
        timeMin: 4,
      },
      {
        kind: "live",
        slug: "binary-and-number-bases",
        title: "Binary & number bases",
        timeMin: 7,
      },
      {
        kind: "soon",
        id: "bytes-words-meaning",
        title: "Bytes, words, and meaning",
        timeMin: 8,
      },
    ],
  },
  {
    id: "logic",
    title: "Logic & gates",
    blurb: "Boolean logic, gates in hardware, then a hands-on half-adder project.",
    items: [
      {
        kind: "live",
        slug: "boolean-logic-and-truth-tables",
        title: "Boolean logic & truth tables",
        timeMin: 7,
      },
      {
        kind: "live",
        slug: "logic-gates-from-switches-to-circuits",
        title: "Logic gates, from switches to circuits",
        timeMin: 8,
      },
      {
        kind: "live",
        slug: "project-half-adder",
        title: "Project: Half-adder",
        timeMin: 25,
        role: "project",
      },
    ],
  },
  {
    id: "machine-runs",
    title: "How a machine runs",
    blurb: "The fetch–execute loop: how a CPU runs a program one instruction at a time.",
    items: [
      {
        kind: "live",
        slug: "the-fetch-execute-loop",
        title: "The fetch-execute loop",
        timeMin: 9,
      },
      {
        kind: "soon",
        id: "from-gates-to-cpu",
        title: "From gates to a tiny CPU",
        timeMin: 12,
      },
    ],
  },
  {
    id: "conclusion",
    title: "Conclusion",
    blurb: "Where Foundations leaves off, and what to pick next.",
    items: [
      {
        kind: "link",
        id: "choose-path",
        title: "Choose your path forward",
        href: "/paths",
        hint: "Pick a role path after Foundations",
      },
    ],
  },
];

export type FoundationsLiveSection = {
  id: string;
  title: string;
  blurb?: string;
  items: Extract<FoundationsOutlineItem, { kind: "live" }>[];
};

/** Topic cards with live lessons/projects only (skips empty / soon-only sections). */
export function foundationsLiveSections(): FoundationsLiveSection[] {
  return FOUNDATIONS_OUTLINE.map((section) => ({
    id: section.id,
    title: section.title,
    blurb: section.blurb,
    items: section.items.filter(
      (item): item is Extract<FoundationsOutlineItem, { kind: "live" }> =>
        item.kind === "live",
    ),
  })).filter((section) => section.items.length > 0);
}
