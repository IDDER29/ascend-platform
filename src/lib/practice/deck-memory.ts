/**
 * The whole deck's memory, the way a card's page shows one card: the curve
 * since the last reviews up to today, where it is now, whether a review is
 * due today, and what happens next if you review today or skip. Rebuilt from
 * Practice history (each card replayed as in `card-memory.ts`); the future is
 * `memory-curve.ts` from those replayed cards, so past and future meet at today.
 */
import { cardMemory, recallAt, type CardMemory } from "./card-memory";
import type { PracticeSessionRecord } from "./history";
import { memoryCurve } from "./memory-curve";

const DAY_MS = 86_400_000;
/** Review when the deck's average falls below this — the same 90% each card is scheduled at. */
const REVIEW_AT = 0.9;
/** The past shown: at least two weeks, and always back to the last review (up to 60 days). */
const PAST_DAYS = 14;
const MAX_PAST_DAYS = 60;
const FUTURE_DAYS = 21;
const STEPS_PER_DAY = 4;

export type DeckPoint = { day: number; recall: number };

export type DeckMemory = {
  /** When this was worked out: day 0. */
  at: string;
  cards: number;
  /** Average recall now, 0–1. */
  now: number;
  /** Right after reviewing everything due today. */
  afterReview: number;
  /** Cards below 90% now: a review today brings them back. */
  dueNow: number;
  reviewToday: boolean;
  /** Days ago (negative) of the latest review session, and when. */
  lastReview: { day: number; at: string } | null;
  /** When the next card falls to 90%, if nothing is due today. */
  nextDue: { day: number; at: string } | null;
  /** Days relative to today: past (≤ 0) is what happened. */
  past: DeckPoint[];
  ifReview: DeckPoint[];
  ifSkip: DeckPoint[];
  from: number;
  to: number;
};

export function deckMemory(history: PracticeSessionRecord[], now: Date): DeckMemory | null {
  const ids = [...new Set(history.flatMap((s) => s.questionIds))];
  const memories = ids.map((id) => cardMemory(id, history, now)).filter((m) => m.reviews.length > 0);
  if (memories.length === 0) return null;

  const t = now.getTime();
  const firstAt = (m: CardMemory) => Date.parse(m.reviews[0].at);
  const earliest = Math.min(...memories.map(firstAt));
  const lastAt = Math.max(...history.filter((s) => s.questionIds.length > 0).map((s) => Date.parse(s.at)));
  const lastDay = (lastAt - t) / DAY_MS;
  const from = Math.max(
    Math.floor((earliest - t) / DAY_MS),
    Math.max(-MAX_PAST_DAYS, Math.min(-PAST_DAYS, Math.floor(lastDay) - 2)),
  );

  // What happened: each card's own sawtooth, averaged over the cards learned by then.
  const past: DeckPoint[] = [];
  for (let k = from * STEPS_PER_DAY; k <= 0; k++) {
    const day = k / STEPS_PER_DAY;
    const at = t + day * DAY_MS;
    const values = memories
      .filter((m) => firstAt(m) <= at)
      .map((m) => recallAt(m, (at - firstAt(m)) / DAY_MS))
      .filter((r): r is number => r !== null);
    if (values.length > 0) past.push({ day, recall: values.reduce((a, b) => a + b, 0) / values.length });
  }

  const curve = memoryCurve(
    memories.map((m) => m.card!),
    now,
  );
  const ifReview: DeckPoint[] = [
    { day: 0, recall: curve.today },
    ...curve.points.slice(0, FUTURE_DAYS + 1).map((p) => ({ day: p.day, recall: p.kept })),
  ];
  const ifSkip = curve.points.slice(0, FUTURE_DAYS + 1).map((p) => ({ day: p.day, recall: p.stopped }));

  const dueNow = memories.filter((m) => (m.now ?? 1) < REVIEW_AT - 1e-9).length;
  const nextDueAt = Math.min(...memories.map((m) => (m.due ? Date.parse(m.due.at) : Infinity)));

  return {
    at: now.toISOString(),
    cards: memories.length,
    now: curve.today,
    afterReview: curve.points[0].kept,
    dueNow,
    reviewToday: dueNow > 0,
    lastReview: Number.isFinite(lastAt) ? { day: (lastAt - t) / DAY_MS, at: new Date(lastAt).toISOString() } : null,
    nextDue:
      dueNow === 0 && Number.isFinite(nextDueAt)
        ? { day: (nextDueAt - t) / DAY_MS, at: new Date(nextDueAt).toISOString() }
        : null,
    past,
    ifReview,
    ifSkip,
    from,
    to: FUTURE_DAYS,
  };
}
