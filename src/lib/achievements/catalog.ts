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
export type CrestId = "gate" | "core" | "pointer" | "shell";

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
const C: LevelId = "level-02-the-c-language";
const SYSTEMS: LevelId = "level-03-systems-software";

export const CREST_IDS = ["gate-clan", "core-clan", "pointer-clan", "shell-clan"];

/** Every badge Ascend awards, each with its own exact rule. Ids are stable: earned rows reference them. */
export const ACHIEVEMENTS: Achievement[] = [
  // Learning
  { id: "first-bit", group: "learning", label: "First Bit", glyph: "✧", means: "Finished a first lesson", rules: [{ kind: "lessons", count: 1 }] },
  { id: "ten-down", group: "learning", label: "Ten Down", glyph: "❖", means: "Finished ten lessons", rules: [{ kind: "lessons", count: 10 }] },
  { id: "gatekeeper", group: "learning", label: "Gatekeeper", glyph: "◇", means: "Finished every lesson in Bits & Logic", rules: [{ kind: "topic", topic: BITS }] },
  { id: "machinist", group: "learning", label: "Machinist", glyph: "▣", means: "Finished every lesson in Machine & Memory", rules: [{ kind: "topic", topic: MACHINE }] },
  { id: "pointer-wrangler", group: "learning", label: "Pointer Wrangler", glyph: "◆", means: "Finished every lesson in The C Language", rules: [{ kind: "topic", topic: C }] },
  { id: "systems-thinker", group: "learning", label: "Systems Thinker", glyph: "⬢", means: "Finished every lesson in Systems & Software", rules: [{ kind: "topic", topic: SYSTEMS }] },

  // Building
  { id: "code-maker", group: "building", label: "Code Maker", glyph: "⌗", means: "Made and broke a codebook", rules: [{ kind: "project", projectId: "codebook" }] },
  { id: "cartographer", group: "building", label: "Cartographer", glyph: "⌖", means: "Mapped a real device as a Machine Atlas", rules: [{ kind: "project", projectId: "machine-atlas" }] },
  { id: "converter", group: "building", label: "Converter", glyph: "⇄", means: "Converted, read and checked bytes by hand", rules: [{ kind: "project", projectId: "number-workbench" }] },
  { id: "byte-detective", group: "building", label: "Byte Detective", glyph: "⌕", means: "Read the same bytes as numbers, text and colours, and solved a mystery message", rules: [{ kind: "project", projectId: "byte-lab" }] },
  { id: "gate-builder", group: "building", label: "Gate Builder", glyph: "⊕", means: "Shipped the half adder", rules: [{ kind: "project", projectId: "half-adder" }] },
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
  { id: "builder", group: "combination", label: "Builder", glyph: "⧉", means: "Shipped every curriculum project", rules: [{ kind: "badges", ids: ["code-maker", "cartographer", "converter", "byte-detective", "gate-builder", "cpu-tracer", "ship-it"] }] },
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
  { id: "pointer-clan", group: "learning", label: "Pointer Clan", glyph: "◆", means: "Joined the Pointer Clan by finishing every lesson in The C Language", rules: [{ kind: "topic", topic: C }], insignia: { kind: "crest", crest: "pointer" } },
  { id: "shell-clan", group: "learning", label: "Shell Clan", glyph: "⬢", means: "Joined the Shell Clan by finishing every lesson in Systems & Software", rules: [{ kind: "topic", topic: SYSTEMS }], insignia: { kind: "crest", crest: "shell" } },
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
