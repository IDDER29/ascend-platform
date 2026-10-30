/**
 * Client-safe model for the achievements page: every badge's rule turned
 * into a checklist of criteria, each checked from real records — lesson
 * completions, project links, Practice cards and sessions, other badges.
 * Nothing is stored; a badge is earned when every criterion holds.
 */
import { LEVELS, type LevelId } from "@/lib/content/schema";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";
import { completionKey } from "@/lib/practice/session";
import { localDayKey, type PracticeCard } from "@/lib/practice/sm2";
import { latestIso, levelFinishedAt, projectStatuses } from "@/lib/profile/curriculum-records";
import { displayUrl } from "@/lib/profile/links";
import type { ProfileLesson } from "@/lib/profile/profile-model";
import { curriculumProject } from "@/lib/profile/projects";
import { PROFILE_ROUTES } from "@/lib/profile/routes";
import { ACHIEVEMENTS, GROUP_TITLES, type Achievement, type AchievementGroup, type BadgeRule } from "./catalog";

const LOCALE = "en-US";
const DAY_MS = 24 * 60 * 60 * 1000;
const CLOSEST_MAX = 3;

export type AchievementsInput = {
  /** Every lesson, in curriculum order. */
  lessons: ProfileLesson[];
  completions: { key: string; completedAt: string }[];
  projectLinks: { projectId: string; repoUrl: string; addedAt: string }[];
  cards: PracticeCard[];
  history: PracticeSessionRecord[];
  now: Date;
};

export type Criterion = {
  /** The condition in plain words: "Finish 10 lessons". */
  text: string;
  done: boolean;
  /** When it was met; null while open. */
  at: string | null;
  progress: { done: number; total: number } | null;
  /** For combination badges: the badge this criterion asks for. */
  badgeId: string | null;
  action: { label: string; href: string } | null;
};

export type BadgeView = {
  id: string;
  group: AchievementGroup;
  label: string;
  glyph: string;
  means: string;
  criteria: Criterion[];
  earned: boolean;
  earnedAt: string | null;
  earnedLabel: string | null;
  /** 0–1 across all criteria, counting partial progress. */
  ratio: number;
  /** The next step: the first open criterion's action. */
  action: { label: string; href: string } | null;
  repoUrl: string | null;
  repoLabel: string | null;
};

export type AchievementsModel = {
  total: number;
  earnedCount: number;
  headline: string;
  /** Up to 3 open badges with a next step, closest first. */
  closest: BadgeView[];
  groups: { id: AchievementGroup; title: string; badges: BadgeView[] }[];
  /** Every badge, in catalog order. */
  parts: BadgeView[];
  /** Earned badge ids, newest first. */
  earnedNewestFirst: string[];
};

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, { month: "short", day: "numeric" });
}

function dayIndex(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
}

function criterion(partial: Partial<Criterion> & Pick<Criterion, "text" | "done">): Criterion {
  return { at: null, progress: null, badgeId: null, action: null, ...partial };
}

