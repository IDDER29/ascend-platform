/**
 * How a browser's Practice data and the account's are reconciled. Pure, so the browser and the tests share
 * it; the server applies the same card precedence in SQL (`store.ts`).
 */
import type { PracticeCard } from "./sm2";

export type SyncLimits = {
  /** When progress was last reset (ms): anything from then or earlier is gone. */
  resetAt: number | null;
  /** Copies from then or earlier are never uploaded (ms); see `uploadFloor`. */
  floor: number | null;
};

const DAY = 24 * 60 * 60 * 1000;

function sameSchedule(a: PracticeCard, b: PracticeCard): boolean {
  return (
    a.state === b.state &&
    a.reps === b.reps &&
    a.lapses === b.lapses &&
    a.intervalDays === b.intervalDays &&
    a.ease === b.ease
  );
}

/**
 * Which copy of one card to keep. A reviewed card beats a new one. Otherwise more history wins, because
 * grading never lowers (lapses, reps): a copy graded after a failed load, or on a fast clock, can't beat a
 * mature one on its date alone. Ties go to the account.
 */
export function pickCard(local: PracticeCard, server: PracticeCard): "local" | "server" {
  if (local.state === "new") return "server";
  if (server.state === "new") return "local";
  if (sameSchedule(local, server)) return "server";
  if (local.lapses !== server.lapses) return local.lapses > server.lapses ? "local" : "server";
  if (local.reps !== server.reps) return local.reps > server.reps ? "local" : "server";
  return Date.parse(local.updatedAt) > Date.parse(server.updatedAt) ? "local" : "server";
}

function isCard(value: unknown): value is PracticeCard {
  const c = value as Partial<PracticeCard> | null;
  return !!c && typeof c.questionId === "string" && typeof c.updatedAt === "string" && typeof c.state === "string";
}

/**
 * The browser's cards and the account's as one deck (the browser's order, then cards only the account has),
 * plus the reviews the account is missing.
 */
export function reconcileCards(
  local: PracticeCard[],
  server: PracticeCard[],
  { resetAt, floor }: SyncLimits,
): { merged: PracticeCard[]; toUpload: PracticeCard[] } {
  const kept = (c: PracticeCard) => isCard(c) && (resetAt === null || Date.parse(c.updatedAt) > resetAt);
  const remote = new Map(server.filter(kept).map((c) => [c.questionId, c]));
  const merged: PracticeCard[] = [];
  const toUpload: PracticeCard[] = [];
  const seen = new Set<string>();

  for (const card of local.filter(kept)) {
    if (seen.has(card.questionId)) continue;
    seen.add(card.questionId);
    const theirs = remote.get(card.questionId);
    const mayUpload = card.state !== "new" && (floor === null || Date.parse(card.updatedAt) > floor);
    if (theirs && !(mayUpload && pickCard(card, theirs) === "local")) {
      merged.push(theirs);
      continue;
    }
    merged.push(card);
    if (mayUpload) toUpload.push(card);
  }
  for (const [id, card] of remote) {
    if (!seen.has(id)) merged.push(card);
  }
  return { merged, toUpload };
}

/**
 * Progress resets made before reset markers left no date. So that an old browser can't undo one, only copies
 * newer than the account's oldest session (with a day's slack) are uploaded on their own, and nothing at all
 * into an empty account. With a marker, `resetAt` already covers it.
 */
export function uploadFloor(account: {
  resetAt: number | null;
  oldestSessionAt: number | null;
  serverCardCount: number;
}): number | null {
  if (account.resetAt !== null) return null;
  if (account.oldestSessionAt !== null) return account.oldestSessionAt - DAY;
  return account.serverCardCount > 0 ? null : Infinity;
}

/** The browser's finished sessions that the account should have and doesn't. */
export function sessionsToUpload<T extends { id: string; at: string; total: number }>(
  local: T[],
  serverIds: ReadonlySet<string>,
  { resetAt, floor }: SyncLimits,
): T[] {
  const after = Math.max(resetAt ?? -Infinity, floor ?? -Infinity);
  return local.filter((s) => s.total > 0 && !serverIds.has(s.id) && Date.parse(s.at) > after);
}
