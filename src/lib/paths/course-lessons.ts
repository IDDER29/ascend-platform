import type { LevelId } from "@/lib/content/schema";
import { courseOutlineForLevel } from "./course-outlines";
import { FOUNDATIONS_LEVEL, FOUNDATIONS_OUTLINE } from "./foundations-outline";

/**
 * The lesson slugs a course covers when it is only part of a level (`sections` on the course), or null
 * when the course is the whole level. Lessons keep their level and progress keys; a course is a grouping.
 */
export function courseLessonSlugs(course: { levelId?: LevelId; sections?: string[] }): Set<string> | null {
  if (!course.levelId || !course.sections) return null;
  const wanted = new Set(course.sections);
  const outline =
    course.levelId === FOUNDATIONS_LEVEL
      ? FOUNDATIONS_OUTLINE.map((s) => ({
          id: s.id,
          slugs: s.items.flatMap((i) => (i.kind === "live" ? [i.slug] : [])),
        }))
      : (courseOutlineForLevel(course.levelId) ?? []).map((s) => ({ id: s.id, slugs: s.items.map((i) => i.slug) }));
  return new Set(outline.filter((s) => wanted.has(s.id)).flatMap((s) => s.slugs));
}

/** Whether a lesson (by level and slug) belongs to a course. */
export function courseHasLesson(
  course: { levelId?: LevelId; sections?: string[] },
  level: string,
  slug: string,
): boolean {
  if (course.levelId !== level) return false;
  const slugs = courseLessonSlugs(course);
  return slugs === null || slugs.has(slug);
}
