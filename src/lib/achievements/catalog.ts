import type { LevelId } from "@/lib/content/schema";

export type AchievementGroup = "level" | "project" | "memory" | "habit" | "core";

export type Achievement = {
  id: string;
  group: AchievementGroup;
  label: string;
  glyph: string;
  /** How to earn it, shown before it's earned. */
  how: string;
  /** What having it means, shown once earned. */
  means: string;
  level?: LevelId;
  projectId?: string;
};

const L00: LevelId = "level-00-bits-logic";
const L01: LevelId = "level-01-machine-memory";
const L02: LevelId = "level-02-the-c-language";
const L03: LevelId = "level-03-systems-software";

/**
 * Every badge Ascend awards. Each one is worked out from real records —
 * lesson completions, project links, Practice cards and sessions — never
 * from time of day, speed or features that don't exist yet.
 */
export const ACHIEVEMENTS: Achievement[] = [
  { id: "groundwork", group: "level", level: L00, label: "Groundwork", glyph: "◇", how: "Finish every Level 00 lesson", means: "Finished Level 00 · Bits & Logic" },
  { id: "machine-head", group: "level", level: L01, label: "Machine Head", glyph: "▣", how: "Finish every Level 01 lesson", means: "Finished Level 01 · Machine & Memory" },
  { id: "the-craft", group: "level", level: L02, label: "The Craft", glyph: "◆", how: "Finish every Level 02 lesson", means: "Finished Level 02 · The C Language" },
  { id: "systems-sage", group: "level", level: L03, label: "Systems Sage", glyph: "⬢", how: "Finish every Level 03 lesson", means: "Finished Level 03 · Systems & Software" },
  { id: "gate-builder", group: "project", level: L00, projectId: "half-adder", label: "Gate Builder", glyph: "⊕", how: "Finish the half adder lesson and link your repo", means: "Shipped the half adder" },
  { id: "ship-it", group: "project", level: L03, projectId: "shellforge", label: "Ship It", glyph: "◈", how: "Finish Level 03 and link your ShellForge repo", means: "Shipped ShellForge, a working shell" },
  { id: "solid-00", group: "memory", level: L00, label: "Solid Bits", glyph: "●", how: "Hold every Level 00 card solid in Practice", means: "Every Level 00 card held solid in Practice" },
  { id: "solid-01", group: "memory", level: L01, label: "Solid Machine", glyph: "●", how: "Hold every Level 01 card solid in Practice", means: "Every Level 01 card held solid in Practice" },
  { id: "solid-02", group: "memory", level: L02, label: "Solid C", glyph: "●", how: "Hold every Level 02 card solid in Practice", means: "Every Level 02 card held solid in Practice" },
  { id: "solid-03", group: "memory", level: L03, label: "Solid Systems", glyph: "●", how: "Hold every Level 03 card solid in Practice", means: "Every Level 03 card held solid in Practice" },
  { id: "week-of-practice", group: "habit", label: "Week of Practice", glyph: "▲", how: "Practice on 7 days in a row", means: "Practiced 7 days in a row" },
  { id: "comeback", group: "habit", label: "Comeback", glyph: "✦", how: "Come back to Practice after two weeks away", means: "Came back to Practice after a break" },
  { id: "core-complete", group: "core", label: "Core Complete", glyph: "✸", how: "Finish every lesson and ship both projects", means: "Finished the whole curriculum and shipped both projects" },
];

export function achievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
