/** Client-safe Practice session history + progress helpers. */

import {
  PRACTICE_PATH_TITLES,
  practicePathSlugForLevel,
} from "@/lib/practice/path-map";
import { PRACTICE_BANK } from "@/lib/practice/bank";

export type PracticeScopeType =
  | "all"
  | "path"
  | "section"
  | "lessons"
  | "due";

export type PracticeSessionRecord = {
  id: string;
  at: string;
  scopeType: PracticeScopeType;
  scopeLabel: string;
  pathSlug: string | null;
  correct: number;
  total: number;
  missIds: string[];
  questionIds: string[];
  /**
   * How long each answer took, in ms: to answer for choices / typed / cloze,
   * to reveal for flashcards. Kept in this browser (sessions saved to the
   * account don't carry it yet).
   */
  timesMs?: Record<string, number>;
};

export type PathProgressRow = {
  pathSlug: string;
  title: string;
  correct: number;
  total: number;
  sessions: number;
  accuracy: number;
};

const PREFIX = "ascend_practice_history_v1";
const MAX_SESSIONS = 40;

export function historyKey(userId: string | null): string {
  return `${PREFIX}:${userId ?? "guest"}`;
}

export function readLocalHistory(userId: string | null): PracticeSessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(historyKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSessionRecord).slice(0, MAX_SESSIONS);
  } catch {
    return [];
  }
}

export function writeLocalHistory(
  userId: string | null,
  sessions: PracticeSessionRecord[],
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      historyKey(userId),
      JSON.stringify(sessions.slice(0, MAX_SESSIONS)),
    );
  } catch {
    // ignore quota
  }
}

/** Local and server rows deduped by id (server wins), newest first. */
export function mergeSessionHistory(
  local: PracticeSessionRecord[],
  server: PracticeSessionRecord[],
): PracticeSessionRecord[] {
  const byId = new Map<string, PracticeSessionRecord>();
  for (const session of [...local, ...server]) {
    // The account's copy wins, but keeps the answer times only this browser recorded.
    const earlier = byId.get(session.id);
    byId.set(
      session.id,
      earlier?.timesMs && !session.timesMs
        ? { ...session, timesMs: earlier.timesMs }
        : session,
    );
  }
  return [...byId.values()]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, MAX_SESSIONS);
}

export function prependLocalSession(
  userId: string | null,
  session: PracticeSessionRecord,
): PracticeSessionRecord[] {
  const next = [
    session,
    ...readLocalHistory(userId).filter((s) => s.id !== session.id),
  ].slice(0, MAX_SESSIONS);
  writeLocalHistory(userId, next);
  return next;
}

function isSessionRecord(value: unknown): value is PracticeSessionRecord {
  if (!value || typeof value !== "object") return false;
  const s = value as PracticeSessionRecord;
  return (
    typeof s.id === "string" &&
    typeof s.at === "string" &&
    typeof s.scopeType === "string" &&
    typeof s.scopeLabel === "string" &&
    typeof s.correct === "number" &&
    typeof s.total === "number" &&
    Array.isArray(s.missIds) &&
    Array.isArray(s.questionIds)
  );
}

/** Accuracy per path from answered question ids across sessions. */
export function pathProgressFromHistory(
  sessions: PracticeSessionRecord[],
): PathProgressRow[] {
  const byPath = new Map<
    string,
    { correct: number; total: number; sessionIds: Set<string> }
  >();
  const byQuestion = new Map(
    PRACTICE_BANK.map((q) => [q.id, q] as const),
  );

  for (const session of sessions) {
    for (const qid of session.questionIds) {
      const q = byQuestion.get(qid);
      if (!q) continue;
      const pathSlug = practicePathSlugForLevel(q.lessonLevel);
      if (!pathSlug) continue;
      let row = byPath.get(pathSlug);
      if (!row) {
        row = { correct: 0, total: 0, sessionIds: new Set() };
        byPath.set(pathSlug, row);
      }
      row.total += 1;
      if (!session.missIds.includes(qid)) row.correct += 1;
      row.sessionIds.add(session.id);
    }
  }

  return [...byPath.entries()]
    .map(([pathSlug, data]) => ({
      pathSlug,
      title: PRACTICE_PATH_TITLES[pathSlug] ?? pathSlug,
      correct: data.correct,
      total: data.total,
      sessions: data.sessionIds.size,
      accuracy:
        data.total === 0 ? 0 : Math.round((data.correct / data.total) * 100),
    }))
    .sort((a, b) => {
      if (a.pathSlug === "foundations") return -1;
      if (b.pathSlug === "foundations") return 1;
      return a.title.localeCompare(b.title);
    });
}

export function formatSessionWhen(iso: string, now = new Date()): string {
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return "";
  const diffMs = now.getTime() - at.getTime();
  const dayMs = 86_400_000;
  if (diffMs < dayMs && now.getDate() === at.getDate()) {
    return `Today · ${at.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  if (diffMs < 2 * dayMs) return "Yesterday";
  return at.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ps_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
