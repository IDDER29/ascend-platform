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

export const BADGES: Badge[] = [
  { id: "first-steps", glyph: "✦", label: "First Steps", description: "Complete your first concept", rarity: "common", status: "earned", meta: "Jun 12" },
  { id: "groundwork", glyph: "◇", label: "Groundwork", description: "Finish Level 00 · Bits & Logic", rarity: "common", status: "earned", meta: "Jun 15" },
  { id: "machine-head", glyph: "▣", label: "Machine Head", description: "Finish Level 01 · Machine & Memory", rarity: "common", status: "earned", meta: "Jun 22" },
  { id: "memory-master", glyph: "◆", label: "Memory Master", description: "Master pointers & the heap", rarity: "rare", status: "earned", meta: "Jul 1" },
  { id: "week-warrior", glyph: "▲", label: "Week Warrior", description: "Hit a 7-day streak", rarity: "common", status: "earned", meta: "Jun 19" },
  { id: "night-owl", glyph: "★", label: "Night Owl", description: "Study after midnight 5 times", rarity: "common", status: "earned", meta: "Jun 28" },
  { id: "quiz-ace", glyph: "⬡", label: "Quiz Ace", description: "Score 100% on 10 quizzes", rarity: "rare", status: "earned", meta: "Jul 2" },
  { id: "shell-architect", glyph: "◈", label: "Shell Architect", description: "Build your own working shell", rarity: "legendary", status: "earned", meta: "Jul 4" },
  { id: "early-bird", glyph: "❖", label: "Early Bird", description: "Study before 7am 5 times", rarity: "common", status: "earned", meta: "Jun 30" },

  { id: "half-way", glyph: "◐", label: "Half Way", description: "Complete 50% of the core", rarity: "common", status: "in-progress", meta: "13/25 concepts", progressPct: 52 },
  { id: "pointer-wizard", glyph: "◆", label: "Pointer Wizard", description: "Ace all 8 C-language quizzes", rarity: "rare", status: "in-progress", meta: "3/4 quizzes", progressPct: 75 },
  { id: "marathoner", glyph: "▲", label: "Marathoner", description: "Reach a 30-day streak", rarity: "rare", status: "in-progress", meta: "13/30 days", progressPct: 43 },

  { id: "systems-sage", glyph: "⬢", label: "Systems Sage", description: "Finish Level 03 · Systems", rarity: "legendary", status: "locked", meta: "1/2 projects" },
  { id: "ship-it", glyph: "◈", label: "Ship It", description: "Pass 5 capstone projects", rarity: "rare", status: "locked", meta: "2/5 projects" },
  { id: "core-complete", glyph: "✸", label: "Core Complete", description: "Finish the entire curriculum", rarity: "legendary", status: "locked", meta: "19/25 concepts" },
  { id: "polyglot", glyph: "❋", label: "Polyglot", description: "Read 25 peer solutions", rarity: "common", status: "locked", meta: "8/25 read" },
  { id: "perfectionist", glyph: "◔", label: "Perfectionist", description: "100% on every quiz in a level", rarity: "rare", status: "locked", meta: "locked" },
  { id: "mentor", glyph: "⬟", label: "Mentor", description: "Have a solution liked 100 times", rarity: "legendary", status: "locked", meta: "locked" },
  { id: "helping-hand", glyph: "✜", label: "Helping Hand", description: "Publish 10 peer solutions", rarity: "common", status: "locked", meta: "locked" },
  { id: "deep-diver", glyph: "◍", label: "Deep Diver", description: "Watch every curated video", rarity: "common", status: "locked", meta: "locked" },
  { id: "speed-runner", glyph: "⬡", label: "Speed Runner", description: "Finish a level in one day", rarity: "rare", status: "locked", meta: "locked" },
  { id: "comeback", glyph: "✦", label: "Comeback", description: "Return after a broken streak", rarity: "common", status: "locked", meta: "locked" },
  { id: "iron-will", glyph: "◆", label: "Iron Will", description: "100-day streak", rarity: "legendary", status: "locked", meta: "locked" },
  { id: "completionist", glyph: "★", label: "Completionist", description: "Earn every other badge", rarity: "legendary", status: "locked", meta: "locked" },
];

export const BADGE_STATS = {
  total: BADGES.length,
  earned: BADGES.filter((b) => b.status === "earned").length,
  inProgress: BADGES.filter((b) => b.status === "in-progress").length,
  locked: BADGES.filter((b) => b.status === "locked").length,
  rare: BADGES.filter((b) => b.rarity === "rare" || b.rarity === "legendary").length,
  badgeXp: 450,
};
