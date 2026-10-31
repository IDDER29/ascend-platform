import type { LevelId } from "@/lib/content/schema";

/** What a curriculum project needs before its badge can be earned. */
export type ProjectRequirement =
  | { kind: "lesson"; level: LevelId; slug: string }
  | { kind: "level"; level: LevelId };

export type CurriculumProject = {
  id: string;
  title: string;
  /** The name as it reads mid-sentence: "half adder", "ShellForge". */
  inSentence: string;
  /** One sentence: what shipping it proves. */
  proves: string;
  level: LevelId;
  requires: ProjectRequirement;
  /** Badge from `ACHIEVEMENTS` earned when the requirement is met and a repo link is added. */
  badgeId: string;
  /** Where the project lives; null means the lesson page (resolved by the caller). */
  href: string | null;
};

/** Curriculum project work, in curriculum order. Every `project-*` lesson must appear here. */
export const CURRICULUM_PROJECTS: CurriculumProject[] = [
  {
    id: "codebook",
    title: "Codebook",
    inSentence: "codebook",
    proves: "Designs a code with the fewest bits, and shows meaning lives in the codebook, not the bits.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-codebook" },
    badgeId: "code-maker",
    href: null,
  },
  {
    id: "machine-atlas",
    title: "Machine Atlas",
    inSentence: "Machine Atlas",
    proves: "Maps a real device into its five parts and traces one action through it, step by step.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-machine-atlas" },
    badgeId: "cartographer",
    href: null,
  },
  {
    id: "number-workbench",
    title: "Number workbench",
    inSentence: "number workbench",
    proves: "Converts between decimal, binary and hex, and tells an unsigned carry from a signed overflow.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-number-workbench" },
    badgeId: "converter",
    href: null,
  },
  {
    id: "byte-lab",
    title: "Byte Lab",
    inSentence: "Byte Lab",
    proves: "Reads the same bytes as numbers, text and colours, and knows a format is needed to be sure.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-byte-lab" },
    badgeId: "byte-detective",
    href: null,
  },
  {
    id: "half-adder",
    title: "Half adder",
    inSentence: "half adder",
    proves: "Adds two bits using nothing but logic gates.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-half-adder" },
    badgeId: "gate-builder",
    href: null,
  },
  {
    id: "gate-workbench",
    title: "Logic gate workbench",
    inSentence: "logic gate workbench",
    proves: "Builds NOT, AND, OR, XOR and a multiplexer from NAND gates alone.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-gate-workbench" },
    badgeId: "nand-maker",
    href: null,
  },
  {
    id: "alu",
    title: "8-bit ALU",
    inSentence: "8-bit ALU",
    proves: "Builds a one-bit ALU slice for add, subtract, AND and OR, and chains it into bytes.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-alu" },
    badgeId: "alu-architect",
    href: null,
  },
  {
    id: "register-lab",
    title: "Register and counter lab",
    inSentence: "register and counter lab",
    proves: "Builds registers with load and a counter with enable and reset, checked tick by tick.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-register-lab" },
    badgeId: "clockmaker",
    href: null,
  },
  {
    id: "memory-board",
    title: "Memory board",
    inSentence: "memory board",
    proves: "Writes and reads memory by its signals, and diagnoses a faulty decoder from the timeline.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-memory-board" },
    badgeId: "memory-keeper",
    href: null,
  },
  {
    id: "sequencer",
    title: "Tiny sequencer",
    inSentence: "tiny sequencer",
    proves: "Builds a three-step sequencer and carries out a read-modify-write from its signals.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-sequencer" },
    badgeId: "conductor",
    href: null,
  },
  {
    id: "build-datapath",
    title: "Datapath by hand",
    inSentence: "datapath",
    proves: "Fetches and runs instructions by hand, choosing every control signal tick by tick.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-build-datapath" },
    badgeId: "bus-driver",
    href: null,
  },
  {
    id: "tiny-cpu",
    title: "Tiny CPU program",
    inSentence: "tiny CPU program",
    proves: "Plans, predicts and traces a program on a CPU, one instruction at a time.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-tiny-cpu" },
    badgeId: "cpu-tracer",
    href: null,
  },
  {
    id: "build-the-cpu",
    title: "Tiny CPU control unit",
    inSentence: "tiny CPU control unit",
    proves: "Writes the control table for every instruction and runs real programs on it.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-build-the-cpu" },
    badgeId: "microcoder",
    href: null,
  },
  {
    id: "two-designs",
    title: "Two designs, one instruction set",
    inSentence: "two-designs comparison",
    proves: "Compares two control designs for one instruction set by their ticks per instruction.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-two-designs" },
    badgeId: "efficiency-expert",
    href: null,
  },
  {
    id: "assembly-puzzles",
    title: "Assembly puzzles",
    inSentence: "assembly puzzles",
    proves: "Writes small assembly programs that meet exact goals, including a pointer loop and a comparison without greater-than.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-assembly-puzzles" },
    badgeId: "puzzle-solver",
    href: null,
  },
  {
    id: "assembler",
    title: "Assembler by hand",
    inSentence: "assembler",
    proves: "Runs both passes of an assembler by hand, finds an assembler bug and writes the procedure.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-assembler" },
    badgeId: "assembler",
    href: null,
  },
  {
    id: "subroutine-library",
    title: "Subroutine library",
    inSentence: "subroutine library",
    proves: "Writes subroutines that take arguments in registers, save what they use and call each other.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-subroutine-library" },
    badgeId: "librarian",
    href: null,
  },
  {
    id: "shellforge",
    title: "ShellForge",
    inSentence: "ShellForge",
    proves: "A working Unix shell: processes, pipes, redirection and signals.",
    level: "level-03-systems-software",
    requires: { kind: "level", level: "level-03-systems-software" },
    badgeId: "ship-it",
    href: "/projects/shellforge",
  },
];

export function curriculumProject(id: string): CurriculumProject | undefined {
  return CURRICULUM_PROJECTS.find((p) => p.id === id);
}
