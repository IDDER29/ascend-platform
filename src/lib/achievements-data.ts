export type BadgeRarity = "common" | "rare" | "legendary";
export type BadgeStatus = "earned" | "in-progress" | "locked";

export interface Badge {
  id: string;
  glyph: string;
  label: string;
  description: string;
  rarity: BadgeRarity;
  status: BadgeStatus;
  /** e.g. "Jun 12" for earned, "3/4" for in-progress, "13/25 concepts" for locked-with-progress */
  meta: string;
  /** 0-100, only meaningful for in-progress badges */
  progressPct?: number;
}

/** Catalog. Project badges (Gate Builder, Ship It) are awarded from the profile; the rest are not awarded yet. */
export const BADGES: Badge[] = [
  { id: "first-steps", glyph: "✦", label: "First Steps", description: "Complete your first concept", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "gate-builder", glyph: "⊕", label: "Gate Builder", description: "Ship the half adder project", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "groundwork", glyph: "◇", label: "Groundwork", description: "Finish Level 00 · Bits & Logic", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "machine-head", glyph: "▣", label: "Machine Head", description: "Finish Level 01 · Machine & Memory", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "memory-master", glyph: "◆", label: "Memory Master", description: "Master pointers & the heap", rarity: "rare", status: "locked", meta: "not awarded yet" },
  { id: "week-warrior", glyph: "▲", label: "Week Warrior", description: "Hit a 7-day streak", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "night-owl", glyph: "★", label: "Night Owl", description: "Study after midnight 5 times", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "quiz-ace", glyph: "⬡", label: "Quiz Ace", description: "Score 100% on 10 quizzes", rarity: "rare", status: "locked", meta: "not awarded yet" },
  { id: "shell-architect", glyph: "◈", label: "Shell Architect", description: "Build your own working shell", rarity: "legendary", status: "locked", meta: "not awarded yet" },
  { id: "early-bird", glyph: "❖", label: "Early Bird", description: "Study before 7am 5 times", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "half-way", glyph: "◐", label: "Half Way", description: "Complete 50% of the core", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "pointer-wizard", glyph: "◆", label: "Pointer Wizard", description: "Ace all C-language quizzes", rarity: "rare", status: "locked", meta: "not awarded yet" },
  { id: "marathoner", glyph: "▲", label: "Marathoner", description: "Reach a 30-day streak", rarity: "rare", status: "locked", meta: "not awarded yet" },
  { id: "systems-sage", glyph: "⬢", label: "Systems Sage", description: "Finish Level 03 · Systems", rarity: "legendary", status: "locked", meta: "not awarded yet" },
  { id: "ship-it", glyph: "◈", label: "Ship It", description: "Ship the Shellforge capstone", rarity: "rare", status: "locked", meta: "not awarded yet" },
  { id: "core-complete", glyph: "✸", label: "Core Complete", description: "Finish the entire curriculum", rarity: "legendary", status: "locked", meta: "not awarded yet" },
  { id: "polyglot", glyph: "❋", label: "Polyglot", description: "Read 25 peer solutions", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "perfectionist", glyph: "◔", label: "Perfectionist", description: "100% on every quiz in a level", rarity: "rare", status: "locked", meta: "not awarded yet" },
  { id: "mentor", glyph: "⬟", label: "Mentor", description: "Have a solution liked 100 times", rarity: "legendary", status: "locked", meta: "not awarded yet" },
  { id: "helping-hand", glyph: "✜", label: "Helping Hand", description: "Publish 10 peer solutions", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "deep-diver", glyph: "◍", label: "Deep Diver", description: "Watch every curated video", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "speed-runner", glyph: "⬡", label: "Speed Runner", description: "Finish a level in one day", rarity: "rare", status: "locked", meta: "not awarded yet" },
  { id: "comeback", glyph: "✦", label: "Comeback", description: "Return after a broken streak", rarity: "common", status: "locked", meta: "not awarded yet" },
  { id: "iron-will", glyph: "◆", label: "Iron Will", description: "100-day streak", rarity: "legendary", status: "locked", meta: "not awarded yet" },
  { id: "completionist", glyph: "★", label: "Completionist", description: "Earn every other badge", rarity: "legendary", status: "locked", meta: "not awarded yet" },
];

export const BADGE_STATS = {
  total: BADGES.length,
  earned: 0,
  inProgress: 0,
  locked: BADGES.length,
  rare: BADGES.filter((b) => b.rarity === "rare" || b.rarity === "legendary").length,
  badgeXp: 0,
};
