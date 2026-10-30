/**
 * The memory curve: an estimate of how much of the learner's Practice cards
 * they'd recall, today and over the next weeks — if they keep reviewing when
 * cards come due, and if they stop. See docs/learning-science/spaced-repetition.md.
 *
 * Practice schedules with SM-2, which doesn't model recall. This estimate uses
 * FSRS's forgetting curve (the power-law form of FSRS 4.5), with recall 90%
 * after S days and forgetting slowing down over time:
 *   R(t, S) = (1 + F · t / S) ^ C,  C = −0.5,  F = 19/81  (so R(S, S) = 0.9)
 * SM-2 sets each card's interval so it comes due about when it's worth
 * reviewing, so the interval stands in for S. It's an estimate from review
 * history, not a measurement — the page says so.
 */
import type { PracticeCard } from "./sm2";

const DAY_MS = 86_400_000;
/** Recall at which a card counts as due: the curve's own definition of S. */
const TARGET = 0.9;
/** A card just missed (learning again) is fragile: half a day of stability. */
const LEARNING_STABILITY = 0.5;
export const CURVE_DAYS = 30;

export type MemoryPoint = { day: number; kept: number; stopped: number };

export type MemoryCurve = {
  /** Cards that have been reviewed at least once (new cards aren't counted). */
  cards: number;
  /** Average estimated recall right now, 0–1. */
  today: number;
  /** Day 0 (today) to CURVE_DAYS. */
  points: MemoryPoint[];
};

const DECAY = -0.5;
const FACTOR = 19 / 81;

export function recall(daysSince: number, stability: number): number {
  return Math.pow(1 + (FACTOR * Math.max(0, daysSince)) / Math.max(stability, 0.01), DECAY);
}

type Memory = { last: number; stability: number; ease: number };

function memoryOf(card: PracticeCard, now: number): Memory | null {
  if (card.state === "new") return null;
  if (card.state === "learning") {
    return { last: (Date.parse(card.updatedAt) - now) / DAY_MS, stability: LEARNING_STABILITY, ease: card.ease };
  }
  const stability = Math.max(1, card.intervalDays);
  // The last review is when the current interval started.
  const last = (Date.parse(card.dueAt) - now) / DAY_MS - stability;
  return { last, stability, ease: card.ease };
}

/**
 * "kept": each card is reviewed (and remembered) the day it comes due, so its
 * stability grows by its ease like SM-2's "good". "stopped": no more reviews.
 */
export function memoryCurve(cards: PracticeCard[], now: Date): MemoryCurve {
  const t0 = now.getTime();
  const memories = cards.map((c) => memoryOf(c, t0)).filter((m): m is Memory => m !== null);
  if (memories.length === 0) return { cards: 0, today: 0, points: [] };

  const kept = memories.map((m) => ({ ...m }));
  const points: MemoryPoint[] = [];
  for (let day = 0; day <= CURVE_DAYS; day++) {
    let keptSum = 0;
    let stoppedSum = 0;
    memories.forEach((m, i) => {
      stoppedSum += recall(day - m.last, m.stability);
      const k = kept[i];
      if (recall(day - k.last, k.stability) < TARGET - 1e-9) {
        // Due (or overdue): reviewed today, and it holds longer next time.
        k.stability = k.stability < 1 ? 1 : Math.max(1, Math.round(k.stability * k.ease));
        k.last = day;
      }
      keptSum += recall(day - k.last, k.stability);
    });
    points.push({ day, kept: keptSum / memories.length, stopped: stoppedSum / memories.length });
  }
  return { cards: memories.length, today: points[0].stopped, points };
}