export function buildAchievementsModel(input: AchievementsInput): AchievementsModel {
  const { lessons, now } = input;
  const completedAt = new Map(input.completions.map((c) => [c.key, c.completedAt]));
  const isDone = (l: ProfileLesson) => completedAt.has(l.key);
  const finished = levelFinishedAt(lessons, completedAt);
  const projects = projectStatuses(completedAt, finished, input.projectLinks);
  const firstOpen = lessons.find((l) => !isDone(l)) ?? null;
  const doneInOrder = [...input.completions].sort((a, b) => Date.parse(a.completedAt) - Date.parse(b.completedAt));
  const continueLesson = (lesson: ProfileLesson | null) =>
    lesson ? { label: doneInOrder.length === 0 ? "Start your first lesson" : "Continue lesson", href: lesson.href } : null;

  // Practice records
  const solidCards = input.cards
    .filter((c) => c.state === "review")
    .sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt));
  const sessions = [...input.history].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  const days = [...new Set(sessions.map((s) => localDayKey(new Date(s.at))))].sort();
  const lastSession = sessions.at(-1);
  const awayDays = lastSession ? Math.floor((now.getTime() - Date.parse(lastSession.at)) / DAY_MS) : null;
  const practice = { label: "Review in Practice", href: PRACTICE_ROUTES.home };

  const cache = new Map<string, BadgeView>();

  const criteriaFor = (rule: BadgeRule): Criterion[] => {
    switch (rule.kind) {
      case "lessons": {
        const reached = doneInOrder[rule.count - 1]?.completedAt ?? null;
        return [
          criterion({
            text: rule.count === 1 ? "Finish a lesson" : `Finish ${rule.count} lessons`,
            done: Boolean(reached),
            at: reached,
            progress: rule.count > 1 ? { done: Math.min(doneInOrder.length, rule.count), total: rule.count } : null,
            action: reached ? null : continueLesson(firstOpen),
          }),
        ];
      }
      case "topic": {
        const topicLessons = lessons.filter((l) => l.level === rule.topic);
        const at = topicLessons.length > 0 ? (finished.get(rule.topic) ?? null) : null;
        return [
          criterion({
            text: `Finish every lesson in ${LEVELS[rule.topic].name}`,
            done: Boolean(at),
            at,
            progress: { done: topicLessons.filter(isDone).length, total: topicLessons.length },
            action: at ? null : continueLesson(topicLessons.find((l) => !isDone(l)) ?? null),
          }),
        ];
      }
      case "allLessons": {
        const done = lessons.length > 0 && !firstOpen;
        return [
          criterion({
            text: "Finish every lesson in the curriculum",
            done,
            at: done ? latestIso(lessons.map((l) => completedAt.get(l.key)!)) : null,
            progress: { done: lessons.filter(isDone).length, total: lessons.length },
            action: done ? null : continueLesson(firstOpen),
          }),
        ];
      }
      case "project": {
        const status = projects.find((p) => p.project.id === rule.projectId)!;
        const project = curriculumProject(rule.projectId)!;
        const { requires } = project;
        const required =
          requires.kind === "lesson"
            ? lessons.filter((l) => l.key === completionKey(requires.level, requires.slug))
            : lessons.filter((l) => l.level === requires.level);
        return [
          criterion({
            text:
              requires.kind === "lesson"
                ? `Finish the ${project.inSentence} lesson`
                : `Finish every lesson in ${LEVELS[requires.level as LevelId].name}`,
            done: Boolean(status.metAt),
            at: status.metAt,
            progress: required.length > 1 ? { done: required.filter(isDone).length, total: required.length } : null,
            action: status.metAt ? null : continueLesson(required.find((l) => !isDone(l)) ?? null),
          }),
          criterion({
            text: `Link your ${project.inSentence} repo on your profile`,
            done: Boolean(status.link),
            at: status.link?.addedAt ?? null,
            action: status.link ? null : { label: "Add your repo on your profile", href: PROFILE_ROUTES.owner },
          }),
        ];
      }
      case "solidCards": {
        const reached = solidCards.length >= rule.count ? solidCards[rule.count - 1].updatedAt : null;
        return [
          criterion({
            text: `Hold ${rule.count} Practice cards solid`,
            done: Boolean(reached),
            at: reached,
            progress: { done: Math.min(solidCards.length, rule.count), total: rule.count },
            action: reached ? null : practice,
          }),
        ];
      }
      case "cleanRun": {
        const run = sessions.find((s) => s.total >= rule.minCards && s.correct === s.total);
        return [
          criterion({
            text: `Get every card right in one review session of ${rule.minCards} or more cards`,
            done: Boolean(run),
            at: run?.at ?? null,
            action: run ? null : { label: "Start a review", href: PRACTICE_ROUTES.home },
          }),
        ];
      }
      case "streak": {
        let run = 0;
        let reachedDay: string | null = null;
        for (let i = 0; i < days.length; i++) {
          run = i > 0 && dayIndex(days[i]) - dayIndex(days[i - 1]) === 1 ? run + 1 : 1;
          if (run >= rule.days && !reachedDay) reachedDay = days[i];
        }
        const lastDay = days.at(-1);
        const current = lastDay && dayIndex(localDayKey(now)) - dayIndex(lastDay) <= 1 ? run : 0;
        return [
          criterion({
            text: `Practice ${rule.days} days in a row`,
            done: Boolean(reachedDay),
            at: reachedDay ? new Date(`${reachedDay}T12:00:00`).toISOString() : null,
            progress: reachedDay ? null : { done: Math.min(current, rule.days), total: rule.days },
            action: reachedDay ? null : { label: "Practice today", href: PRACTICE_ROUTES.home },
          }),
        ];
      }
      case "sessions": {
        const reached = sessions[rule.count - 1]?.at ?? null;
        return [
          criterion({
            text: `Finish ${rule.count} review sessions`,
            done: Boolean(reached),
            at: reached,
            progress: { done: Math.min(sessions.length, rule.count), total: rule.count },
            action: reached ? null : practice,
          }),
        ];
      }
      case "comeback": {
        const back = sessions.find(
          (s, i) => i > 0 && Date.parse(s.at) - Date.parse(sessions[i - 1].at) >= rule.gapDays * DAY_MS,
        );
        const away = awayDays !== null && awayDays >= rule.gapDays;
        return [
          criterion({
            text: `Come back to Practice after ${rule.gapDays} or more days away`,
            done: Boolean(back),
            at: back?.at ?? null,
            action: !back && away ? { label: "Do one review session", href: PRACTICE_ROUTES.home } : null,
          }),
        ];
      }
      case "badges":
        return rule.ids.map((id) => {
          const part = view(ACHIEVEMENTS.find((a) => a.id === id)!);
          return criterion({ text: `Earn ${part.label}`, done: part.earned, at: part.earnedAt, badgeId: id });
        });
    }
  };

  function view(a: Achievement): BadgeView {
    const cached = cache.get(a.id);
    if (cached) return cached;
    const criteria = a.rules.flatMap(criteriaFor);
    const earned = criteria.every((c) => c.done);
    const dated = criteria.map((c) => c.at).filter((at): at is string => Boolean(at));
    const earnedAt = earned && dated.length > 0 ? latestIso(dated) : null;
    const ratio =
      criteria.reduce((sum, c) => sum + (c.done ? 1 : c.progress ? c.progress.done / c.progress.total : 0), 0) /
      criteria.length;
    const projectRule = a.rules.find((r): r is Extract<BadgeRule, { kind: "project" }> => r.kind === "project");
    const link = projectRule ? input.projectLinks.find((p) => p.projectId === projectRule.projectId) : undefined;
    const result: BadgeView = {
      id: a.id,
      group: a.group,
      label: a.label,
      glyph: a.glyph,
      means: a.means,
      criteria,
      earned,
      earnedAt,
      earnedLabel: earnedAt ? shortDate(earnedAt) : null,
      ratio: earned ? 1 : ratio,
      action: earned ? null : (criteria.find((c) => !c.done && c.action)?.action ?? null),
      repoUrl: earned && link ? link.repoUrl : null,
      repoLabel: earned && link ? displayUrl(link.repoUrl) : null,
    };
    cache.set(a.id, result);
    return result;
  }

  const parts = ACHIEVEMENTS.map(view);
  const earned = parts.filter((p) => p.earned);

  // Closest: a returning learner is offered Comeback first; then the open badges furthest along.
  const open = parts.filter((p) => !p.earned && p.action);
  const comeback = open.find((p) => p.id === "comeback");
  const ranked = open
    .filter((p) => p !== comeback)
    .sort((a, b) => b.ratio - a.ratio || parts.indexOf(a) - parts.indexOf(b));
  const closest = [...(comeback ? [comeback] : []), ...ranked].slice(0, CLOSEST_MAX);

  const total = parts.length;
  const next = closest[0];
  const nextStep = next?.criteria.find((c) => !c.done);
  const nextLine =
    next && nextStep
      ? `Closest next: ${next.label}. ${nextStep.text}${nextStep.progress ? ` (${nextStep.progress.done} of ${nextStep.progress.total})` : ""}.`
      : "";
  const headline =
    earned.length === total
      ? `All ${total} earned.`
      : `${earned.length === 0 ? "No badges yet." : `${earned.length} of ${total} earned.`} ${nextLine}`.trim();

  const groups = (Object.keys(GROUP_TITLES) as AchievementGroup[]).map((id) => ({
    id,
    title: GROUP_TITLES[id],
    badges: parts.filter((p) => p.group === id),
  }));

  return {
    total,
    earnedCount: earned.length,
    headline,
    closest,
    groups,
    parts,
    earnedNewestFirst: [...earned]
      .sort((a, b) => Date.parse(b.earnedAt ?? "") - Date.parse(a.earnedAt ?? ""))
      .map((p) => p.id),
  };
}
