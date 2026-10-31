import type { PracticeScopeType } from "./history";

/** What a synced Practice session may contain; the record comes from the browser, so nothing is trusted. */
const SCOPES: PracticeScopeType[] = ["all", "path", "section", "lessons", "due"];
const MAX_QUESTIONS = 500;
const DAY = 24 * 60 * 60 * 1000;

export type CleanSession = {
  id: string;
  scopeType: PracticeScopeType;
  scopeLabel: string;
  pathSlug: string | null;
  correct: number;
  total: number;
  missIds: string[];
  questionIds: string[];
  createdAt: Date;
};

/**
 * A session ready to store, or null if it can't be one. Card ids not in the bank are dropped (old history
 * can mention retired cards); the date may be up to a year old (history synced later) but not in the future.
 */
export function cleanSession(input: unknown, knownCardIds: Set<string>, now = Date.now()): CleanSession | null {
  if (typeof input !== "object" || input === null) return null;
  const s = input as Record<string, unknown>;
  if (typeof s.id !== "string" || !/^[A-Za-z0-9_-]{1,64}$/.test(s.id)) return null;
  if (typeof s.scopeType !== "string" || !SCOPES.includes(s.scopeType as PracticeScopeType)) return null;
  const correct = s.correct;
  const total = s.total;
  if (!Number.isInteger(correct) || !Number.isInteger(total)) return null;
  if ((correct as number) < 0 || (correct as number) > (total as number) || (total as number) > MAX_QUESTIONS) return null;
  const ids = (v: unknown) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && knownCardIds.has(x)).slice(0, MAX_QUESTIONS) : [];
  let createdAt = new Date(now);
  if (typeof s.at === "string") {
    const t = Date.parse(s.at);
    if (Number.isNaN(t) || t > now + 5 * 60 * 1000 || t < now - 365 * DAY) return null;
    createdAt = new Date(t);
  }
  return {
    id: s.id,
    scopeType: s.scopeType as PracticeScopeType,
    scopeLabel: typeof s.scopeLabel === "string" ? s.scopeLabel.slice(0, 120) : "",
    pathSlug: typeof s.pathSlug === "string" && /^[a-z0-9-]{1,64}$/.test(s.pathSlug) ? s.pathSlug : null,
    correct: correct as number,
    total: total as number,
    missIds: ids(s.missIds),
    questionIds: ids(s.questionIds),
    createdAt,
  };
}
