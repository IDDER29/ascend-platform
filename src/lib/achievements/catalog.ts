import type { LevelId } from "@/lib/content/schema";

/**
 * One condition a badge asks for. A badge is earned when every one of its
 * rules holds; each rule is checked from real records only — lesson
 * completions, project links, Practice cards and sessions, or other badges.
 */
export type BadgeRule =
  | { kind: "lessons"; count: number }
  | { kind: "topic"; topic: LevelId }
  | { kind: "anyTopic" }
  | { kind: "allLessons" }
  | { kind: "project"; projectId: string }
  | { kind: "solidCards"; count: number }
  | { kind: "cleanRun"; minCards: number }
  | { kind: "streak"; days: number }
  | { kind: "sessions"; count: number }
  | { kind: "comeback"; gapDays: number }
  | { kind: "badges"; ids: string[] }
  /** At least `count` of these badges. */
  | { kind: "anyOf"; ids: string[]; count: number; what: string }
  /** At least `count` completed tasks of this rank (see TASK_RANKS). */
  | { kind: "tasks"; rank: MissionRank; count: number };

export type AchievementGroup = "learning" | "building" | "remembering" | "habits" | "combination";

/** How hard a task is, D (everyday) to S (the biggest). Ranks grade tasks — never decorations or people. */
export type MissionRank = "D" | "C" | "B" | "A" | "S";

export const MISSION_RANKS: MissionRank[] = ["S", "A", "B", "C", "D"];

/** What counts as a task of each rank. Each completed task counts once, at its own rank. */
export const TASK_RANKS: Record<MissionRank, string> = {
  D: "Finish a lesson, or do a review session",
  C: "A review session of 10 or more cards with 80% or more right",
  B: "Finish every lesson in a topic",
  A: "Ship the half adder (lesson done and repo linked)",
  S: "Ship ShellForge (every Systems & Software lesson done and repo linked)",
};

/** Original emblems for the four clans (one per topic). */
export type CrestId = "tree-ir" | "cores" | "cache" | "lanes" | "stages" | "gauge" | "wrench" | "heap" | "page" | "tree" | "seal" | "gate" | "core" | "brace" | "pointer" | "shell";

export type Achievement = {
  id: string;
  group: AchievementGroup;
  label: string;
  glyph: string;
  /** What having it says about you, shown once earned. */
  means: string;
  /** Every rule must hold. */
  rules: BadgeRule[];
  /** Worn as an emblem instead of a ribbon: the headband, or a clan crest on the shoulder. */
  insignia?: { kind: "headband" } | { kind: "crest"; crest: CrestId };
};

export const GROUP_TITLES: Record<AchievementGroup, string> = {
  learning: "Learning",
  building: "Building",
  remembering: "Remembering",
  habits: "Habits",
  combination: "Combinations",
};

const BITS: LevelId = "level-00-bits-logic";
const MACHINE: LevelId = "level-01-machine-memory";
const C_BASICS: LevelId = "level-04-c-basics";
const C_CONTRACT: LevelId = "level-05-c-contract";
const DATA_STRUCTURES: LevelId = "level-07-data-structures";
const VM_THREADS: LevelId = "level-08-vm-threads-files";
const ALLOCATOR: LevelId = "level-09-memory-allocator";
const C_TOOLS: LevelId = "level-06-c-tools";
const PERFORMANCE: LevelId = "level-10-performance";
const PIPELINING: LevelId = "level-11-pipelining";
const ADVANCED: LevelId = "level-12-advanced-execution";
const CACHES: LevelId = "level-13-caches-memory";
const MULTICORE: LevelId = "level-14-multicore-gpus";
const COMPILERS: LevelId = "level-18-compilers-theory";
const C: LevelId = "level-02-the-c-language";
const SYSTEMS: LevelId = "level-03-systems-software";

export const CREST_IDS = ["tree-ir-clan", "cores-clan", "cache-clan", "lanes-clan", "stages-clan", "gauge-clan", "wrench-clan", "heap-clan", "page-clan", "tree-clan", "seal-clan", "gate-clan", "core-clan", "brace-clan", "pointer-clan", "shell-clan"];

