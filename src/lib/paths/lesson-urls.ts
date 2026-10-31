/**
 * Odin-style public lesson URLs:
 * `/lessons/{path}-{courseKey}-{lessonSlug}`
 *
 * Example: `/lessons/foundations-information-what-is-a-bit`
 *
 * Does not import `catalog.ts` (avoids cycles with path helpers).
 */

import { getAllLessons } from "@/lib/content/lessons";
import type { LevelId } from "@/lib/content/schema";
import { FOUNDATIONS_MOVED, FOUNDATIONS_OUTLINE } from "@/lib/paths/foundations-outline";
import { courseOutlineForLevel } from "@/lib/paths/course-outlines";

export type LessonPublicRef = {
  publicSlug: string;
  pathSlug: string;
  courseKey: string;
  level: LevelId;
  slug: string;
};

/** Which path/course owns each live curriculum level. */
const LEVEL_OWNER: Record<
  LevelId,
  { pathSlug: string; courseId: string }
> = {
  "level-00-bits-logic": {
    pathSlug: "foundations",
    courseId: "foundations-course",
  },
  "level-01-machine-memory": {
    pathSlug: "systems-programmer",
    courseId: "machine-memory",
  },
  "level-04-c-basics": {
    pathSlug: "systems-programmer",
    courseId: "c-basics",
  },
  "level-02-the-c-language": {
    pathSlug: "systems-programmer",
    courseId: "the-c-language",
  },
  "level-05-c-contract": {
    pathSlug: "systems-programmer",
    courseId: "c-contract",
  },
  "level-03-systems-software": {
    pathSlug: "systems-programmer",
    courseId: "systems-software",
  },
};

function joinPublicSlug(
  pathSlug: string,
  courseKey: string,
  lessonSlug: string,
): string {
  return `${pathSlug}-${courseKey}-${lessonSlug}`;
}

let cache: {
  byPublic: Map<string, LessonPublicRef>;
  byLevelSlug: Map<string, LessonPublicRef>;
  /** Old public slugs of lessons that moved section → the lesson's current ref. */
  moved: Map<string, LessonPublicRef>;
} | null = null;

function levelSlugKey(level: string, slug: string) {
  return `${level}/${slug}`;
}

function buildIndex() {
  const byPublic = new Map<string, LessonPublicRef>();
  const byLevelSlug = new Map<string, LessonPublicRef>();

  const register = (
    pathSlug: string,
    courseKey: string,
    level: LevelId,
    slug: string,
  ) => {
    const publicSlug = joinPublicSlug(pathSlug, courseKey, slug);
    const ref: LessonPublicRef = {
      publicSlug,
      pathSlug,
      courseKey,
      level,
      slug,
    };
    if (!byPublic.has(publicSlug)) byPublic.set(publicSlug, ref);
    const key = levelSlugKey(level, slug);
    if (!byLevelSlug.has(key)) byLevelSlug.set(key, ref);
  };

  for (const [levelId, owner] of Object.entries(LEVEL_OWNER) as [
    LevelId,
    { pathSlug: string; courseId: string },
  ][]) {
    const lessons = getAllLessons()
      .filter((l) => l.meta.level === levelId)
      .sort((a, b) => a.meta.order - b.meta.order);

    if (levelId === "level-00-bits-logic") {
      const used = new Set<string>();
      for (const section of FOUNDATIONS_OUTLINE) {
        for (const item of section.items) {
          if (item.kind !== "live") continue;
          register(owner.pathSlug, section.id, levelId, item.slug);
          used.add(item.slug);
        }
      }
      for (const lesson of lessons) {
        if (!used.has(lesson.meta.slug)) {
          register(owner.pathSlug, owner.courseId, levelId, lesson.meta.slug);
        }
      }
      continue;
    }

    const outline = courseOutlineForLevel(levelId);
    if (outline) {
      const used = new Set<string>();
      for (const section of outline) {
        for (const item of section.items) {
          register(owner.pathSlug, section.id, levelId, item.slug);
          used.add(item.slug);
        }
      }
      for (const lesson of lessons) {
        if (!used.has(lesson.meta.slug)) {
          register(owner.pathSlug, owner.courseId, levelId, lesson.meta.slug);
        }
      }
    } else {
      for (const lesson of lessons) {
        register(owner.pathSlug, owner.courseId, levelId, lesson.meta.slug);
      }
    }
  }

  const moved = new Map<string, LessonPublicRef>();
  for (const [slug, oldSection] of Object.entries(FOUNDATIONS_MOVED)) {
    const ref = byLevelSlug.get(levelSlugKey("level-00-bits-logic", slug));
    const old = joinPublicSlug("foundations", oldSection, slug);
    if (ref && old !== ref.publicSlug && !byPublic.has(old)) moved.set(old, ref);
  }

  for (const lesson of getAllLessons()) {
    const key = levelSlugKey(lesson.meta.level, lesson.meta.slug);
    if (byLevelSlug.has(key)) continue;
    const courseKey = lesson.meta.level.replace(/^level-\d+-/, "");
    register("curriculum", courseKey, lesson.meta.level, lesson.meta.slug);
  }

  return { byPublic, byLevelSlug, moved };
}

function index() {
  if (!cache) cache = buildIndex();
  return cache;
}

/** Canonical learner lesson URL (Odin-style flat slug). */
export function lessonHref(level: string, slug: string): string {
  const ref = index().byLevelSlug.get(levelSlugKey(level, slug));
  if (ref) return `/lessons/${ref.publicSlug}`;
  return `/lessons/curriculum-${level}-${slug}`;
}

/** Where an old lesson URL now lives, if the lesson moved section; null otherwise. */
export function movedLessonHref(publicSlug: string): string | null {
  const ref = index().moved.get(publicSlug);
  return ref ? `/lessons/${ref.publicSlug}` : null;
}

export function resolveLessonPublicSlug(
  publicSlug: string,
): LessonPublicRef | null {
  return index().byPublic.get(publicSlug) ?? null;
}
