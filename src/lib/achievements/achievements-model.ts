/**
 * Client-safe model for /achievements: every badge worked out from real
 * records — lesson completions, project links, Practice cards and sessions.
 * Nothing is stored; a badge is earned when the records say so.
 */
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import { practiceCustomHref, PRACTICE_ROUTES } from "@/lib/practice/routes";
import { completionKey, unlockedQuestions } from "@/lib/practice/session";
import { localDayKey, type PracticeCard } from "@/lib/practice/sm2";
import { latestIso, levelFinishedAt, projectStatuses } from "@/lib/profile/curriculum-records";
import { displayUrl } from "@/lib/profile/links";
import type { ProfileLesson } from "@/lib/profile/profile-model";
import { PROFILE_ROUTES } from "@/lib/profile/routes";
import { ACHIEVEMENTS, type Achievement, type AchievementGroup } from "./catalog";

const LOCALE = "en-US";
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_RUN = 7;
const COMEBACK_GAP_DAYS = 14;
const UP_NEXT_MAX = 3;
const CORE_CLOSE_LESSONS = 5;

export type AchievementsInput = {
  /** Every lesson, in curriculum order. */
  lessons: ProfileLesson[];
  completions: { key: string; completedAt: string }[];
  projectLinks: { projectId: string; repoUrl: string; addedAt: string }[];
  cards: PracticeCard[];
  history: PracticeSessionRecord[];
  now: Date;
};

export type AchievementPart = {
  id: string;
  group: AchievementGroup;
  label: string;
  glyph: string;
  how: string;
  means: string;
  earned: boolean;
  earnedAt: string | null;
  earnedLabel: string | null;
  /** Steps toward it, when it can be counted. */
  progress: { done: number; total: number } | null;
  /** Short distance to earning it: "2 lessons away". Null once earned. */
  distance: string | null;
  /** Not reachable yet (e.g. its cards are still locked). */
  locked: boolean;
  action: { label: string; href: string } | null;
  repoUrl: string | null;
  repoLabel: string | null;
};

export type BoardColumn = {
  levelNumber: string;
  levelName: string;
  level: AchievementPart;
  memory: AchievementPart;
  project: AchievementPart | null;
};

export type AchievementsModel = {
  total: number;
  earnedCount: number;
  headline: string;
  upNext: AchievementPart[];
  /** Every badge, in catalog order. */
  parts: AchievementPart[];
  columns: BoardColumn[];
  habits: AchievementPart[];
  core: AchievementPart;
  /** Index of the last column on the unbroken earned path from the start; -1 for none. */
  litThrough: number;
  /** Earned badge ids, newest first. */
  earnedNewestFirst: string[];
};

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, { month: "short", day: "numeric" });
}

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

function levelNumber(id: string): string {
  return id.match(/level-(\d+)/)?.[1] ?? "";
}

/** Day keys (local) with at least one session, ascending and unique. */
function practiceDays(history: PracticeSessionRecord[]): string[] {
  return [...new Set(history.map((s) => localDayKey(new Date(s.at))))].sort();
}

function dayIndex(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
}

