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
  // Course: Bits & Data
  {
    id: "bits",
    title: "Numbers in binary",
    blurb: "Bits, place value, negative numbers, and working on bits directly.",
    items: [
      { kind: "live", slug: "what-is-a-bit", title: "What is a bit?", timeMin: 4 },
      { kind: "live", slug: "binary-and-number-bases", title: "Binary & number bases", timeMin: 7 },
      { kind: "live", slug: "negative-numbers", title: "Negative numbers: two's complement", timeMin: 8 },
      { kind: "live", slug: "bitwise-operations", title: "Bitwise operations: AND, OR, XOR, shifts and masks", timeMin: 9 },
      { kind: "soon", id: "overflow", title: "Overflow: when numbers run out of bits", timeMin: 7 },
    ],
  },
  {
    id: "data",
    title: "Text, sizes and fractions",
    blurb: "The same bits as letters, types of different widths, and numbers with a point.",
    items: [
      { kind: "soon", id: "bytes-words-meaning", title: "Bytes, words and types: how wide is a number?", timeMin: 8 },
      { kind: "soon", id: "text-ascii-utf8", title: "Text: ASCII and UTF-8", timeMin: 8 },
      { kind: "soon", id: "floating-point", title: "Fractions: floating point and why 0.1 + 0.2 isn't 0.3", timeMin: 9 },
      { kind: "soon", id: "project-byte-lab", title: "Project: The Byte Lab", timeMin: 20, role: "project" },
    ],
  },
  // Course: Logic & Circuits
  {
    id: "logic",
    title: "Logic & gates",
    blurb: "Boolean logic, gates in hardware, and circuits that add.",
    items: [
      { kind: "live", slug: "boolean-logic-and-truth-tables", title: "Boolean logic & truth tables", timeMin: 7 },
      { kind: "live", slug: "logic-gates-from-switches-to-circuits", title: "Logic gates, from switches to circuits", timeMin: 8 },
      { kind: "live", slug: "project-half-adder", title: "Project: Half-adder", timeMin: 25, role: "project" },
      { kind: "live", slug: "full-adder-and-4-bit-adder", title: "Full adder and the 4-bit adder", timeMin: 9 },
    ],
  },
  {
    id: "circuits",
    title: "Circuits that calculate",
    blurb: "Choosing between signals, and the arithmetic unit at the heart of a CPU.",
    items: [
      { kind: "soon", id: "mux-decoder", title: "Choosing with gates: multiplexers and decoders", timeMin: 9 },
      { kind: "soon", id: "the-alu", title: "The ALU: one circuit, many operations", timeMin: 9 },
      { kind: "soon", id: "project-4-bit-calculator", title: "Project: A 4-bit calculator", timeMin: 30, role: "project" },
    ],
  },
  // Course: Memory & State
  {
    id: "memory",
    title: "Memory & time",
    blurb: "How a circuit remembers: latches, the clock, registers, addressed memory and state.",
    items: [
      { kind: "live", slug: "latches-and-flip-flops", title: "Remembering a bit: latches and flip-flops", timeMin: 9 },
      { kind: "live", slug: "clocks-and-registers", title: "The clock and registers", timeMin: 8 },
      { kind: "live", slug: "memory-and-addresses", title: "Memory as numbered boxes", timeMin: 8 },
      { kind: "soon", id: "state-machines", title: "State machines: circuits that follow steps", timeMin: 9 },
      { kind: "soon", id: "project-memory-machine", title: "Project: A tiny memory machine", timeMin: 20, role: "project" },
    ],
  },
  // Course: Build a CPU
  {
    id: "isa",
    title: "Instructions",
    blurb: "The CPU's vocabulary, and programs stored as bits in memory.",
    items: [
      { kind: "live", slug: "instruction-set", title: "An instruction set: the CPU's vocabulary", timeMin: 9 },
    ],
  },
  {
    id: "machine-runs",
    title: "How a machine runs",
    blurb: "The fetch-execute loop, branching, input and output, and a tiny CPU built from everything before it.",
    items: [
      { kind: "live", slug: "the-fetch-execute-loop", title: "The fetch-execute loop", timeMin: 9 },
      { kind: "live", slug: "jumps-and-loops", title: "Jumps and loops: how a CPU decides", timeMin: 8 },
      { kind: "live", slug: "from-gates-to-cpu", title: "From gates to a tiny CPU: datapath and control", timeMin: 12 },
      { kind: "live", slug: "input-and-output", title: "Input and output: talking to the outside world", timeMin: 8 },
      { kind: "live", slug: "project-tiny-cpu", title: "Project: Run a program on a tiny CPU", timeMin: 25, role: "project" },
    ],
  },
  // Course: From Hardware to Software
  {
    id: "software",
    title: "From code to instructions",
    blurb: "How the code you write becomes the instructions a CPU runs.",
    items: [
      { kind: "soon", id: "assembly-and-assembler", title: "Assembly and the assembler", timeMin: 9 },
      { kind: "soon", id: "compilers-and-interpreters", title: "High-level languages: compilers and interpreters", timeMin: 9 },
      { kind: "soon", id: "compile-link-load", title: "From source to running program: compile, link, load", timeMin: 9 },
    ],
  },
  {
    id: "runtime",
    title: "Programs at run time",
    blurb: "Functions and the call stack, and the operating system every program runs on.",
    items: [
      { kind: "soon", id: "variables-in-memory", title: "Variables in memory: x = x + 1, step by step", timeMin: 8 },
      { kind: "soon", id: "functions-and-the-stack", title: "Functions and the call stack", timeMin: 9 },
      { kind: "soon", id: "the-operating-system", title: "The operating system: processes and system calls", timeMin: 9 },
    ],
  },
  {
    id: "conclusion",
    title: "Wrap-up",
    blurb: "Trace a whole program on the tiny machine, then pick where to go next.",
    items: [
      { kind: "soon", id: "project-trace-a-program", title: "Final project: Trace a program end to end", timeMin: 30, role: "project" },
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
