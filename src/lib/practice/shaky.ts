/**
 * Shaky cards: right, but not easy. A card is shaky when its latest review was
 * right and either
 *  - **slow**: it took clearly longer than you usually take on that kind of card
 *    (or past a floor while there's too little history to know your usual), or
 *  - **just recovered**: you missed it in one of the two reviews before.
 * Answers you got right quickly aren't here — those are holding. Answers over
 * three minutes are ignored (you were probably away).
 */
import { PRACTICE_BANK } from "./bank";
import type { PracticeSessionRecord } from "./history";
import type { PracticeItem } from "./types";

/** Below this, an answer is never "slow", whatever your usual pace. */
const FLOOR_MS: Record<PracticeItem["kind"], number> = { mcq: 10_000, flashcard: 8_000, typed: 20_000, cloze: 15_000 };
/** Slow = this many times your usual (median) right-answer time for the kind. */
const SLOW_FACTOR = 1.75;
/** Enough of your own answers to know your usual pace. */
const MIN_SAMPLES = 5;
const AWAY_MS = 180_000;
const RECENT_REVIEWS = 2;

export type ShakyReason = "slow" | "recovered";
export type ShakyCard = { id: string; reason: ShakyReason; ms: number | null; usualMs: number | null; at: string };

const kindOf = new Map(PRACTICE_BANK.map((q) => [q.id, q.kind]));

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function shakyCards(history: PracticeSessionRecord[]): ShakyCard[] {
  const sessions = [...history].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));

  // Your usual pace: the median time of your right answers, per kind of card.
  const rightTimes = new Map<PracticeItem["kind"], number[]>();
  for (const s of sessions) {
    for (const [id, ms] of Object.entries(s.timesMs ?? {})) {
      const kind = kindOf.get(id);
      if (!kind || ms > AWAY_MS || s.missIds.includes(id)) continue;
      rightTimes.set(kind, [...(rightTimes.get(kind) ?? []), ms]);
    }
  }
  const usual = new Map(
    [...rightTimes].filter(([, t]) => t.length >= MIN_SAMPLES).map(([kind, t]) => [kind, median(t)] as const),
  );

  // Each card's reviews, oldest first.
  const reviews = new Map<string, { at: string; right: boolean; ms: number | null }[]>();
  for (const s of sessions) {
    for (const id of new Set(s.questionIds)) {
      const list = reviews.get(id) ?? [];
      list.push({ at: s.at, right: !s.missIds.includes(id), ms: s.timesMs?.[id] ?? null });
      reviews.set(id, list);
    }
  }

  const out: ShakyCard[] = [];
  for (const [id, list] of reviews) {
    const kind = kindOf.get(id);
    const last = list[list.length - 1];
    if (!kind || !last.right) continue;
    const usualMs = usual.get(kind) ?? null;
    const limit = Math.max(FLOOR_MS[kind], usualMs !== null ? usualMs * SLOW_FACTOR : 0);
    if (last.ms !== null && last.ms <= AWAY_MS && last.ms > limit) {
      out.push({ id, reason: "slow", ms: last.ms, usualMs, at: last.at });
    } else if (list.slice(-1 - RECENT_REVIEWS, -1).some((r) => !r.right)) {
      out.push({ id, reason: "recovered", ms: last.ms, usualMs, at: last.at });
    }
  }
  return out.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}
