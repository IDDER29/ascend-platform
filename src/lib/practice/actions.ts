"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/auth";
import { db, schema } from "@/lib/db/client";
import {
  MAX_DECKS,
  normalizeDeckInput,
  type DeckInput,
  type SavedDeck,
} from "@/lib/practice/deck-recipe";
import { isDailyGoal } from "@/lib/practice/daily-goal";
import type { PracticeScopeType, PracticeSessionRecord } from "@/lib/practice/history";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { completionKey } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";
import { cleanSession } from "@/lib/practice/session-rules";
import { applyCards, applySessions, readSyncState, type Store, type SyncState } from "@/lib/practice/store";
import { MAX_SYNC_ITEMS } from "@/lib/practice/sync-limits";

export type PracticeActionResult =
  | { ok: true }
  | { ok: false; error: string };

const PRACTICE_BANK_IDS: ReadonlySet<string> = new Set(PRACTICE_BANK.map((q) => q.id));

/**
 * The signed-in learner's store. A browser says whose data it's sending (`ownerId`): a tab left open since
 * someone else signed in must not write into their account.
 */
async function learner(ownerId?: string): Promise<{ ok: true; userId: string; store: Store } | { ok: false; error: string }> {
  const user = await getCurrentUser();
  if (!user || (ownerId !== undefined && ownerId !== user.id)) {
    return { ok: false, error: "Sign in to sync Practice." };
  }
  if (!db) return { ok: false, error: "Database unavailable." };
  return { ok: true, userId: user.id, store: { db, schema } };
}

function isBatch(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length <= MAX_SYNC_ITEMS;
}

export async function savePracticeSessionAction(
  input: {
    id: string;
    scopeType: PracticeScopeType;
    scopeLabel: string;
    pathSlug: string | null;
    correct: number;
    total: number;
    missIds: string[];
    questionIds: string[];
    at?: string;
  },
  ownerId?: string,
): Promise<PracticeActionResult> {
  const me = await learner(ownerId);
  if (!me.ok) return me;
  if (!cleanSession(input, PRACTICE_BANK_IDS)) return { ok: false, error: "That Practice session couldn't be saved." };

  try {
    await applySessions(me.store, me.userId, [input], PRACTICE_BANK_IDS);
    revalidatePath("/practice");
    return { ok: true };
  } catch (err) {
    console.error("[practice] session save failed:", err);
    return { ok: false, error: "Could not sync Practice history." };
  }
}

export async function upsertPracticeCardsAction(
  cards: PracticeCard[],
  ownerId?: string,
): Promise<PracticeActionResult> {
  const me = await learner(ownerId);
  if (!me.ok) return me;
  if (!isBatch(cards)) return { ok: false, error: "Too many Practice cards in one sync." };

  try {
    await applyCards(me.store, me.userId, cards, PRACTICE_BANK_IDS);
    revalidatePath("/practice");
    return { ok: true };
  } catch (err) {
    console.error("[practice] card sync failed:", err);
    return { ok: false, error: "Could not sync Practice cards." };
  }
}

/** The account's Practice data, or null if it couldn't be read (never an empty stand-in). */
export async function getPracticeSyncStateAction(ownerId: string): Promise<SyncState | null> {
  const me = await learner(ownerId);
  if (!me.ok) return null;
  try {
    return await readSyncState(me.store, me.userId);
  } catch (err) {
    console.error("[practice] sync state read failed:", err);
    return null;
  }
}

/** Save cards and sessions in one request: a finished session, or data this browser held back. */
export async function reconcilePracticeAction(
  input: { cards: PracticeCard[]; sessions: PracticeSessionRecord[] },
  ownerId: string,
): Promise<PracticeActionResult> {
  const me = await learner(ownerId);
  if (!me.ok) return me;
  const cards: unknown = input?.cards;
  const sessions: unknown = input?.sessions;
  if (!isBatch(cards) || !isBatch(sessions)) return { ok: false, error: "Too much Practice data in one sync." };

  try {
    await applyCards(me.store, me.userId, cards, PRACTICE_BANK_IDS);
    await applySessions(me.store, me.userId, sessions, PRACTICE_BANK_IDS);
    revalidatePath("/practice");
    return { ok: true };
  } catch (err) {
    console.error("[practice] sync failed:", err);
    return { ok: false, error: "Could not sync Practice." };
  }
}

const PRACTICE_LESSON_KEYS = new Set(
  PRACTICE_BANK.map((q) => completionKey(q.lessonLevel, q.lessonSlug)),
);

function revalidateDecks() {
  revalidatePath(PRACTICE_ROUTES.home);
  revalidatePath(PRACTICE_ROUTES.custom);
}

export async function savePracticeDeckAction(
  input: DeckInput & { id?: string },
): Promise<{ ok: true; deck: SavedDeck } | { ok: false; error: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to save decks." };
  if (!db) return { ok: false, error: "Database unavailable." };

  const normalized = normalizeDeckInput(input, PRACTICE_LESSON_KEYS);
  if (!normalized.ok) return normalized;
  const { deck } = normalized;
  const fields = {
    name: deck.name,
    lessonKeys: JSON.stringify(deck.lessonKeys),
    filter: deck.filter,
    formats: JSON.stringify(deck.formats),
  };
  const now = new Date();

  try {
    const owned = await db
      .select({ id: schema.practiceDecks.id })
      .from(schema.practiceDecks)
      .where(eq(schema.practiceDecks.userId, user.id));

    let id = typeof input.id === "string" ? input.id : null;
    if (id) {
      if (!owned.some((row) => row.id === id)) {
        return { ok: false, error: "Deck not found." };
      }
      await db
        .update(schema.practiceDecks)
        .set({ ...fields, updatedAt: now })
        .where(and(eq(schema.practiceDecks.id, id), eq(schema.practiceDecks.userId, user.id)));
    } else {
      if (owned.length >= MAX_DECKS) {
        return { ok: false, error: `You can keep up to ${MAX_DECKS} decks. Delete one first.` };
      }
      id = crypto.randomUUID();
      await db.insert(schema.practiceDecks).values({
        id,
        userId: user.id,
        ...fields,
        createdAt: now,
        updatedAt: now,
      });
    }
    revalidateDecks();
    return { ok: true, deck: { id, ...deck, updatedAt: now.toISOString() } };
  } catch {
    return { ok: false, error: "Could not save the deck." };
  }
}

export async function deletePracticeDeckAction(id: string): Promise<PracticeActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to manage decks." };
  if (!db) return { ok: false, error: "Database unavailable." };
  if (typeof id !== "string" || id.length === 0) return { ok: false, error: "Deck not found." };

  try {
    await db
      .delete(schema.practiceDecks)
      .where(and(eq(schema.practiceDecks.id, id), eq(schema.practiceDecks.userId, user.id)));
    revalidateDecks();
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not delete the deck." };
  }
}

export async function savePracticeDailyGoalAction(
  goal: number,
): Promise<PracticeActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to sync your daily goal." };
  if (!db) return { ok: false, error: "Database unavailable." };
  if (!isDailyGoal(goal)) return { ok: false, error: "Invalid daily goal." };

  const updatedAt = new Date();
  try {
    await db
      .insert(schema.practiceSettings)
      .values({ userId: user.id, dailyGoal: goal, updatedAt })
      .onConflictDoUpdate({
        target: schema.practiceSettings.userId,
        set: { dailyGoal: goal, updatedAt },
      });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not save the daily goal.",
    };
  }
}
