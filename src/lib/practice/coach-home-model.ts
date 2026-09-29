import { PRACTICE_BANK } from "./bank";
import { dueCount, nextReviewAt, type NewDayMeta } from "./cards";
import type { DailyGoal } from "./daily-goal";
import {
  pathProgressFromHistory,
  type PathProgressRow,
  type PracticeSessionRecord,
} from "./history";
import { cardsClearedToday } from "./momentum";
import {
  PRACTICE_PATH_BLURBS,
  PRACTICE_PATH_MARKS,
  PRACTICE_PATH_TITLES,
  practicePathSlugForLevel,
} from "./path-map";
import { completionKey, unlockedQuestions } from "./session";
import { localDayKey, type PracticeCard } from "./sm2";
import { practiceTreeForPath } from "./tree";
import { CURRICULUM_HREF } from "@/lib/routes";

export const COACH_SESSION_SIZE = 8;
const MASTERED_INTERVAL_DAYS = 21;
const HEATMAP_WEEKS = 12;
const LOCALE = "en-US";

export type CoachHomeAction = {
  href: string;
  label: string;
  mode: "due" | "all" | "continue";
};

export type CoachHomeInput = {
  cards: PracticeCard[];
  history: PracticeSessionRecord[];
  meta: NewDayMeta;
  completedKeys: ReadonlySet<string>;
  goal: DailyGoal;
  now: Date;
};

export type StrengthBuckets = {
  new: number;
  learning: number;
  solid: number;
  mastered: number;
  total: number;
};

export type DueWeekDay = {
  label: string;
  title: string;
  count: number;
  isToday: boolean;
};

export type PracticeDayCell = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  future: boolean;
  today: boolean;
};

export type PracticeDaysGrid = {
  cells: PracticeDayCell[];
  monthLabels: { label: string; column: number }[];
  practicedDays: number;
  practicedToday: boolean;
};

export type CoachSessionRow = {
  id: string;
  title: string;
  timeLabel: string;
  results: boolean[];
  correct: number;
  total: number;
  misses: number;
};

export type CoachPathStep = { key: string; title: string; done: boolean };

export type CoachHomeModel = {
  dateLabel: string;
  hero: {
    dueNow: number;
    sessionSize: number;
    action: CoachHomeAction;
    lastScore: { correct: number; total: number } | null;
    nextReviewLabel: string | null;
  };
  day: { streak: number; answeredToday: number; goal: DailyGoal };
  modes: { missesDue: number; unlockedCount: number };
  path: {
    slug: string;
    title: string;
    blurb: string;
    mark: string;
    cardCount: number;
    lessonCount: number;
    steps: CoachPathStep[];
    stepQuestionIds: Record<string, string[]>;
    hitRate: PathProgressRow | null;
  };
  sessions: {
    rows: CoachSessionRow[];
    answered: number;
    correct: number;
    toFix: number;
  };
  strength: StrengthBuckets;
  week: DueWeekDay[];
  days: PracticeDaysGrid;
};

export function selectCoachHomeAction(
  dueNow: number,
  unlockedCount: number,
): CoachHomeAction {
  if (dueNow > 0) {
    return {
      href: "/practicev2/session?scope=due",
      label: "Start review",
      mode: "due",
    };
  }
  if (unlockedCount > 0) {
    return {
      href: "/practicev2/session?scope=all",
      label: "Free study",
      mode: "all",
    };
  }
  return { href: CURRICULUM_HREF, label: "Continue learning", mode: "continue" };
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
}

function dayKeyOf(iso: string): string | null {
  const t = new Date(iso);
  return Number.isNaN(t.getTime()) ? null : localDayKey(t);
}

