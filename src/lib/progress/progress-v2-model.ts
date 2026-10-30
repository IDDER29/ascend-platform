/**
 * Client-safe model for /progress: the long view of learning, built only
 * from lesson completions and Practice history (no fixtures).
 */
import { LEVELS, type LevelId } from "@/lib/content/schema";
import { deckSessionHref } from "@/lib/practice/coach-custom-model";
import {
  practiceDaysGrid,
  streakDays,
  strengthBuckets,
  type PracticeDaysGrid,
  type StrengthBuckets,
} from "@/lib/practice/coach-home-model";
import { COACH_V2_MAX_SIZE } from "@/lib/practice/coach-v2-flow";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import { completionKey, unlockedQuestions } from "@/lib/practice/session";
import { createNewCard, type PracticeCard } from "@/lib/practice/sm2";

const LOCALE = "en-US";
const DAY_MS = 86_400_000;
const MOMENTUM_WEEKS = 12;
const SLIPPING_MAX = 3;
const WEAK_ACCURACY = 0.7;
const WEAK_MIN_SEEN = 3;
const MILESTONES_MAX = 6;
const SESSION_MILESTONES = [10, 50, 100, 250];

export type ProgressLesson = {
  key: string;
  level: string;
  slug: string;
  title: string;
  href: string;
};

export type ProgressV2Input = {
  /** Every lesson in curriculum order. */
  lessons: ProgressLesson[];
  completions: { key: string; completedAt: string }[];
  cards: PracticeCard[];
  history: PracticeSessionRecord[];
  /** `streaks.current` for signed-in learners; null falls back to practice days. */
  serverStreak: number | null;
  now: Date;
};

export type TrackLevel = {
  id: string;
  number: string;
  name: string;
  lessons: { key: string; title: string; done: boolean }[];
};

export type LevelRetention = {
  id: string;
  number: string;
  name: string;
  lessonsDone: number;
  lessonCount: number;
  /** Unlocked cards in this level. */
  cardCount: number;
  /** Share of unlocked cards at solid or mastered, 0–100; null with no cards unlocked. */
  rememberedPct: number | null;
  strength: StrengthBuckets;
};

/** 0 = locked / nothing to remember yet, 1–4 = Practice's strength scale. */
export type ConceptShade = 0 | 1 | 2 | 3 | 4;

export type ConceptTile = {
  key: string;
  title: string;
  href: string;
  shade: ConceptShade;
  label: string;
};

export type SlippingLesson = {
  key: string;
  title: string;
  reason: string;
  href: string;
};

export type MomentumWeek = {
  label: string;
  isThisWeek: boolean;
  lessons: number;
  cards: number;
  accuracy: number | null;
};

export type Milestone = { at: string; dateLabel: string; label: string };

export type ProgressV2Model = {
  dateLabel: string;
  started: boolean;
  hero: {
    levelNumber: string;
    levelName: string;
    done: number;
    total: number;
    allDone: boolean;
    track: TrackLevel[];
    next: { title: string; href: string } | null;
  };
  week: {
    lessonsDone: number;
    cardsAnswered: number;
    accuracy: number | null;
    accuracyDelta: number | null;
    streak: number;
  };
  levels: LevelRetention[];
  concepts: { id: string; number: string; name: string; tiles: ConceptTile[] }[];
  slipping: SlippingLesson[];
  momentum: {
    weeks: MomentumWeek[];
    hasData: boolean;
    firstAccuracy: number | null;
    lastAccuracy: number | null;
  };
  milestones: Milestone[];
  days: PracticeDaysGrid;
};

function levelNumber(id: string): string {
  return id.match(/level-(\d+)/)?.[1] ?? "";
}

function levelName(id: string): string {
  return LEVELS[id as LevelId]?.name ?? id;
}

/** Local midnight of the Monday starting `date`'s week. */
function weekStart(date: Date): Date {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (day.getDay() + 6) % 7;
  day.setDate(day.getDate() - offset);
  return day;
}

function pct(part: number, whole: number): number {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, { month: "short", day: "numeric" });
}

function shadeFor(strength: StrengthBuckets): ConceptShade {
  if (strength.total === 0) return 0;
  const remembered = (strength.solid + strength.mastered) / strength.total;
  if (remembered >= 0.75) return 4;
  if (remembered >= 0.5) return 3;
  if (remembered >= 0.25) return 2;
  return 1;
}