/** Every badge Ascend awards, each with its own exact rule. Ids are stable: earned rows reference them. */
export const ACHIEVEMENTS: Achievement[] = [
  // Learning
  { id: "first-bit", group: "learning", label: "First Bit", glyph: "✧", means: "Finished a first lesson", rules: [{ kind: "lessons", count: 1 }] },
  { id: "ten-down", group: "learning", label: "Ten Down", glyph: "❖", means: "Finished ten lessons", rules: [{ kind: "lessons", count: 10 }] },
  { id: "gatekeeper", group: "learning", label: "Gatekeeper", glyph: "◇", means: "Finished every lesson in Bits & Logic", rules: [{ kind: "topic", topic: BITS }] },
  { id: "machinist", group: "learning", label: "Machinist", glyph: "▣", means: "Finished every lesson in Machine & Memory", rules: [{ kind: "topic", topic: MACHINE }] },
  { id: "first-compile", group: "learning", label: "First Compile", glyph: "❴", means: "Finished every lesson in C Basics", rules: [{ kind: "topic", topic: C_BASICS }] },
  { id: "pointer-wrangler", group: "learning", label: "Pointer Wrangler", glyph: "◆", means: "Finished every lesson in The C Language", rules: [{ kind: "topic", topic: C }] },
  { id: "rule-reader", group: "learning", label: "Rule Reader", glyph: "§", means: "Finished every lesson in The C Contract", rules: [{ kind: "topic", topic: C_CONTRACT }] },
  { id: "toolsmith", group: "learning", label: "Toolsmith", glyph: "⚒", means: "Finished every lesson in Tools", rules: [{ kind: "topic", topic: C_TOOLS }] },
  { id: "structure-builder", group: "learning", label: "Structure Builder", glyph: "⋔", means: "Finished every lesson in Data Structures in C", rules: [{ kind: "topic", topic: DATA_STRUCTURES }] },
  { id: "systems-thinker", group: "learning", label: "Systems Thinker", glyph: "⬢", means: "Finished every lesson in Systems & Software", rules: [{ kind: "topic", topic: SYSTEMS }] },
  { id: "kernel-insider", group: "learning", label: "Kernel Insider", glyph: "⧇", means: "Finished every lesson in Virtual Memory, Threads & Files", rules: [{ kind: "topic", topic: VM_THREADS }] },
  { id: "heap-master", group: "learning", label: "Heap Master", glyph: "▥", means: "Finished every lesson in Your own malloc", rules: [{ kind: "topic", topic: ALLOCATOR }] },
  { id: "measurer", group: "learning", label: "Measurer", glyph: "◔", means: "Finished every lesson in Performance & trade-offs", rules: [{ kind: "topic", topic: PERFORMANCE }] },
  { id: "pipeliner", group: "learning", label: "Pipeliner", glyph: "⫼", means: "Finished every lesson in Pipelining", rules: [{ kind: "topic", topic: PIPELINING }] },
  { id: "juggler", group: "learning", label: "Juggler", glyph: "⇶", means: "Finished every lesson in Advanced execution", rules: [{ kind: "topic", topic: ADVANCED }] },
  { id: "cache-keeper", group: "learning", label: "Cache Keeper", glyph: "⧠", means: "Finished every lesson in Caches & memory systems", rules: [{ kind: "topic", topic: CACHES }] },
  { id: "parallelist", group: "learning", label: "Parallelist", glyph: "⁘", means: "Finished every lesson in Multicore & GPUs", rules: [{ kind: "topic", topic: MULTICORE }] },
  { id: "compiler-mind", group: "learning", label: "Compiler Mind", glyph: "⊢", means: "Finished every lesson in Compilers & theory", rules: [{ kind: "topic", topic: COMPILERS }] },

  // Building
  { id: "code-maker", group: "building", label: "Code Maker", glyph: "⌗", means: "Made and broke a codebook", rules: [{ kind: "project", projectId: "codebook" }] },
  { id: "cartographer", group: "building", label: "Cartographer", glyph: "⌖", means: "Mapped a real device as a Machine Atlas", rules: [{ kind: "project", projectId: "machine-atlas" }] },
  { id: "converter", group: "building", label: "Converter", glyph: "⇄", means: "Converted, read and checked bytes by hand", rules: [{ kind: "project", projectId: "number-workbench" }] },
  { id: "byte-detective", group: "building", label: "Byte Detective", glyph: "⌕", means: "Read the same bytes as numbers, text and colours, and solved a mystery message", rules: [{ kind: "project", projectId: "byte-lab" }] },
  { id: "gate-builder", group: "building", label: "Gate Builder", glyph: "⊕", means: "Shipped the half adder", rules: [{ kind: "project", projectId: "half-adder" }] },
  { id: "nand-maker", group: "building", label: "NAND Maker", glyph: "⊼", means: "Built NOT, AND, OR, XOR and a multiplexer from NAND alone", rules: [{ kind: "project", projectId: "gate-workbench" }] },
  { id: "alu-architect", group: "building", label: "ALU Architect", glyph: "⊞", means: "Built an ALU slice that adds, subtracts, ANDs and ORs, and chained it into bytes", rules: [{ kind: "project", projectId: "alu" }] },
  { id: "clockmaker", group: "building", label: "Clockmaker", glyph: "◷", means: "Built registers and a counter that change only on the tick", rules: [{ kind: "project", projectId: "register-lab" }] },
  { id: "memory-keeper", group: "building", label: "Memory Keeper", glyph: "▦", means: "Drove a 256-byte memory by its signals and found a faulty decoder", rules: [{ kind: "project", projectId: "memory-board" }] },
  { id: "conductor", group: "building", label: "Conductor", glyph: "♪", means: "Built a sequencer and followed it through a read, an add and a write (optional project)", rules: [{ kind: "project", projectId: "sequencer" }] },
  { id: "bus-driver", group: "building", label: "Bus Driver", glyph: "⇉", means: "Ran instructions by hand, one control signal at a time", rules: [{ kind: "project", projectId: "build-datapath" }] },
  { id: "microcoder", group: "building", label: "Microcoder", glyph: "⌘", means: "Wrote the tiny CPU's whole control table and ran real programs on it", rules: [{ kind: "project", projectId: "build-the-cpu" }] },
  { id: "efficiency-expert", group: "building", label: "Efficiency Expert", glyph: "⏱", means: "Compared two designs of one instruction set by their ticks (optional project)", rules: [{ kind: "project", projectId: "two-designs" }] },
  { id: "puzzle-solver", group: "building", label: "Puzzle Solver", glyph: "⧩", means: "Solved the assembly puzzles on the tiny CPU, version 2", rules: [{ kind: "project", projectId: "assembly-puzzles" }] },
  { id: "assembler", group: "building", label: "Assembler", glyph: "⇲", means: "Ran both passes of an assembler by hand and wrote them as a procedure", rules: [{ kind: "project", projectId: "assembler" }] },
  { id: "librarian", group: "building", label: "Librarian", glyph: "⧈", means: "Wrote a library of subroutines that call each other (optional project)", rules: [{ kind: "project", projectId: "subroutine-library" }] },
  { id: "memory-watcher", group: "building", label: "Memory Watcher", glyph: "◫", means: "Predicted variables and arrays in memory, and fixed a swap that didn't", rules: [{ kind: "project", projectId: "memory-visualizer" }] },
  { id: "translator", group: "building", label: "Translator", glyph: "⇆", means: "Translated a program by hand and diagnosed a translator bug", rules: [{ kind: "project", projectId: "translator" }] },
  { id: "compiler-reader", group: "building", label: "Compiler Reader", glyph: "⌬", means: "Annotated real gcc output and said what C, the compiler and the target each decide", rules: [{ kind: "project", projectId: "real-c" }] },
  { id: "cross-compiler", group: "building", label: "Cross Compiler", glyph: "⤨", means: "Compared one function compiled for two targets (optional project)", rules: [{ kind: "project", projectId: "compiler-variation" }] },
  { id: "boundary-walker", group: "building", label: "Boundary Walker", glyph: "⇵", means: "Followed a screen write and a file save across the OS boundary, step by step", rules: [{ kind: "project", projectId: "os-boundary" }] },
  { id: "system-tracer", group: "building", label: "System Tracer", glyph: "⟴", means: "Traced a program from source to output, and kept the toy and real pipelines apart", rules: [{ kind: "project", projectId: "trace-a-program" }] },
  { id: "trap-setter", group: "building", label: "Trap Setter", glyph: "⊡", means: "Audited system-call traces and designed a call of your own (optional project)", rules: [{ kind: "project", projectId: "system-call-model" }] },
  { id: "signal-keeper", group: "building", label: "Signal Keeper", glyph: "⌇", means: "Got a message through a noisy line with a threshold and a code (optional project)", rules: [{ kind: "project", projectId: "noisy-channel" }] },
  { id: "format-maker", group: "building", label: "Format Maker", glyph: "▧", means: "Decoded a tiny image format and wrote its specification (optional project)", rules: [{ kind: "project", projectId: "file-format" }] },
  { id: "minimizer", group: "building", label: "Minimizer", glyph: "⊟", means: "Made circuits smaller and built a full adder from NAND only (optional project)", rules: [{ kind: "project", projectId: "smaller-circuit" }] },
  { id: "game-maker", group: "building", label: "Game Maker", glyph: "⚄", means: "Wrote a complete C guessing game that survives bad input", rules: [{ kind: "project", projectId: "guessing-game" }] },
  { id: "ub-hunter", group: "building", label: "UB Hunter", glyph: "⊘", means: "Found and fixed five kinds of undefined behaviour with warnings and sanitizers", rules: [{ kind: "project", projectId: "ub-hunt" }] },
  { id: "map-maker", group: "building", label: "Map Maker", glyph: "⋈", means: "Built and tested a growing hash map library in C", rules: [{ kind: "project", projectId: "hash-map" }] },
  { id: "pool-keeper", group: "building", label: "Pool Keeper", glyph: "⫘", means: "Built a thread pool and found its race and its lost wakeup", rules: [{ kind: "project", projectId: "thread-pool" }] },
  { id: "allocator", group: "building", label: "Allocator", glyph: "◧", means: "Explained and broke a working malloc and free from the inside", rules: [{ kind: "project", projectId: "malloc" }] },
  { id: "pipe-sim", group: "building", label: "Pipe Simulator", glyph: "⧖", means: "Simulated a five-stage pipeline cycle by cycle and scheduled a loop faster", rules: [{ kind: "project", projectId: "pipeline-sim" }] },
  { id: "cache-sim", group: "building", label: "Cache Simulator", glyph: "⊛", means: "Built a cache simulator and explained a column walk that never hits", rules: [{ kind: "project", projectId: "cache-sim" }] },
  { id: "cpu-tracer", group: "building", label: "CPU Tracer", glyph: "▤", means: "Shipped a program for the tiny CPU", rules: [{ kind: "project", projectId: "tiny-cpu" }] },
  { id: "ship-it", group: "building", label: "Shell Smith", glyph: "◈", means: "Shipped ShellForge, a working shell", rules: [{ kind: "project", projectId: "shellforge" }] },

  // Remembering
  { id: "steady-hands", group: "remembering", label: "Steady Hands", glyph: "●", means: "Holds 25 Practice cards solid", rules: [{ kind: "solidCards", count: 25 }] },
  { id: "deep-memory", group: "remembering", label: "Deep Memory", glyph: "◉", means: "Holds 100 Practice cards solid", rules: [{ kind: "solidCards", count: 100 }] },
  { id: "clean-run", group: "remembering", label: "Clean Run", glyph: "◎", means: "Got every card right in a review session of 10 or more", rules: [{ kind: "cleanRun", minCards: 10 }] },

  // Habits
  { id: "week-of-practice", group: "habits", label: "Week of Practice", glyph: "▲", means: "Practiced 7 days in a row", rules: [{ kind: "streak", days: 7 }] },
  { id: "regular", group: "habits", label: "Regular", glyph: "◐", means: "Finished 25 review sessions", rules: [{ kind: "sessions", count: 25 }] },
  { id: "comeback", group: "habits", label: "Comeback", glyph: "✦", means: "Came back to Practice after two weeks away", rules: [{ kind: "comeback", gapDays: 14 }] },

  // Combinations: the parts are the rule, shown openly.
  { id: "builder", group: "combination", label: "Builder", glyph: "⧉", means: "Shipped every curriculum project", rules: [{ kind: "badges", ids: ["code-maker", "cartographer", "converter", "byte-detective", "gate-builder", "nand-maker", "alu-architect", "clockmaker", "memory-keeper", "bus-driver", "cpu-tracer", "microcoder", "puzzle-solver", "assembler", "memory-watcher", "translator", "compiler-reader", "boundary-walker", "system-tracer", "game-maker", "ub-hunter", "map-maker", "pool-keeper", "allocator", "pipe-sim", "cache-sim", "ship-it"] }] },
  { id: "sharp-mind", group: "combination", label: "Sharp Mind", glyph: "✺", means: "Deep memory, a clean run and a week of practice", rules: [{ kind: "badges", ids: ["deep-memory", "clean-run", "week-of-practice"] }] },
  { id: "whole-machine", group: "combination", label: "The Whole Machine", glyph: "✸", means: "Finished every lesson and shipped every project", rules: [{ kind: "allLessons" }, { kind: "badges", ids: ["builder"] }] },
];

