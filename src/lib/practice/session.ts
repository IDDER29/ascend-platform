import { PRACTICE_BANK } from "./bank";
import {
  PRACTICE_PATH_TITLES,
  practicePathSlugForLevel,
} from "./path-map";
import type { PracticeQuestion } from "./types";

/** Always available even with zero lesson completions (Foundations starter). */
export const DEFAULT_PRACTICE_LEVEL = "level-00-bits-logic";

export type PracticeScope =
  | { type: "all" }
  | { type: "path"; pathSlug: string }
  | { type: "lessons"; keys: string[] }
  /** Miss queue only — Anki-style “due”, no random filler. */
  | { type: "due" };

export function completionKey(level: string, slug: string): string {
  return `${level}/${slug}`;
}

export function isDefaultPracticeQuestion(q: PracticeQuestion): boolean {
  return q.lessonLevel === DEFAULT_PRACTICE_LEVEL;
}

/**
 * Foundations starter is always unlocked.
 * Completing lessons unlocks additional bank items for those lessons.
 */
export function unlockedQuestions(
  completedKeys: Set<string>,
): PracticeQuestion[] {
  return PRACTICE_BANK.filter(
    (q) =>
      isDefaultPracticeQuestion(q) ||
      completedKeys.has(completionKey(q.lessonLevel, q.lessonSlug)),
  );
}

export function questionsForScope(
  completedKeys: Set<string>,
  scope: PracticeScope,
): PracticeQuestion[] {
  const unlocked = unlockedQuestions(completedKeys);
  if (scope.type === "all" || scope.type === "due") return unlocked;
  if (scope.type === "path") {
    return unlocked.filter(
      (q) => practicePathSlugForLevel(q.lessonLevel) === scope.pathSlug,
    );
  }
  const want = new Set(scope.keys);
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

/** Paths that currently have at least one unlocked question. */
export function unlockedPathBuckets(
  completedKeys: Set<string>,
): PracticePathBucket[] {
  const unlocked = unlockedQuestions(completedKeys);
  const byPath = new Map<
    string,
    { lessons: Set<string>; count: number }
  >();

  for (const q of unlocked) {
    const slug = practicePathSlugForLevel(q.lessonLevel);
    if (!slug) continue;
    let bucket = byPath.get(slug);
    if (!bucket) {
      bucket = { lessons: new Set(), count: 0 };
      byPath.set(slug, bucket);
    }
    bucket.count += 1;
    bucket.lessons.add(completionKey(q.lessonLevel, q.lessonSlug));
  }

  return [...byPath.entries()]
    .map(([pathSlug, data]) => ({
      pathSlug,
      title: PRACTICE_PATH_TITLES[pathSlug] ?? pathSlug,
      questionCount: data.count,
      lessonCount: data.lessons.size,
    }))
    .sort((a, b) => {
      // Foundations first, then alpha
      if (a.pathSlug === "foundations") return -1;
      if (b.pathSlug === "foundations") return 1;
      return a.title.localeCompare(b.title);
    });
}

export type PracticeLessonOption = {
  key: string;
  pathSlug: string;
  pathTitle: string;
  lessonSlug: string;
  label: string;
  questionCount: number;
};

/** Unique lessons in the unlocked pool, for the custom picker. */
export function unlockedLessonOptions(
  completedKeys: Set<string>,
): PracticeLessonOption[] {
  const unlocked = unlockedQuestions(completedKeys);
  const map = new Map<string, PracticeLessonOption>();

  for (const q of unlocked) {
    const pathSlug = practicePathSlugForLevel(q.lessonLevel) ?? "unknown";
    const key = completionKey(q.lessonLevel, q.lessonSlug);
    const existing = map.get(key);
    if (existing) {
      existing.questionCount += 1;
      continue;
    }
    map.set(key, {
      key,
      pathSlug,
      pathTitle: PRACTICE_PATH_TITLES[pathSlug] ?? pathSlug,
      lessonSlug: q.lessonSlug,
      label: q.lessonSlug.replace(/-/g, " "),
      questionCount: 1,
    });
  }

  return [...map.values()].sort((a, b) => {
    if (a.pathSlug !== b.pathSlug) {
      if (a.pathSlug === "foundations") return -1;
      if (b.pathSlug === "foundations") return 1;
      return a.pathTitle.localeCompare(b.pathTitle);
    }
    return a.label.localeCompare(b.label);
  });
}

/**
 * Session builder:
 * - `due`: due ids in queue order only, no filler
 * - otherwise: priority ids in scope first, then shuffle the rest
 * Caps at `size` (default 8).
 */
export function buildSession(opts: {
  completedKeys: Set<string>;
  priorityIds: string[];
  size?: number;
  scope?: PracticeScope;
}): PracticeQuestion[] {
  const size = opts.size ?? 8;
  const scope = opts.scope ?? { type: "all" };
  const pool = questionsForScope(opts.completedKeys, scope);
  const byId = new Map(pool.map((q) => [q.id, q]));
  const picked: PracticeQuestion[] = [];
  const seen = new Set<string>();

  for (const id of opts.priorityIds) {
    const q = byId.get(id);
    if (!q || seen.has(q.id)) continue;
    picked.push(q);
    seen.add(q.id);
    if (picked.length >= size) return picked;
  }

  if (scope.type === "due") return picked;

  const rest = pool.filter((q) => !seen.has(q.id));
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  for (const q of rest) {
    picked.push(q);
    if (picked.length >= size) break;
  }
  return picked;
}
