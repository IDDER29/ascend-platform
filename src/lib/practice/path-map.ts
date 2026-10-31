/**
 * Client-safe level → path map for Practice scoping.
 * Keeps Practice off `catalog.ts` / `lessons.ts` (those import `node:fs`).
 */

const LEVEL_TO_PATH: Record<string, string> = {
  "level-00-bits-logic": "foundations",
  "level-01-machine-memory": "systems-programmer",
  "level-04-c-basics": "systems-programmer",
  "level-02-the-c-language": "systems-programmer",
  "level-03-systems-software": "systems-programmer",
};

export const PRACTICE_PATH_TITLES: Record<string, string> = {
  foundations: "Foundations",
  "systems-programmer": "Systems Programmer",
};

export const PRACTICE_PATH_MARKS: Record<string, string> = {
  foundations: "F",
  "systems-programmer": "SP",
};

export const PRACTICE_PATH_BLURBS: Record<string, string> = {
  foundations: "Bits, logic, and first principles: your always-open warm-up.",
  "systems-programmer": "Machine, memory, and C. Unlock as you climb.",
};

export function practicePathSlugForLevel(level: string): string | null {
  return LEVEL_TO_PATH[level] ?? null;
}