/**
 * Insignia: worn as emblems, not ribbons. The headband (the graduation) and
 * the four clans, one per topic. Independent of the ribbons: finishing a
 * topic earns its ribbon and also its clan crest.
 */
export const INSIGNIA: Achievement[] = [
  { id: "headband", group: "learning", label: "Headband", glyph: "⌃", means: "Graduated by finishing a whole topic", rules: [{ kind: "anyTopic" }], insignia: { kind: "headband" } },
  { id: "gate-clan", group: "learning", label: "Gate Clan", glyph: "◇", means: "Joined the Gate Clan by finishing every lesson in Bits & Logic", rules: [{ kind: "topic", topic: BITS }], insignia: { kind: "crest", crest: "gate" } },
  { id: "core-clan", group: "learning", label: "Core Clan", glyph: "▣", means: "Joined the Core Clan by finishing every lesson in Machine & Memory", rules: [{ kind: "topic", topic: MACHINE }], insignia: { kind: "crest", crest: "core" } },
  { id: "brace-clan", group: "learning", label: "Brace Clan", glyph: "❴", means: "Joined the Brace Clan by finishing every lesson in C Basics", rules: [{ kind: "topic", topic: C_BASICS }], insignia: { kind: "crest", crest: "brace" } },
  { id: "pointer-clan", group: "learning", label: "Pointer Clan", glyph: "◆", means: "Joined the Pointer Clan by finishing every lesson in The C Language", rules: [{ kind: "topic", topic: C }], insignia: { kind: "crest", crest: "pointer" } },
  { id: "seal-clan", group: "learning", label: "Seal Clan", glyph: "§", means: "Joined the Seal Clan by finishing every lesson in The C Contract", rules: [{ kind: "topic", topic: C_CONTRACT }], insignia: { kind: "crest", crest: "seal" } },
  { id: "wrench-clan", group: "learning", label: "Wrench Clan", glyph: "⚒", means: "Joined the Wrench Clan by finishing every lesson in Tools", rules: [{ kind: "topic", topic: C_TOOLS }], insignia: { kind: "crest", crest: "wrench" } },
  { id: "tree-clan", group: "learning", label: "Tree Clan", glyph: "⋔", means: "Joined the Tree Clan by finishing every lesson in Data Structures in C", rules: [{ kind: "topic", topic: DATA_STRUCTURES }], insignia: { kind: "crest", crest: "tree" } },
  { id: "shell-clan", group: "learning", label: "Shell Clan", glyph: "⬢", means: "Joined the Shell Clan by finishing every lesson in Systems & Software", rules: [{ kind: "topic", topic: SYSTEMS }], insignia: { kind: "crest", crest: "shell" } },
  { id: "page-clan", group: "learning", label: "Page Clan", glyph: "⧇", means: "Joined the Page Clan by finishing every lesson in Virtual Memory, Threads & Files", rules: [{ kind: "topic", topic: VM_THREADS }], insignia: { kind: "crest", crest: "page" } },
  { id: "heap-clan", group: "learning", label: "Heap Clan", glyph: "▥", means: "Joined the Heap Clan by finishing every lesson in Your own malloc", rules: [{ kind: "topic", topic: ALLOCATOR }], insignia: { kind: "crest", crest: "heap" } },
  { id: "gauge-clan", group: "learning", label: "Gauge Clan", glyph: "◔", means: "Joined the Gauge Clan by finishing every lesson in Performance & trade-offs", rules: [{ kind: "topic", topic: PERFORMANCE }], insignia: { kind: "crest", crest: "gauge" } },
  { id: "stages-clan", group: "learning", label: "Stage Clan", glyph: "⫼", means: "Joined the Stage Clan by finishing every lesson in Pipelining", rules: [{ kind: "topic", topic: PIPELINING }], insignia: { kind: "crest", crest: "stages" } },
  { id: "lanes-clan", group: "learning", label: "Lane Clan", glyph: "⇶", means: "Joined the Lane Clan by finishing every lesson in Advanced execution", rules: [{ kind: "topic", topic: ADVANCED }], insignia: { kind: "crest", crest: "lanes" } },
  { id: "cache-clan", group: "learning", label: "Cache Clan", glyph: "⧠", means: "Joined the Cache Clan by finishing every lesson in Caches & memory systems", rules: [{ kind: "topic", topic: CACHES }], insignia: { kind: "crest", crest: "cache" } },
  { id: "cores-clan", group: "learning", label: "Core Grid Clan", glyph: "⁘", means: "Joined the Core Grid Clan by finishing every lesson in Multicore & GPUs", rules: [{ kind: "topic", topic: MULTICORE }], insignia: { kind: "crest", crest: "cores" } },
  { id: "tree-ir-clan", group: "learning", label: "Syntax Clan", glyph: "⊢", means: "Joined the Syntax Clan by finishing every lesson in Compilers & theory", rules: [{ kind: "topic", topic: COMPILERS }], insignia: { kind: "crest", crest: "tree-ir" } },
];

