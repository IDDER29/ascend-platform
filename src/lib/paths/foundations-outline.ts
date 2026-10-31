/**
 * Foundations course outline data.
 * Live items are lessons/projects with a file; "soon" items show on the path page as "Coming soon".
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
    id: "bits",
    title: "Bits & representation",
    blurb: "How anything, a number, a letter or a colour, becomes 0s and 1s.",
    items: [
      { kind: "live", slug: "what-is-a-bit", title: "What is a bit?", timeMin: 4 },
      { kind: "live", slug: "binary-and-number-bases", title: "Binary & number bases", timeMin: 7 },
      { kind: "soon", id: "negative-numbers", title: "Negative numbers: two's complement", timeMin: 8 },
      { kind: "soon", id: "bytes-words-meaning", title: "Bytes, words, and meaning", timeMin: 8 },
      { kind: "soon", id: "text-ascii-utf8", title: "Text: ASCII and UTF-8", timeMin: 8 },
    ],
  },
  {
    id: "logic",
    title: "Logic & gates",
    blurb: "Boolean logic, gates in hardware, and circuits that add and choose.",
    items: [
      { kind: "live", slug: "boolean-logic-and-truth-tables", title: "Boolean logic & truth tables", timeMin: 7 },
      { kind: "live", slug: "logic-gates-from-switches-to-circuits", title: "Logic gates, from switches to circuits", timeMin: 8 },
      { kind: "live", slug: "project-half-adder", title: "Project: Half-adder", timeMin: 25, role: "project" },
      { kind: "soon", id: "full-adder", title: "Full adder and the 4-bit adder", timeMin: 9 },
      { kind: "soon", id: "mux-decoder", title: "Choosing with gates: multiplexers and decoders", timeMin: 9 },
    ],
  },
  {
    id: "memory",
    title: "Memory & time",
    blurb: "How a circuit remembers: latches, the clock, registers and addressed memory.",
    items: [
      { kind: "soon", id: "latches-and-flip-flops", title: "Remembering a bit: latches and flip-flops", timeMin: 9 },
      { kind: "soon", id: "clocks-and-registers", title: "The clock and registers", timeMin: 8 },
      { kind: "soon", id: "memory-and-addresses", title: "Memory as numbered boxes", timeMin: 8 },
    ],
  },
  {
    id: "machine-runs",
    title: "How a machine runs",
    blurb: "The fetch-execute loop, and a tiny CPU built from everything before it.",
    items: [
      { kind: "live", slug: "the-fetch-execute-loop", title: "The fetch-execute loop", timeMin: 9 },
      { kind: "soon", id: "from-gates-to-cpu", title: "From gates to a tiny CPU", timeMin: 12 },
      { kind: "soon", id: "project-tiny-cpu", title: "Project: Run a program on a tiny CPU", timeMin: 25, role: "project" },
    ],
  },
  {
    id: "software",
    title: "From hardware to software",
    blurb: "How the code you write becomes the instructions the CPU runs.",
    items: [
      { kind: "soon", id: "machine-code-to-languages", title: "Machine code, assembly and high-level languages", timeMin: 9 },
      { kind: "soon", id: "compilers-and-interpreters", title: "Compilers and interpreters", timeMin: 8 },
    ],
  },
  {
    id: "conclusion",
    title: "Wrap-up",
    blurb: "Put it all together, then pick where to go next.",
    items: [
      { kind: "soon", id: "project-4-bit-calculator", title: "Project: A 4-bit calculator", timeMin: 30, role: "project" },
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

/** The outline items not written yet, per section, in order (shown on the path page as "Coming soon"). */
export function foundationsUpcoming(): Record<string, { id: string; title: string; project: boolean }[]> {
  return Object.fromEntries(
    FOUNDATIONS_OUTLINE.map((section) => [
      section.id,
      section.items.flatMap((item) =>
        item.kind === "soon" ? [{ id: item.id, title: item.title, project: item.role === "project" }] : [],
      ),
    ]),
  );
}

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
