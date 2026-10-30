import "server-only";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, type LevelId } from "@/lib/content/schema";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { loadPublicPaths } from "@/lib/paths/paths-v2-data";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import type { McqItem } from "@/lib/practice/types";
import { CATALOG_HREF } from "./site-nav";

export type SiteStats = {
  lessons: number;
  minutes: number;
  topics: number;
  cards: number;
  projects: number;
};

/** What's really on Ascend today, counted from the lesson files and the card bank. */
export function siteStats(): SiteStats {
  const lessons = getAllLessons();
  return {
    lessons: lessons.length,
    minutes: lessons.reduce((sum, l) => sum + l.meta.timeMin, 0),
    topics: new Set(lessons.map((l) => l.meta.level)).size,
    cards: PRACTICE_BANK.length,
    // Project lessons, plus the ShellForge capstone.
    projects: lessons.filter((l) => l.meta.slug.startsWith("project-")).length + 1,
  };
}

export type ClimbStep = { levelId: LevelId; name: string; lessons: number; minutes: number; firstLesson: string };

/** The topics from the bottom up, with what's in each. */
export function climbSteps(): ClimbStep[] {
  const lessons = getAllLessons();
  return (Object.keys(LEVELS) as LevelId[])
    .map((id) => {
      const mine = lessons.filter((l) => l.meta.level === id).sort((a, b) => a.meta.order - b.meta.order);
      return {
        levelId: id,
        name: LEVELS[id].name,
        lessons: mine.length,
        minutes: mine.reduce((sum, l) => sum + l.meta.timeMin, 0),
        firstLesson: mine[0] ? lessonHref(id, mine[0].meta.slug) : "",
      };
    })
    .filter((s) => s.lessons > 0);
}

export function publicPaths() {
  return loadPublicPaths(CATALOG_HREF);
}

export type SampleCard = McqItem & { lessonTitle: string; lessonHref: string };

/** A real Practice card, with the lesson it comes from. */
export function sampleCard(id: string): SampleCard | null {
  const item = PRACTICE_BANK.find((c): c is McqItem => c.id === id && c.kind === "mcq");
  if (!item) return null;
  const lesson = getAllLessons().find((l) => l.meta.level === item.lessonLevel && l.meta.slug === item.lessonSlug);
  if (!lesson) return null;
  return {
    ...item,
    lessonTitle: lesson.meta.title,
    lessonHref: lessonHref(lesson.meta.level, lesson.meta.slug),
  };
}