export type Title = Achievement & {
  /** The word in Japanese, shown beside the title. */
  kanji: string;
  /** What the title means, in a few words. */
  gloss: string;
};

/**
 * Titles, earned in order by completing ranked tasks and never taken away.
 * Each one includes the title before it. The top title is Ascend's own; the
 * others are historical ninja ranks.
 */
export const TITLES: Title[] = [
  { id: "title-genin", group: "combination", label: "Genin", kanji: "下忍", gloss: "the initiate", glyph: "下", means: "Earned the headband", rules: [{ kind: "badges", ids: ["headband"] }] },
  { id: "title-chunin", group: "combination", label: "Chūnin", kanji: "中忍", gloss: "the trusted", glyph: "中", means: "Kept doing the everyday work, and some real effort", rules: [{ kind: "badges", ids: ["title-genin"] }, { kind: "tasks", rank: "D", count: 15 }, { kind: "tasks", rank: "C", count: 5 }] },
  { id: "title-jonin", group: "combination", label: "Jōnin", kanji: "上忍", gloss: "the elite", glyph: "上", means: "A long record of work, two topics and a shipped project", rules: [{ kind: "badges", ids: ["title-chunin"] }, { kind: "tasks", rank: "D", count: 40 }, { kind: "tasks", rank: "C", count: 15 }, { kind: "tasks", rank: "B", count: 2 }, { kind: "tasks", rank: "A", count: 1 }] },
  { id: "title-soke", group: "combination", label: "Sōke", kanji: "宗家", gloss: "head of the school", glyph: "宗", means: "Every topic finished", rules: [{ kind: "badges", ids: ["title-jonin"] }, { kind: "tasks", rank: "B", count: 4 }, { kind: "tasks", rank: "A", count: 1 }] },
  { id: "title-ascended", group: "combination", label: "Ascended", kanji: "昇", gloss: "the legend", glyph: "昇", means: "Shipped the capstone", rules: [{ kind: "badges", ids: ["title-soke"] }, { kind: "tasks", rank: "S", count: 1 }] },
];

export function achievementById(id: string): Achievement | undefined {
  return [...ACHIEVEMENTS, ...INSIGNIA, ...TITLES].find((a) => a.id === id);
}
