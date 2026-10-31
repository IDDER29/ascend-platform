/**
 * Client-safe level → path map for Practice scoping.
 * Keeps Practice off `catalog.ts` / `lessons.ts` (those import `node:fs`).
 */

const LEVEL_TO_PATH: Record<string, string> = {
  "level-00-bits-logic": "foundations",
  "level-01-machine-memory": "systems-programmer",
  "level-04-c-basics": "systems-programmer",
  "level-02-the-c-language": "systems-programmer",
  "level-05-c-contract": "systems-programmer",
  "level-06-c-tools": "systems-programmer",
  "level-07-data-structures": "systems-programmer",
  "level-03-systems-software": "systems-programmer",
  "level-08-vm-threads-files": "systems-programmer",
  "level-09-memory-allocator": "systems-programmer",
  "level-10-performance": "computer-architect",
  "level-11-pipelining": "computer-architect",
  "level-12-advanced-execution": "computer-architect",
  "level-13-caches-memory": "computer-architect",
};

export const PRACTICE_PATH_TITLES: Record<string, string> = {
  foundations: "Foundations",
  "systems-programmer": "Systems Programmer",
  "computer-architect": "Computer Architect",
};

export const PRACTICE_PATH_MARKS: Record<string, string> = {
  foundations: "F",
  "systems-programmer": "SP",
  "computer-architect": "CA",
};

export const PRACTICE_PATH_BLURBS: Record<string, string> = {
  foundations: "Bits, logic, and first principles: your always-open warm-up.",
  "systems-programmer": "Machine, memory, and C. Unlock as you climb.",
  "computer-architect": "Pipelines, caches and hardware design, from performance to a RISC-V core.",
};

export function practicePathSlugForLevel(level: string): string | null {
  return LEVEL_TO_PATH[level] ?? null;
}