export function buildAchievementsModel(input: AchievementsInput): AchievementsModel {
  const { lessons, now } = input;
  const completedAt = new Map(input.completions.map((c) => [c.key, c.completedAt]));
  const isDone = (l: ProfileLesson) => completedAt.has(l.key);
  const finished = levelFinishedAt(lessons, completedAt);
  const projects = projectStatuses(completedAt, finished, input.projectLinks);
  const unlocked = new Set(unlockedQuestions(new Set(completedAt.keys())).map((q) => q.id));
  const cardFor = new Map(input.cards.map((c) => [c.questionId, c]));
  const nextLessonIn = (level: string) => lessons.find((l) => l.level === level && !isDone(l)) ?? null;
  const firstOpen = lessons.find((l) => !isDone(l)) ?? null;

  // Practice days and runs
  const days = practiceDays(input.history);
  let run = 0;
  let weekEarnedAt: string | null = null;
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && dayIndex(days[i]) - dayIndex(days[i - 1]) === 1 ? run + 1 : 1;
    if (run >= WEEK_RUN && !weekEarnedAt) weekEarnedAt = days[i];
  }
  const todayIndex = dayIndex(localDayKey(now));
  const lastDay = days.at(-1);
  // The current run only counts if it reaches today or yesterday.
  const currentRun = lastDay && todayIndex - dayIndex(lastDay) <= 1 ? run : 0;
  const sessionsByTime = [...input.history].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  const comebackAt =
    sessionsByTime.find((s, i) => i > 0 && Date.parse(s.at) - Date.parse(sessionsByTime[i - 1].at) >= COMEBACK_GAP_DAYS * DAY_MS)
      ?.at ?? null;
  const lastSession = sessionsByTime.at(-1);
  const awayNow = Boolean(lastSession && now.getTime() - Date.parse(lastSession.at) >= COMEBACK_GAP_DAYS * DAY_MS);

  const evaluate = (a: Achievement): Omit<AchievementPart, "id" | "group" | "label" | "glyph" | "how" | "means" | "earnedLabel"> => {
    const base = { progress: null, distance: null, locked: false, action: null, repoUrl: null, repoLabel: null };
    switch (a.group) {
      case "level": {
        const level = a.level!;
        const levelLessons = lessons.filter((l) => l.level === level);
        const doneCount = levelLessons.filter(isDone).length;
        const earnedAt = levelLessons.length > 0 ? (finished.get(level) ?? null) : null;
        const next = nextLessonIn(level);
        const left = levelLessons.length - doneCount;
        return {
          ...base,
          earned: Boolean(earnedAt),
          earnedAt,
          progress: { done: doneCount, total: levelLessons.length },
          distance: earnedAt ? null : `${plural(left, "lesson")} away`,
          action: !earnedAt && next ? { label: doneCount === 0 ? "Start the level" : "Continue lesson", href: next.href } : null,
        };
      }
      case "project": {
        const status = projects.find((p) => p.project.id === a.projectId)!;
        if (status.shippedAt) {
          return {
            ...base,
            earned: true,
            earnedAt: status.shippedAt,
            repoUrl: status.link!.repoUrl,
            repoLabel: displayUrl(status.link!.repoUrl),
          };
        }
        if (status.metAt) {
          return {
            ...base,
            earned: false,
            earnedAt: null,
            distance: "one repo link away",
            action: { label: "Add your repo on your profile", href: PROFILE_ROUTES.owner },
          };
        }
        const { requires } = status.project;
        const required =
          requires.kind === "lesson"
            ? lessons.filter((l) => l.key === completionKey(requires.level, requires.slug))
            : lessons.filter((l) => l.level === requires.level);
        const doneCount = required.filter(isDone).length;
        const next = required.find((l) => !isDone(l)) ?? null;
        return {
          ...base,
          earned: false,
          earnedAt: null,
          progress: required.length > 1 ? { done: doneCount, total: required.length } : null,
          distance: required.length > 1 ? `${plural(required.length - doneCount, "lesson")} away` : "one lesson away",
          action: next ? { label: "Open the project lesson", href: next.href } : null,
        };
      }
      case "memory": {
        const level = a.level!;
        const ids = PRACTICE_BANK.filter((q) => q.lessonLevel === level).map((q) => q.id);
        const solidCards = ids.map((id) => cardFor.get(id)).filter((c): c is PracticeCard => c?.state === "review");
        const earnedAt =
          ids.length > 0 && solidCards.length === ids.length ? latestIso(solidCards.map((c) => c.updatedAt)) : null;
        const open = ids.some((id) => unlocked.has(id));
        const lessonKeys = [...new Set(PRACTICE_BANK.filter((q) => q.lessonLevel === level && unlocked.has(q.id)).map((q) => completionKey(q.lessonLevel, q.lessonSlug)))];
        return {
          ...base,
          earned: Boolean(earnedAt),
          earnedAt,
          locked: !earnedAt && !open,
          progress: { done: solidCards.length, total: ids.length },
          distance: earnedAt ? null : open ? `${plural(ids.length - solidCards.length, "card")} to go` : `unlocks with Level ${levelNumber(level)} lessons`,
          action: !earnedAt && open ? { label: "Review these cards", href: practiceCustomHref(lessonKeys) } : null,
        };
      }
      case "habit": {
        if (a.id === "week-of-practice") {
          return {
            ...base,
            earned: Boolean(weekEarnedAt),
            earnedAt: weekEarnedAt ? new Date(`${weekEarnedAt}T12:00:00`).toISOString() : null,
            progress: weekEarnedAt ? null : { done: Math.min(currentRun, WEEK_RUN), total: WEEK_RUN },
            distance: weekEarnedAt ? null : `${plural(WEEK_RUN - Math.min(currentRun, WEEK_RUN), "more day")} in a row`,
            action: weekEarnedAt ? null : { label: "Practice today", href: PRACTICE_ROUTES.home },
          };
        }
        return {
          ...base,
          earned: Boolean(comebackAt),
          earnedAt: comebackAt,
          distance: comebackAt ? null : awayNow ? "one review session away" : "only after a break",
          action: !comebackAt && awayNow ? { label: "Do one review session", href: PRACTICE_ROUTES.home } : null,
        };
      }
      case "core": {
        const allLessons = lessons.length > 0 && !firstOpen;
        const allShipped = projects.every((p) => p.shippedAt);
        const earnedAt = allLessons && allShipped
          ? latestIso([...lessons.map((l) => completedAt.get(l.key)!), ...projects.map((p) => p.shippedAt!)])
          : null;
        const left = lessons.filter((l) => !isDone(l)).length;
        return {
          ...base,
          earned: Boolean(earnedAt),
          earnedAt,
          progress: { done: lessons.length - left, total: lessons.length },
          distance: earnedAt ? null : left > 0 ? `${plural(left, "lesson")} away` : "ship both projects to finish",
          action: !earnedAt && firstOpen ? { label: "Continue lesson", href: firstOpen.href } : null,
        };
      }
    }
  };

  const parts: AchievementPart[] = ACHIEVEMENTS.map((a) => {
    const result = evaluate(a);
    return {
      id: a.id,
      group: a.group,
      label: a.label,
      glyph: a.glyph,
      how: a.how,
      means: a.means,
      earnedLabel: result.earnedAt ? shortDate(result.earnedAt) : null,
      ...result,
    };
  });
  const byId = (id: string) => parts.find((p) => p.id === id)!;

  const columns: BoardColumn[] = levelIds.map((id) => ({
    levelNumber: levelNumber(id),
    levelName: LEVELS[id].name,
    level: partFor(parts, "level", id)!,
    memory: partFor(parts, "memory", id)!,
    project: partFor(parts, "project", id) ?? null,
  }));

  let litThrough = -1;
  for (const column of columns) {
    if (!column.level.earned) break;
    litThrough += 1;
  }

  // Up next: what's closest and actionable, most urgent first.
  const candidates: AchievementPart[] = [];
  const add = (p: AchievementPart | undefined) => {
    if (p && !p.earned && !candidates.includes(p)) candidates.push(p);
  };
  if (awayNow) add(byId("comeback"));
  for (const p of parts) if (p.group === "project" && p.distance === "one repo link away") add(p);
  add(columns.map((c) => c.level).find((p) => !p.earned && (p.progress?.total ?? 0) > 0));
  add(columns.map((c) => c.memory).find((p) => !p.earned && !p.locked));
  add(byId("week-of-practice"));
  // Core Complete only once it's genuinely close; a far-off goal isn't a next step.
  const core = byId("core-complete");
  if (core.progress && core.progress.total - core.progress.done <= CORE_CLOSE_LESSONS) add(core);
  const upNext = candidates.filter((p) => p.action).slice(0, UP_NEXT_MAX);

  const earned = parts.filter((p) => p.earned);
  const total = parts.length;
  const closest = upNext[0];
  const headline =
    earned.length === total
      ? `All ${total} earned. Keep your Memory badges solid in Practice.`
      : earned.length === 0
        ? closest
          ? `Your first badge is ${closest.distance}: ${closest.label}.`
          : `${total} badges to earn.`
        : closest
          ? `${earned.length} of ${total} earned. Closest next: ${closest.label}, ${closest.distance}.`
          : `${earned.length} of ${total} earned.`;

  return {
    total,
    earnedCount: earned.length,
    headline,
    upNext,
    parts,
    columns,
    habits: parts.filter((p) => p.group === "habit"),
    core: byId("core-complete"),
    litThrough,
    earnedNewestFirst: [...earned].sort((a, b) => Date.parse(b.earnedAt!) - Date.parse(a.earnedAt!)).map((p) => p.id),
  };
}

function partFor(parts: AchievementPart[], group: AchievementGroup, level: LevelId): AchievementPart | undefined {
  const a = ACHIEVEMENTS.find((x) => x.group === group && x.level === level);
  return a ? parts.find((p) => p.id === a.id) : undefined;
}
