/**
 * Practice's reads and writes. The database is passed in, so tests run these against SQLite. Server-only in
 * use: call it from server actions and loaders.
 */
import { and, eq, ne, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as pgSchema from "@/lib/db/schema.pg";
import { pickCard } from "./card-merge";
import { cleanCard } from "./card-rules";
import { cleanSession } from "./session-rules";
import type { PracticeCard } from "./sm2";

export type Store = { db: PostgresJsDatabase<typeof pgSchema>; schema: typeof pgSchema };

export type SyncState = {
  cards: PracticeCard[];
  sessionIds: string[];
  oldestSessionAt: number | null;
  /** When progress was last reset (ms), if a reset marker says so. */
  resetAt: number | null;
};

/**
 * "Reset progress" leaves one row in `practice_cards` saying when, so a browser still holding older data
 * can't put it back. It is never due and never listed as a card.
 */
export const RESET_MARKER = "__reset__";
const NEVER_DUE = "9999-12-31T00:00:00.000Z";
const SESSIONS_PER_INSERT = 50;

const markerId = (userId: string) => `${userId}:${RESET_MARKER}`;

export async function writeResetMarker({ db, schema }: Store, userId: string, now = Date.now()): Promise<void> {
  const at = new Date(now).toISOString();
  await db
    .insert(schema.practiceCards)
    .values({ id: markerId(userId), userId, questionId: RESET_MARKER, state: "new", dueAt: NEVER_DUE, updatedAt: at })
    .onConflictDoUpdate({ target: schema.practiceCards.id, set: { updatedAt: at } });
}

/** Delete every card but the reset marker. */
export async function deleteCards({ db, schema }: Store, userId: string): Promise<void> {
  const t = schema.practiceCards;
  await db.delete(t).where(and(eq(t.userId, userId), ne(t.questionId, RESET_MARKER)));
}

export async function readResetAt({ db, schema }: Store, userId: string): Promise<number | null> {
  const [row] = await db
    .select({ at: schema.practiceCards.updatedAt })
    .from(schema.practiceCards)
    .where(eq(schema.practiceCards.id, markerId(userId)))
    .limit(1);
  return row ? Date.parse(row.at) : null;
}

/**
 * Save graded cards. One statement, so it's all or nothing, and a stored card is only replaced by a copy that
 * `pickCard` would prefer: a stale tab or a fresh "new" card can't undo a review. Invalid cards are skipped.
 */
export async function applyCards(
  store: Store,
  userId: string,
  input: unknown[],
  knownCardIds: ReadonlySet<string>,
  now = Date.now(),
): Promise<void> {
  const resetAt = await readResetAt(store, userId);
  // One row per card: Postgres rejects a statement that touches a row twice.
  const best = new Map<string, PracticeCard>();
  for (const item of input) {
    const card = cleanCard(item, knownCardIds, now);
    if (!card || (resetAt !== null && Date.parse(card.updatedAt) <= resetAt)) continue;
    const other = best.get(card.questionId);
    if (!other || pickCard(card, other) === "local") best.set(card.questionId, card);
  }
  if (best.size === 0) return;

  const t = store.schema.practiceCards;
  await store.db
    .insert(t)
    .values([...best.values()].map((card) => ({ id: `${userId}:${card.questionId}`, userId, ...card })))
    .onConflictDoUpdate({
      target: t.id,
      set: {
        state: sql`excluded.state`,
        reps: sql`excluded.reps`,
        ease: sql`excluded.ease`,
        intervalDays: sql`excluded.interval_days`,
        dueAt: sql`excluded.due_at`,
        lapses: sql`excluded.lapses`,
        updatedAt: sql`excluded.updated_at`,
      },
      // The same precedence as `pickCard`.
      setWhere: sql`excluded.state <> 'new' and (
        ${t.state} = 'new' or (
          not (
            excluded.state = ${t.state} and excluded.reps = ${t.reps} and excluded.lapses = ${t.lapses}
            and excluded.interval_days = ${t.intervalDays} and excluded.ease = ${t.ease}
          ) and (
            excluded.lapses > ${t.lapses}
            or (excluded.lapses = ${t.lapses} and excluded.reps > ${t.reps})
            or (excluded.lapses = ${t.lapses} and excluded.reps = ${t.reps} and excluded.updated_at > ${t.updatedAt})
          )
        )
      )`,
    });
}

/** Save finished sessions. A session already saved is left as it is; empty or invalid ones are skipped. */
export async function applySessions(
  store: Store,
  userId: string,
  input: unknown[],
  knownCardIds: ReadonlySet<string>,
  now = Date.now(),
): Promise<void> {
  const resetAt = await readResetAt(store, userId);
  const rows = input.flatMap((item) => {
    const session = cleanSession(item, knownCardIds, now);
    if (!session || session.total === 0) return [];
    if (resetAt !== null && session.createdAt.getTime() <= resetAt) return [];
    return [
      {
        ...session,
        userId,
        missIds: JSON.stringify(session.missIds),
        questionIds: JSON.stringify(session.questionIds),
      },
    ];
  });
  for (let i = 0; i < rows.length; i += SESSIONS_PER_INSERT) {
    await store.db
      .insert(store.schema.practiceSessions)
      .values(rows.slice(i, i + SESSIONS_PER_INSERT))
      .onConflictDoNothing();
  }
}

/** Everything a browser needs to reconcile with the account. Throws on a read error: empty must mean empty. */
export async function readSyncState(store: Store, userId: string, now = Date.now()): Promise<SyncState> {
  const { db, schema } = store;
  const resetAt = await readResetAt(store, userId);
  const cards = await db.select().from(schema.practiceCards).where(eq(schema.practiceCards.userId, userId));
  const sessions = await db
    .select({ id: schema.practiceSessions.id, createdAt: schema.practiceSessions.createdAt })
    .from(schema.practiceSessions)
    .where(eq(schema.practiceSessions.userId, userId));
  return {
    cards: cards
      .filter((row) => row.questionId !== RESET_MARKER)
      .map((row) => ({
        questionId: row.questionId,
        state: row.state as PracticeCard["state"],
        reps: row.reps,
        ease: row.ease,
        intervalDays: row.intervalDays,
        dueAt: row.dueAt,
        lapses: row.lapses,
        updatedAt: row.updatedAt,
      })),
    sessionIds: sessions.map((row) => row.id),
    oldestSessionAt: sessions.length
      ? sessions.reduce((min, row) => Math.min(min, new Date(row.createdAt).getTime()), now)
      : null,
    resetAt,
  };
}
