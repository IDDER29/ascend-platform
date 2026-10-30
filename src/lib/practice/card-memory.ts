/**
 * One card's memory over time — the sawtooth. Each review restarts the clock
 * and, when it's right, makes the memory sturdier (higher stability S), so the
 * next curve falls more slowly; a miss makes it fragile again. Rebuilt from
 * Practice history by replaying the same SM-2 grades the scheduler applied.
 * Curve and stability as on the dashboard (`memory-curve.ts`); see
 * docs/learning-science/spaced-repetition.md §1.9.
 */
import type { PracticeSessionRecord } from "./history";
import { recall } from "./memory-curve";
import { createNewCard, gradeCard, type PracticeCard } from "./sm2";

const DAY_MS = 86_400_000;
/** A missed card is relearned: half a day of stability, like the dashboard. */
const MISSED_STABILITY = 0.5;

export type CardReview = {
  at: string;
  /** Days since the first review. */
  day: number;
  correct: boolean;
  /** Stability after this review, in days: how long until recall falls to 90%. */
  stability: number;
};

export type CardMemory = {
  reviews: CardReview[];
  /** Days from the first review to now. */
  today: number;
  /** Estimated recall now, 0–1; null before any review. */
  now: number | null;
  /** When recall is predicted to reach 90% — the next review. */
  due: { at: string; day: number } | null;
  /** If the card had never been reviewed after the first time. */
  firstStability: number | null;
};

export function cardMemory(questionId: string, history: PracticeSessionRecord[], now: Date): CardMemory {
  const events = history
    .filter((s) => s.questionIds.includes(questionId))
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
    .map((s) => ({ at: s.at, correct: !s.missIds.includes(questionId) }));
  if (events.length === 0) return { reviews: [], today: 0, now: null, due: null, firstStability: null };

  const t0 = Date.parse(events[0].at);
  const dayOf = (iso: string) => (Date.parse(iso) - t0) / DAY_MS;
  let card: PracticeCard = createNewCard(questionId, new Date(t0));
  const reviews = events.map(({ at, correct }) => {
    card = gradeCard(card, correct ? "good" : "again", new Date(at));
    const stability = card.state === "learning" ? MISSED_STABILITY : Math.max(1, card.intervalDays);
    return { at, day: dayOf(at), correct, stability };
  });

  const last = reviews[reviews.length - 1];
  const today = (now.getTime() - t0) / DAY_MS;
  const dueAt = new Date(Date.parse(last.at) + last.stability * DAY_MS).toISOString();
  return {
    reviews,
    today,
    now: recall(today - last.day, last.stability),
    due: { at: dueAt, day: dayOf(dueAt) },
    firstStability: reviews[0].stability,
  };
}

/** Recall at `day` (days since the first review) from the reviews before it. */
export function recallAt(memory: CardMemory, day: number): number | null {
  const before = memory.reviews.filter((r) => r.day <= day + 1e-9);
  const last = before[before.length - 1];
  return last ? recall(day - last.day, last.stability) : null;
}
