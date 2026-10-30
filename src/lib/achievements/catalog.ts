import type { LevelId } from "@/lib/content/schema";

/**
 * One condition a badge asks for. A badge is earned when every one of its
 * rules holds; each rule is checked from real records only — lesson
 * completions, project links, Practice cards and sessions, or other badges.
 */
export type BadgeRule =
  | { kind: "lessons"; count: number }
  | { kind: "topic"; topic: LevelId }
  | { kind: "allLessons" }
  | { kind: "project"; projectId: string }
  | { kind: "solidCards"; count: number }
  | { kind: "cleanRun"; minCards: number }
  | { kind: "streak"; days: number }
  | { kind: "sessions"; count: number }
  | { kind: "comeback"; gapDays: number }
  | { kind: "badges"; ids: string[] };

export type AchievementGroup = "learning" | "building" | "remembering" | "habits" | "combination";

export type Achievement = {
  id: string;
  group: AchievementGroup;
  label: string;
  glyph: string;
  /** What having it says about you, shown once earned. */
  means: string;
  /** Every rule must hold. */
  rules: BadgeRule[];
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
  { id: "gate-builder", group: "building", label: "Gate Builder", glyph: "⊕", means: "Shipped the half adder", rules: [{ kind: "project", projectId: "half-adder" }] },
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
  { id: "builder", group: "combination", label: "Builder", glyph: "⧉", means: "Shipped both curriculum projects", rules: [{ kind: "badges", ids: ["gate-builder", "ship-it"] }] },
  { id: "sharp-mind", group: "combination", label: "Sharp Mind", glyph: "✺", means: "Deep memory, a clean run and a week of practice", rules: [{ kind: "badges", ids: ["deep-memory", "clean-run", "week-of-practice"] }] },
  { id: "whole-machine", group: "combination", label: "The Whole Machine", glyph: "✸", means: "Finished every lesson and shipped both projects", rules: [{ kind: "allLessons" }, { kind: "badges", ids: ["builder"] }] },
];

export function achievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