function sessionCountsByDay(
  history: PracticeSessionRecord[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const s of history) {
    const key = dayKeyOf(s.at);
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

export function streakDays(
  history: PracticeSessionRecord[],
  now: Date,
): number {
  const days = sessionCountsByDay(history);
  let cursor = startOfDay(now);
  if (!days.has(localDayKey(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (days.has(localDayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export type CardStrength = "new" | "learning" | "solid" | "mastered";

export function cardStrength(card: Pick<PracticeCard, "state" | "intervalDays">): CardStrength {
  if (card.state === "new") return "new";
  if (card.state === "learning") return "learning";
  return card.intervalDays >= MASTERED_INTERVAL_DAYS ? "mastered" : "solid";
}

export function strengthBuckets(cards: PracticeCard[]): StrengthBuckets {
  const buckets = { new: 0, learning: 0, solid: 0, mastered: 0, total: 0 };
  for (const card of cards) {
    buckets.total += 1;
    buckets[cardStrength(card)] += 1;
  }
  return buckets;
}

export function dueWeek(
  cards: PracticeCard[],
  meta: NewDayMeta,
  now: Date,
): DueWeekDay[] {
  const today = startOfDay(now);
  return Array.from({ length: 7 }, (_, offset) => {
    const start = addDays(today, offset);
    const end = addDays(today, offset + 1).getTime();
    const count =
      offset === 0
        ? dueCount(cards, meta, now)
        : cards.filter((card) => {
            const due = Date.parse(card.dueAt);
            return due >= start.getTime() && due < end;
          }).length;
    const weekday = start.toLocaleDateString(LOCALE, { weekday: "short" });
    const label = offset === 0 ? "Today" : weekday;
    return {
      label,
      title: `${label} · ${count} ${count === 1 ? "card" : "cards"}`,
      count,
      isToday: offset === 0,
    };
  });
}

function intensity(count: number): PracticeDayCell["level"] {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

export function practiceDaysGrid(
  history: PracticeSessionRecord[],
  now: Date,
): PracticeDaysGrid {
  const counts = sessionCountsByDay(history);
  const today = startOfDay(now);
  const mondayOffset = (today.getDay() + 6) % 7;
  const start = addDays(today, -mondayOffset - (HEATMAP_WEEKS - 1) * 7);
  const todayKey = localDayKey(today);

  const cells: PracticeDayCell[] = [];
  const monthLabels: PracticeDaysGrid["monthLabels"] = [];
  let practicedDays = 0;
  for (let i = 0; i < HEATMAP_WEEKS * 7; i += 1) {
    const date = addDays(start, i);
    const key = localDayKey(date);
    const future = date.getTime() > today.getTime();
    const count = future ? 0 : (counts.get(key) ?? 0);
    if (count > 0) practicedDays += 1;
    cells.push({
      date: key,
      count,
      level: intensity(count),
      future,
      today: key === todayKey,
    });
    if (i % 7 === 0) {
      const column = i / 7;
      const previous = column === 0 ? null : addDays(date, -7);
      if (!previous || previous.getMonth() !== date.getMonth()) {
        monthLabels.push({
          label: date.toLocaleDateString(LOCALE, { month: "short" }),
          column,
        });
      }
    }
  }
  return {
    cells,
    monthLabels,
    practicedDays,
    practicedToday: (counts.get(todayKey) ?? 0) > 0,
  };
}

function foundationsPath(
  cards: PracticeCard[],
  history: PracticeSessionRecord[],
  completedKeys: ReadonlySet<string>,
): CoachHomeModel["path"] {
  const slug = "foundations";
  const tree = practiceTreeForPath(slug);
  const lessons = tree?.sections.flatMap((section) => section.lessons) ?? [];
  const cardState = new Map(cards.map((c) => [c.questionId, c.state]));
  const stepQuestionIds: Record<string, string[]> = {};
  for (const lesson of lessons) stepQuestionIds[lesson.key] = [];
  for (const q of PRACTICE_BANK) {
    const key = completionKey(q.lessonLevel, q.lessonSlug);
    stepQuestionIds[key]?.push(q.id);
  }
  const steps = lessons.map((lesson) => {
    const ids = stepQuestionIds[lesson.key];
    const done =
      ids.length === 0
        ? completedKeys.has(lesson.key)
        : ids.every((id) => {
            const state = cardState.get(id);
            return state !== undefined && state !== "new";
          });
    return { key: lesson.key, title: lesson.title, done };
  });
  return {
    slug,
    title: PRACTICE_PATH_TITLES[slug],
    blurb: PRACTICE_PATH_BLURBS[slug],
    mark: PRACTICE_PATH_MARKS[slug],
    cardCount: PRACTICE_BANK.filter(
      (q) => practicePathSlugForLevel(q.lessonLevel) === slug,
    ).length,
    lessonCount: lessons.length,
    steps,
    stepQuestionIds,
    hitRate:
      pathProgressFromHistory(history).find((row) => row.pathSlug === slug) ??
      null,
  };
}

function todaysSessions(
  history: PracticeSessionRecord[],
  now: Date,
): CoachHomeModel["sessions"] {
  const todayKey = localDayKey(now);
  const rows = history
    .filter((s) => dayKeyOf(s.at) === todayKey)
    .sort((a, b) => b.at.localeCompare(a.at))
    .map((s) => {
      const misses = new Set(s.missIds);
      return {
        id: s.id,
        title: s.scopeLabel,
        timeLabel: new Date(s.at).toLocaleTimeString(LOCALE, {
          hour: "numeric",
          minute: "2-digit",
        }),
        results: s.questionIds.map((id) => !misses.has(id)),
        correct: s.correct,
        total: s.total,
        misses: s.missIds.length,
      };
    });
  const answered = rows.reduce((sum, row) => sum + row.total, 0);
  const correct = rows.reduce((sum, row) => sum + row.correct, 0);
  return { rows, answered, correct, toFix: answered - correct };
}

export function buildCoachHomeModel(input: CoachHomeInput): CoachHomeModel {
  const { cards, history, meta, completedKeys, goal, now } = input;
  const unlockedCount = unlockedQuestions(new Set(completedKeys)).length;
  const dueNow = dueCount(cards, meta, now);
  const latest = [...history].sort((a, b) => b.at.localeCompare(a.at))[0];
  const nextIso = nextReviewAt(cards, now);
  const nowMs = now.getTime();

  return {
    dateLabel: now.toLocaleDateString(LOCALE, {
      weekday: "long",
      month: "short",
      day: "numeric",
    }),
    hero: {
      dueNow,
      sessionSize: Math.min(COACH_SESSION_SIZE, dueNow),
      action: selectCoachHomeAction(dueNow, unlockedCount),
      lastScore: latest
        ? { correct: latest.correct, total: latest.total }
        : null,
      nextReviewLabel: nextIso
        ? new Date(nextIso).toLocaleString(LOCALE, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : null,
    },
    day: {
      streak: streakDays(history, now),
      answeredToday: cardsClearedToday(history, now),
      goal,
    },
    modes: {
      missesDue: cards.filter(
        (c) => c.state === "learning" && Date.parse(c.dueAt) <= nowMs,
      ).length,
      unlockedCount,
    },
    path: foundationsPath(cards, history, completedKeys),
    sessions: todaysSessions(history, now),
    strength: strengthBuckets(cards),
    week: dueWeek(cards, meta, now),
    days: practiceDaysGrid(history, now),
  };
}