function tallies(history: PracticeSessionRecord[]) {
  const byId = new Map<string, { seen: number; missed: number }>();
  for (const session of history) {
    const missed = new Set(session.missIds);
    for (const id of session.questionIds) {
      const t = byId.get(id) ?? { seen: 0, missed: 0 };
      t.seen += 1;
      if (missed.has(id)) t.missed += 1;
      byId.set(id, t);
    }
  }
  return byId;
}

export function buildProgressV2Model(input: ProgressV2Input): ProgressV2Model {
  const { lessons, completions, history, serverStreak, now } = input;
  const doneAt = new Map(completions.map((c) => [c.key, c.completedAt]));
  const completedKeys = new Set(doneAt.keys());
  const levelIds = [...new Set(lessons.map((l) => l.level))];

  // Cards: every unlocked card, with a fresh "new" card where Practice has none yet.
  const cardById = new Map(input.cards.map((c) => [c.questionId, c]));
  const unlocked = unlockedQuestions(completedKeys);
  const cardsFor = (ids: string[]) =>
    ids.map((id) => cardById.get(id) ?? createNewCard(id, now));
  const unlockedIdsByLesson = new Map<string, string[]>();
  for (const q of unlocked) {
    const key = completionKey(q.lessonLevel, q.lessonSlug);
    unlockedIdsByLesson.set(key, [...(unlockedIdsByLesson.get(key) ?? []), q.id]);
  }

  // Hero
  const next = lessons.find((l) => !completedKeys.has(l.key)) ?? null;
  const heroLevel = next?.level ?? lessons[lessons.length - 1]?.level ?? "";
  const track = levelIds.map((id) => ({
    id,
    number: levelNumber(id),
    name: levelName(id),
    lessons: lessons
      .filter((l) => l.level === id)
      .map((l) => ({ key: l.key, title: l.title, done: completedKeys.has(l.key) })),
  }));

  // Week
  const thisWeek = weekStart(now).getTime();
  const lastWeek = thisWeek - 7 * DAY_MS;
  const inRange = (iso: string, from: number, to: number) => {
    const t = Date.parse(iso);
    return t >= from && t < to;
  };
  const sessionsIn = (from: number, to: number) => history.filter((s) => inRange(s.at, from, to));
  const accuracyOf = (sessions: PracticeSessionRecord[]) => {
    const total = sessions.reduce((sum, s) => sum + s.total, 0);
    return total === 0 ? null : pct(sessions.reduce((sum, s) => sum + s.correct, 0), total);
  };
  const end = now.getTime() + DAY_MS;
  const weekSessions = sessionsIn(thisWeek, end);
  const weekAccuracy = accuracyOf(weekSessions);
  const lastAccuracy = accuracyOf(sessionsIn(lastWeek, thisWeek));

  // Learned vs remembered
  const levels = levelIds.map((id): LevelRetention => {
    const levelLessons = lessons.filter((l) => l.level === id);
    const ids = levelLessons.flatMap((l) => unlockedIdsByLesson.get(l.key) ?? []);
    const strength = strengthBuckets(cardsFor(ids));
    return {
      id,
      number: levelNumber(id),
      name: levelName(id),
      lessonsDone: levelLessons.filter((l) => completedKeys.has(l.key)).length,
      lessonCount: levelLessons.length,
      cardCount: ids.length,
      rememberedPct: ids.length === 0 ? null : pct(strength.solid + strength.mastered, ids.length),
      strength,
    };
  });

  // Concept map
  const concepts = levelIds.map((id) => ({
    id,
    number: levelNumber(id),
    name: levelName(id),
    tiles: lessons
      .filter((l) => l.level === id)
      .map((l): ConceptTile => {
        const ids = unlockedIdsByLesson.get(l.key) ?? [];
        const strength = strengthBuckets(cardsFor(ids));
        const shade = shadeFor(strength);
        return {
          key: l.key,
          title: l.title,
          href: l.href,
          shade,
          label:
            shade === 0
              ? `${l.title} — not started`
              : `${l.title} — ${pct(strength.solid + strength.mastered, strength.total)}% remembered`,
        };
      }),
  }));

  // Slipping: overdue reviews and lessons with a weak hit rate.
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const byQuestion = tallies(history);
  const slipping = lessons
    .map((l) => {
      const ids = unlockedIdsByLesson.get(l.key) ?? [];
      const overdue = ids.filter((id) => {
        const card = cardById.get(id);
        return card && card.state !== "new" && Date.parse(card.dueAt) < startOfToday;
      }).length;
      let seen = 0;
      let missed = 0;
      for (const id of ids) {
        const t = byQuestion.get(id);
        if (t) {
          seen += t.seen;
          missed += t.missed;
        }
      }
      const hit = seen === 0 ? 1 : (seen - missed) / seen;
      const weak = seen >= WEAK_MIN_SEEN && hit < WEAK_ACCURACY;
      const reasons = [
        overdue > 0 ? `${overdue} overdue` : null,
        weak ? `${Math.round(hit * 100)}% hit rate` : null,
      ].filter(Boolean);
      return {
        key: l.key,
        title: l.title,
        reason: reasons.join(" · "),
        href: deckSessionHref(ids.slice(0, COACH_V2_MAX_SIZE), l.title),
        score: overdue + (weak ? missed : 0),
      };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, SLIPPING_MAX)
    .map(({ key, title, reason, href }) => ({ key, title, reason, href }));

  // Momentum: 12 Monday-start weeks, oldest first.
  const weeks: MomentumWeek[] = Array.from({ length: MOMENTUM_WEEKS }, (_, i) => {
    const from = thisWeek - (MOMENTUM_WEEKS - 1 - i) * 7 * DAY_MS;
    const to = from + 7 * DAY_MS;
    const sessions = sessionsIn(from, to);
    return {
      label: shortDate(new Date(from).toISOString()),
      isThisWeek: from === thisWeek,
      lessons: completions.filter((c) => inRange(c.completedAt, from, to)).length,
      cards: sessions.reduce((sum, s) => sum + s.total, 0),
      accuracy: accuracyOf(sessions),
    };
  });
  const accuracies = weeks.map((w) => w.accuracy).filter((a): a is number => a !== null);

  // Milestones: dated, real events only.
  const milestones: Omit<Milestone, "dateLabel">[] = [];
  const byDate = [...completions].sort((a, b) => a.completedAt.localeCompare(b.completedAt));
  if (byDate[0]) {
    const first = lessons.find((l) => l.key === byDate[0].key);
    milestones.push({
      at: byDate[0].completedAt,
      label: `First lesson done${first ? ` — ${first.title}` : ""}`,
    });
  }
  for (const level of levels) {
    if (level.lessonCount === 0 || level.lessonsDone < level.lessonCount) continue;
    const at = lessons
      .filter((l) => l.level === level.id)
      .map((l) => doneAt.get(l.key) ?? "")
      .sort()
      .pop();
    if (at) milestones.push({ at, label: `Finished Level ${level.number} · ${level.name}` });
  }
  const sessionsByDate = [...history].sort((a, b) => a.at.localeCompare(b.at));
  if (sessionsByDate[0]) {
    milestones.push({ at: sessionsByDate[0].at, label: "First practice session" });
  }
  for (const n of SESSION_MILESTONES) {
    const nth = sessionsByDate[n - 1];
    if (nth) milestones.push({ at: nth.at, label: `${n} practice sessions` });
  }

  return {
    dateLabel: now.toLocaleDateString(LOCALE, { weekday: "long", month: "short", day: "numeric" }),
    started: completions.length > 0 || history.length > 0,
    hero: {
      levelNumber: levelNumber(heroLevel),
      levelName: levelName(heroLevel),
      done: lessons.filter((l) => completedKeys.has(l.key)).length,
      total: lessons.length,
      allDone: next === null && lessons.length > 0,
      track,
      next: next ? { title: next.title, href: next.href } : null,
    },
    week: {
      lessonsDone: completions.filter((c) => inRange(c.completedAt, thisWeek, end)).length,
      cardsAnswered: weekSessions.reduce((sum, s) => sum + s.total, 0),
      accuracy: weekAccuracy,
      accuracyDelta:
        weekAccuracy !== null && lastAccuracy !== null ? weekAccuracy - lastAccuracy : null,
      streak: serverStreak ?? streakDays(history, now),
    },
    levels,
    concepts,
    slipping,
    momentum: {
      weeks,
      hasData: weeks.some((w) => w.lessons > 0 || w.cards > 0),
      firstAccuracy: accuracies[0] ?? null,
      lastAccuracy: accuracies[accuracies.length - 1] ?? null,
    },
    milestones: milestones
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, MILESTONES_MAX)
      .map((m) => ({ ...m, dateLabel: shortDate(m.at) })),
    days: practiceDaysGrid(history, now),
  };
}
