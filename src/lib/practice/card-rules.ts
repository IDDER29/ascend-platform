import type { PracticeCard } from "./sm2";

/** What a synced card may contain; it comes from the browser, so nothing is trusted. */
const STATES: PracticeCard["state"][] = ["new", "learning", "review"];
const MIN_EASE = 1.3;
const MAX_EASE = 3.0;
export const MAX_INTERVAL_DAYS = 36500;
const MAX_COUNT = 100_000;
const CLOCK_SLACK_MS = 5 * 60 * 1000;

function count(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;
}

/** The time in ms, or null unless it's a short, plausible date string. */
function time(value: unknown): number | null {
  if (typeof value !== "string" || value.length > 40) return null;
  const t = Date.parse(value);
  return Number.isFinite(t) && t >= 0 && t < Date.UTC(9999, 0, 1) ? t : null;
}

/**
 * A card ready to store, or null if it can't be one. Dates are written one way (they're compared as text),
 * a review "from the future" (a fast clock) counts as now, and runaway intervals are capped.
 */
export function cleanCard(input: unknown, knownCardIds: ReadonlySet<string>, now = Date.now()): PracticeCard | null {
  if (typeof input !== "object" || input === null) return null;
  const c = input as Record<string, unknown>;
  if (typeof c.questionId !== "string" || !knownCardIds.has(c.questionId)) return null;
  if (typeof c.state !== "string" || !STATES.includes(c.state as PracticeCard["state"])) return null;
  const reps = count(c.reps);
  const lapses = count(c.lapses);
  const intervalDays = count(c.intervalDays);
  if (reps === null || lapses === null || intervalDays === null) return null;
  const ease = c.ease;
  if (typeof ease !== "number" || !(ease >= MIN_EASE && ease <= MAX_EASE)) return null;
  const dueAt = time(c.dueAt);
  const updatedAt = time(c.updatedAt);
  if (dueAt === null || updatedAt === null) return null;
  return {
    questionId: c.questionId,
    state: c.state as PracticeCard["state"],
    reps: Math.min(reps, MAX_COUNT),
    ease,
    intervalDays: Math.min(intervalDays, MAX_INTERVAL_DAYS),
    dueAt: new Date(dueAt).toISOString(),
    lapses: Math.min(lapses, MAX_COUNT),
    updatedAt: new Date(updatedAt > now + CLOCK_SLACK_MS ? now : updatedAt).toISOString(),
  };
}
