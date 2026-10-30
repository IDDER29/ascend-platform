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
  | { kind: "anyOf"; ids: string[]; count: number; what: string };

export type AchievementGroup = "learning" | "building" | "remembering" | "habits" | "combination";

/** How hard the mission behind a decoration is, D (everyday) to S (the biggest). Grades the task, never the person. */
export type MissionRank = "D" | "C" | "B" | "A" | "S";

export const MISSION_RANKS: MissionRank[] = ["S", "A", "B", "C", "D"];

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
  rank: MissionRank;
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

export const CREST_IDS = ["gatekeeper", "machinist", "pointer-wrangler", "systems-thinker"];

/** Every badge Ascend awards, each with its own exact rule. Ids are stable: earned rows reference them. */
export const ACHIEVEMENTS: Achievement[] = [
  // Learning — the headband and the four clans are worn as emblems.
  { id: "first-bit", group: "learning", rank: "D", label: "First Bit", glyph: "✧", means: "Finished a first lesson", rules: [{ kind: "lessons", count: 1 }] },
  { id: "ten-down", group: "learning", rank: "C", label: "Ten Down", glyph: "❖", means: "Finished ten lessons", rules: [{ kind: "lessons", count: 10 }] },
  { id: "headband", group: "learning", rank: "B", label: "Headband", glyph: "⌃", means: "Graduated by finishing a whole topic", rules: [{ kind: "anyTopic" }], insignia: { kind: "headband" } },
  { id: "gatekeeper", group: "learning", rank: "B", label: "Gate Clan", glyph: "◇", means: "Joined the Gate Clan by finishing every lesson in Bits & Logic", rules: [{ kind: "topic", topic: BITS }], insignia: { kind: "crest", crest: "gate" } },
  { id: "machinist", group: "learning", rank: "B", label: "Core Clan", glyph: "▣", means: "Joined the Core Clan by finishing every lesson in Machine & Memory", rules: [{ kind: "topic", topic: MACHINE }], insignia: { kind: "crest", crest: "core" } },
  { id: "pointer-wrangler", group: "learning", rank: "B", label: "Pointer Clan", glyph: "◆", means: "Joined the Pointer Clan by finishing every lesson in The C Language", rules: [{ kind: "topic", topic: C }], insignia: { kind: "crest", crest: "pointer" } },
  { id: "systems-thinker", group: "learning", rank: "B", label: "Shell Clan", glyph: "⬢", means: "Joined the Shell Clan by finishing every lesson in Systems & Software", rules: [{ kind: "topic", topic: SYSTEMS }], insignia: { kind: "crest", crest: "shell" } },

  // Building
  { id: "gate-builder", group: "building", rank: "B", label: "Gate Builder", glyph: "⊕", means: "Shipped the half adder", rules: [{ kind: "project", projectId: "half-adder" }] },
  { id: "ship-it", group: "building", rank: "A", label: "Shell Smith", glyph: "◈", means: "Shipped ShellForge, a working shell", rules: [{ kind: "project", projectId: "shellforge" }] },

  // Remembering
  { id: "steady-hands", group: "remembering", rank: "C", label: "Steady Hands", glyph: "●", means: "Holds 25 Practice cards solid", rules: [{ kind: "solidCards", count: 25 }] },
  { id: "deep-memory", group: "remembering", rank: "A", label: "Deep Memory", glyph: "◉", means: "Holds 100 Practice cards solid", rules: [{ kind: "solidCards", count: 100 }] },
  { id: "clean-run", group: "remembering", rank: "C", label: "Clean Run", glyph: "◎", means: "Got every card right in a review session of 10 or more", rules: [{ kind: "cleanRun", minCards: 10 }] },

  // Habits
  { id: "week-of-practice", group: "habits", rank: "D", label: "Week of Practice", glyph: "▲", means: "Practiced 7 days in a row", rules: [{ kind: "streak", days: 7 }] },
  { id: "regular", group: "habits", rank: "C", label: "Regular", glyph: "◐", means: "Finished 25 review sessions", rules: [{ kind: "sessions", count: 25 }] },
  { id: "comeback", group: "habits", rank: "D", label: "Comeback", glyph: "✦", means: "Came back to Practice after two weeks away", rules: [{ kind: "comeback", gapDays: 14 }] },

  // Combinations: the parts are the rule, shown openly.
  { id: "builder", group: "combination", rank: "A", label: "Builder", glyph: "⧉", means: "Shipped both curriculum projects", rules: [{ kind: "badges", ids: ["gate-builder", "ship-it"] }] },
  { id: "sharp-mind", group: "combination", rank: "S", label: "Sharp Mind", glyph: "✺", means: "Deep memory, a clean run and a week of practice", rules: [{ kind: "badges", ids: ["deep-memory", "clean-run", "week-of-practice"] }] },
  { id: "whole-machine", group: "combination", rank: "S", label: "The Whole Machine", glyph: "✸", means: "Finished every lesson and shipped both projects", rules: [{ kind: "allLessons" }, { kind: "badges", ids: ["builder"] }] },
];

export type Title = Achievement & {
  /** The word in Japanese, shown beside the title. */
  kanji: string;
  /** What the title means, in a few words. */
  gloss: string;
};

const CRESTS = { kind: "anyOf" as const, ids: CREST_IDS, what: "clan crests" };

/**
 * Titles, earned in order by real work and never taken away. Each one is a
 * combination of missions (and the title before it). The top title is
 * Ascend's own; the others are historical ninja ranks.
 */
export const TITLES: Title[] = [
  { id: "title-genin", group: "combination", rank: "B", label: "Genin", kanji: "下忍", gloss: "the initiate", glyph: "下", means: "Earned the headband", rules: [{ kind: "badges", ids: ["headband"] }] },
  { id: "title-chunin", group: "combination", rank: "B", label: "Chūnin", kanji: "中忍", gloss: "the trusted", glyph: "中", means: "Built, remembered and kept up the habit", rules: [{ kind: "badges", ids: ["title-genin", "gate-builder", "steady-hands", "week-of-practice"] }] },
  { id: "title-jonin", group: "combination", rank: "A", label: "Jōnin", kanji: "上忍", gloss: "the elite", glyph: "上", means: "Two clans, a clean run and a steady practice", rules: [{ kind: "badges", ids: ["title-chunin", "clean-run", "regular"] }, { ...CRESTS, count: 2 }] },
  { id: "title-soke", group: "combination", rank: "S", label: "Sōke", kanji: "宗家", gloss: "head of the school", glyph: "宗", means: "Every clan and a deep memory", rules: [{ kind: "badges", ids: ["title-jonin", "deep-memory"] }, { ...CRESTS, count: 4 }] },
  { id: "title-ascended", group: "combination", rank: "S", label: "Ascended", kanji: "昇", gloss: "the legend", glyph: "昇", means: "Shipped the shell and mastered the whole climb", rules: [{ kind: "badges", ids: ["title-soke", "ship-it", "sharp-mind"] }] },
];

export function achievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id) ?? TITLES.find((t) => t.id === id);
}
