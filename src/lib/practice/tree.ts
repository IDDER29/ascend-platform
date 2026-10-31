/**
 * Client-safe Practice curriculum tree.
 *
 * Keep this module on outline data only: `catalog.ts`, `lessons.ts`, and
 * `lesson-urls.ts` all reach `node:fs` and must not enter client bundles.
 */
import type { LevelId } from "@/lib/content/schema";
import {
  FOUNDATIONS_LEVEL,
  foundationsLiveSections,
} from "@/lib/paths/foundations-outline";
import { COURSE_OUTLINES } from "@/lib/paths/course-outlines";
import { PRACTICE_PATH_TITLES } from "./path-map";

type PracticeLevelOwner = {
  level: LevelId;
  pathSlug: string;
};

const LEVEL_OWNERS: PracticeLevelOwner[] = [
  { level: FOUNDATIONS_LEVEL, pathSlug: "foundations" },
  {
    level: "level-01-machine-memory",
    pathSlug: "systems-programmer",
  },
  {
    level: "level-02-the-c-language",
    pathSlug: "systems-programmer",
  },
  {
    level: "level-03-systems-software",
    pathSlug: "systems-programmer",
  },
];

export type PracticeTreeLesson = {
  key: string;
  level: LevelId;
  slug: string;
  title: string;
};

export type PracticeTreeSection = {
  id: string;
  title: string;
  blurb?: string;
  level: LevelId;
  lessons: PracticeTreeLesson[];
};

export type PracticeTreePath = {
  pathSlug: string;
  title: string;
  sections: PracticeTreeSection[];
};

function completionKey(level: LevelId, slug: string): string {
  return `${level}/${slug}`;
}

function titleFromSlug(slug: string): string {
  const title = slug.replace(/-/g, " ");
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function sectionsForLevel(level: LevelId): PracticeTreeSection[] {
  if (level === FOUNDATIONS_LEVEL) {
    return foundationsLiveSections().map((section) => ({
      id: section.id,
      title: section.title,
      blurb: section.blurb,
      level,
      lessons: section.items.map((item) => ({
        key: completionKey(level, item.slug),
        level,
        slug: item.slug,
        title: item.title,
      })),
    }));
  }

  // Sections with no lessons written yet have no cards either.
  return (COURSE_OUTLINES[level] ?? [])
    .filter((section) => section.items.length > 0)
    .map((section) => ({
      id: section.id,
      title: section.title,
      blurb: section.blurb,
      level,
      lessons: section.items.map((item) => ({
        key: completionKey(level, item.slug),
        level,
        slug: item.slug,
        title: titleFromSlug(item.slug),
      })),
    }));
}

export const PRACTICE_TREE: PracticeTreePath[] = Object.entries(
  PRACTICE_PATH_TITLES,
).map(([pathSlug, title]) => ({
  pathSlug,
  title,
  sections: LEVEL_OWNERS.filter((owner) => owner.pathSlug === pathSlug).flatMap(
    (owner) => sectionsForLevel(owner.level),
  ),
}));

export function practiceTreeForPath(
  pathSlug: string,
): PracticeTreePath | null {
  return PRACTICE_TREE.find((path) => path.pathSlug === pathSlug) ?? null;
}

const LESSON_TITLES = new Map(
  PRACTICE_TREE.flatMap((path) =>
    path.sections.flatMap((section) =>
      section.lessons.map((lesson) => [lesson.key, lesson.title] as const),
    ),
  ),
);

/** Lesson title by `level/slug` completion key. */
export function practiceLessonTitle(key: string): string | null {
  return LESSON_TITLES.get(key) ?? null;
}

export function practiceSectionsForPath(
  pathSlug: string,
): PracticeTreeSection[] {
  return practiceTreeForPath(pathSlug)?.sections ?? [];
}

export function practiceSectionForPath(
  pathSlug: string,
  sectionId: string,
): PracticeTreeSection | null {
  return (
    practiceSectionsForPath(pathSlug).find(
      (section) => section.id === sectionId,
    ) ?? null
  );
}

export function sectionLessonKeys(
  pathSlug: string,
  sectionId: string,
): string[] {
  return (
    practiceSectionForPath(pathSlug, sectionId)?.lessons.map(
      (lesson) => lesson.key,
    ) ?? []
  );
}
