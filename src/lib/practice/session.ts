import { PRACTICE_BANK } from "./bank";
import { practicePathSlugForLevel } from "./path-map";
import { sectionLessonKeys } from "./tree";
import type { PracticeItem } from "./types";

/** Always available even with zero lesson completions (Foundations starter). */
export const DEFAULT_PRACTICE_LEVEL = "level-00-bits-logic";

export type PracticeScope =
  | { type: "all" }
  | { type: "path"; pathSlug: string }
  | { type: "section"; pathSlug: string; sectionId: string }
  | { type: "lessons"; keys: string[] }
  /** Miss queue only — Anki-style “due”, no random filler. */
  | { type: "due" };

export function completionKey(level: string, slug: string): string {
  return `${level}/${slug}`;
}

export function isDefaultPracticeQuestion(q: PracticeItem): boolean {
  return q.lessonLevel === DEFAULT_PRACTICE_LEVEL;
}

/**
 * Foundations starter is always unlocked.
 * Completing lessons unlocks additional bank items for those lessons.
 */
export function unlockedQuestions(
  completedKeys: Set<string>,
): PracticeItem[] {
  return PRACTICE_BANK.filter(
    (q) =>
      isDefaultPracticeQuestion(q) ||
      completedKeys.has(completionKey(q.lessonLevel, q.lessonSlug)),
  );
}

export function questionsForScope(
  completedKeys: Set<string>,
  scope: PracticeScope,
): PracticeItem[] {
  const unlocked = unlockedQuestions(completedKeys);
  if (scope.type === "all" || scope.type === "due") return unlocked;
  if (scope.type === "path") {
    return unlocked.filter(
      (q) => practicePathSlugForLevel(q.lessonLevel) === scope.pathSlug,
    );
  }
  const keys =
    scope.type === "section"
      ? sectionLessonKeys(scope.pathSlug, scope.sectionId)
      : scope.keys;
  const want = new Set(keys);
  return unlocked.filter((q) =>
    want.has(completionKey(q.lessonLevel, q.lessonSlug)),
  );
}

export type PracticePathBucket = {
  pathSlug: string;
  title: string;
  questionCount: number;
  lessonCount: number;
};

export type PracticeLessonOption = {
  key: string;
  pathSlug: string;
  pathTitle: string;
  lessonSlug: string;
  label: string;
  questionCount: number;
};

/** Fisher–Yates; injectable rng for tests. */
export function shuffleInPlace<T>(
  items: T[],
  rng: () => number = Math.random,
): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [items[i], items[j]] = [items[j]!, items[i]!];
  }
  return items;
}

/**
 * Session builder:
 * - `due`: due ids only (composition from caller), no filler
 * - otherwise: priority ids in scope first, then fill from shuffled pool
 * - **Final order is always shuffled** so MCQ / flashcard / future kinds
 *   interleave — the learner should not predict the next format.
 * Caps at `size` (default 8).
 */
export function buildSession(opts: {
  completedKeys: Set<string>;
  priorityIds: string[];
  size?: number;
  scope?: PracticeScope;
  /** Inject for tests; defaults to Math.random */
  rng?: () => number;
}): PracticeItem[] {
  const size = opts.size ?? 8;
  const scope = opts.scope ?? { type: "all" };
  const rng = opts.rng ?? Math.random;
  const pool = questionsForScope(opts.completedKeys, scope);
  const byId = new Map(pool.map((q) => [q.id, q]));
  const picked: PracticeItem[] = [];
  const seen = new Set<string>();

  for (const id of opts.priorityIds) {
    const q = byId.get(id);
    if (!q || seen.has(q.id)) continue;
    picked.push(q);
    seen.add(q.id);
    if (picked.length >= size) {
      return shuffleInPlace(picked, rng);
    }
  }

  if (scope.type !== "due") {
    const rest = pool.filter((q) => !seen.has(q.id));
    shuffleInPlace(rest, rng);
    for (const q of rest) {
      picked.push(q);
      if (picked.length >= size) break;
    }
  }

  return shuffleInPlace(picked, rng);
}

/** Click handlers pass a MouseEvent; only explicit answered arrays should apply. */
export function coalesceAnsweredSnapshot<T>(
  override: unknown,
  fallback: T[],
): T[] {
  return Array.isArray(override) ? override : fallback;
}
