import "server-only";
import { buildAchievementsModel } from "@/lib/achievements/achievements-model";
import { loadAchievementsInput } from "@/lib/achievements/server-page-data";
import { getCurrentUser } from "@/lib/auth/auth";
import { getAllLessons } from "@/lib/content/lessons";
import { levelIds } from "@/lib/content/schema";
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
  firstName: string | null;
  /** Lessons finished, with when, for today's checklist. */
  lessonsDone: { title: string; at: string }[];
}> {
  const [user, loaded] = await Promise.all([getCurrentUser(), loadAchievementsInput({ sampleForGuests: false })]);
  const lessons = todayLessons();
  const today = buildToday({
    lessons,
    completions: loaded?.input.completions ?? [],
    achievements: loaded ? buildAchievementsModel(loaded.input) : null,
  });
  const titleOf = new Map(lessons.map((l) => [l.key, l.title]));
  const lessonsDone = (loaded?.input.completions ?? [])
    .filter((c) => titleOf.has(c.key))
    .map((c) => ({ title: titleOf.get(c.key)!, at: c.completedAt }))
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  return { today, firstName: user?.name?.trim().split(/\s+/)[0] || null, lessonsDone };
}
