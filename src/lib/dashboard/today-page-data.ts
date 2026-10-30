import "server-only";
import { buildAchievementsModel } from "@/lib/achievements/achievements-model";
import { loadAchievementsInput } from "@/lib/achievements/server-page-data";
import { getCurrentUser } from "@/lib/auth/auth";
import { getAllLessons } from "@/lib/content/lessons";
import { levelIds, type LevelId } from "@/lib/content/schema";
import { PATHS, pathHref } from "@/lib/paths/catalog";
import { getFollowingMap } from "@/lib/paths/selected-path";
import { buildPathCards, type PathCard } from "./paths-model";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { completionKey } from "@/lib/practice/session";
import { lessonBlurb } from "./continue";
import { buildToday, type Today, type TodayLesson } from "./today-model";

/** Every lesson in curriculum order (topic, then lesson order), with what the next-lesson card shows. */
export function todayLessons(): TodayLesson[] {
  return getAllLessons()
    .sort((a, b) => levelIds.indexOf(a.meta.level) - levelIds.indexOf(b.meta.level) || a.meta.order - b.meta.order)
    .map(({ meta }) => ({
      key: completionKey(meta.level, meta.slug),
      level: meta.level,
      title: meta.title,
      href: lessonHref(meta.level, meta.slug),
      timeMin: meta.timeMin,
      blurb: lessonBlurb(meta.whyThisMatters),
    }));
}

/** The dashboard for the signed-in learner, or a guest's first day (no sample: a guest's dashboard is their own). */
export async function loadToday(): Promise<{
  today: Today;
  paths: PathCard[];
  firstName: string | null;
  /** Lessons finished, with when, for today's checklist. */
  lessonsDone: { title: string; at: string }[];
}> {
  const [user, loaded, following] = await Promise.all([
    getCurrentUser(),
    loadAchievementsInput({ sampleForGuests: false }),
    getFollowingMap(),
  ]);
  const lessons = todayLessons();
  const completions = loaded?.input.completions ?? [];
  const achievements = loaded ? buildAchievementsModel(loaded.input) : null;

  const shipped = new Set(achievements?.parts.find((p) => p.id === "ship-it")?.earned ? ["/projects/shellforge"] : []);
  const paths = buildPathCards({
    paths: PATHS.filter((p) => p.status === "live").map((p) => ({
      slug: p.slug,
      title: p.title,
      href: pathHref(p.slug),
      courses: p.courses.map((c) => ({ id: c.id, title: c.title, levelId: c.levelId, href: c.href })),
    })),
    following: Object.fromEntries(Object.entries(following).map(([slug, at]) => [slug, at.toISOString()])),
    lessons,
    completions,
    shipped,
  });
  const lead = paths.find((p) => !p.finished) ?? null;
  const leadDef = lead ? PATHS.find((p) => p.slug === lead.slug) : undefined;
  const capstone = lead?.groups.find((g) => g.kind === "capstone" && !g.finished);

  const today = buildToday({
    lessons,
    completions,
    achievements,
    focus:
      lead && leadDef
        ? {
            title: lead.title,
            levels: leadDef.courses.map((c) => c.levelId).filter((l): l is LevelId => Boolean(l)),
            capstone: capstone ? { title: capstone.title, href: capstone.href } : null,
          }
        : null,
  });

  const titleOf = new Map(lessons.map((l) => [l.key, l.title]));
  const lessonsDone = completions
    .filter((c) => titleOf.has(c.key))
    .map((c) => ({ title: titleOf.get(c.key)!, at: c.completedAt }))
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  return {
    today,
    paths,
    firstName: user?.name?.trim().split(/\s+/)[0] || null,
    lessonsDone,
  };
}
