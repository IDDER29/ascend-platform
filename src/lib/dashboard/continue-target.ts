import { PATHS, type PathDef } from "@/lib/paths/catalog";
import type { LessonCompletion } from "@/lib/progress/queries";
import { daysOnSince } from "@/lib/dashboard/tenure";

/** Live path that owns a curriculum level, if any. */
export function pathSlugForLevel(level: string): string | null {
  for (const path of PATHS) {
    if (path.status !== "live") continue;
    for (const course of path.courses) {
      if (course.levelId === level) return path.slug;
    }
  }
  return null;
}

/** Path that owns Shellforge capstone. */
export function pathSlugForShellforge(): string | null {
  for (const path of PATHS) {
    if (path.status !== "live") continue;
    if (path.courses.some((c) => c.href === "/projects/shellforge")) {
      return path.slug;
    }
  }
  return null;
}

export type WorkEvent = {
  at: Date;
  pathSlug: string;
};

/** Lesson completions as work events (includes project-role lessons). */
export function lessonWorkEvents(
  completed: ReadonlyArray<LessonCompletion>,
): WorkEvent[] {
  const out: WorkEvent[] = [];
  for (const c of completed) {
    const pathSlug = pathSlugForLevel(c.level);
    if (!pathSlug) continue;
    out.push({ at: c.completedAt, pathSlug });
  }
  return out;
}

/**
 * Continue target = path of the most recent completed lesson, or a passed
 * Shellforge submission if that is newer.
 */
export function resolveContinuePathSlug(input: {
  completed: ReadonlyArray<LessonCompletion>;
  /** Newest passed Shellforge submission time, if any. */
  shellforgePassedAt?: Date | null;
}): string | null {
  const events = lessonWorkEvents(input.completed);
  if (input.shellforgePassedAt) {
    const sf = pathSlugForShellforge();
    if (sf) {
      events.push({ at: input.shellforgePassedAt, pathSlug: sf });
    }
  }
  if (events.length === 0) return null;
  let best = events[0]!;
  for (const e of events) {
    if (e.at.getTime() > best.at.getTime()) best = e;
  }
  return best.pathSlug;
}

/** Earliest lesson completion on this path — tenure clock start. */
export function earliestLessonCompletedAt(
  path: PathDef,
  completed: ReadonlyArray<LessonCompletion>,
): Date | null {
  const levels = new Set(
    path.courses.map((c) => c.levelId).filter(Boolean) as string[],
  );
  let earliest: Date | null = null;
  for (const c of completed) {
    if (!levels.has(c.level)) continue;
    if (!earliest || c.completedAt.getTime() < earliest.getTime()) {
      earliest = c.completedAt;
    }
  }
  return earliest;
}

/** Days on path from first lesson done; null if none (hide caption). */
export function pathDaysOnPath(
  path: PathDef,
  completed: ReadonlyArray<LessonCompletion>,
  now: Date = new Date(),
): number | null {
  const first = earliestLessonCompletedAt(path, completed);
  if (!first) return null;
  return daysOnSince(first, now);
}
