"use server";

import { and, eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/auth";
import { db, schema } from "@/lib/db/client";
import type { Bookmark } from "./model";
import { cleanBookmark, MAX_BOOKMARKS } from "./sync-rules";

/**
 * The signed-in user, if they are who the browser says it's syncing (`ownerId`): a tab left open since
 * someone else signed in must not touch their bookmarks.
 */
async function owner(ownerId?: string) {
  const user = await getCurrentUser();
  return user && (ownerId === undefined || ownerId === user.id) ? user : null;
}

/** The signed-in account's bookmarks, or null for a guest or when accounts are offline. */
export async function listBookmarksAction(ownerId?: string): Promise<Bookmark[] | null> {
  const user = await owner(ownerId);
  if (!user || !db) return null;
  const rows = await db.select().from(schema.bookmarks).where(eq(schema.bookmarks.userId, user.id));
  return rows
    .map((r) => {
      try {
        return cleanBookmark(JSON.parse(r.data));
      } catch {
        return null;
      }
    })
    .filter((b): b is Bookmark => b !== null);
}

/** Save or update bookmarks for the signed-in account. Returns false if nothing could be saved. */
export async function saveBookmarksAction(raw: unknown[], ownerId?: string): Promise<boolean> {
  const user = await owner(ownerId);
  if (!user || !db || !Array.isArray(raw)) return false;
  const conn = db;
  const list = raw.slice(0, MAX_BOOKMARKS).map(cleanBookmark).filter((b): b is Bookmark => b !== null);
  const existing = new Set(
    (await conn.select({ ref: schema.bookmarks.refId }).from(schema.bookmarks).where(eq(schema.bookmarks.userId, user.id))).map(
      (r) => r.ref,
    ),
  );
  // At the cap, existing bookmarks can still be updated, but no new ones are added.
  let room = MAX_BOOKMARKS - existing.size;
  const rows = [];
  for (const b of list) {
    if (!existing.has(b.ref)) {
      if (room <= 0) continue;
      room--;
    }
    rows.push({ id: crypto.randomUUID(), userId: user.id, kind: b.kind, refId: b.ref, data: JSON.stringify(b), createdAt: new Date(b.savedAt) });
  }
  // A few batched statements, not one round trip per bookmark (a first sync can be large).
  for (let i = 0; i < rows.length; i += 200) {
    await conn
      .insert(schema.bookmarks)
      .values(rows.slice(i, i + 200))
      .onConflictDoUpdate({
        target: [schema.bookmarks.userId, schema.bookmarks.refId],
        set: { kind: sql`excluded.kind`, data: sql`excluded.data` },
      });
  }
  return true;
}

export async function removeBookmarkAction(ref: string, ownerId?: string): Promise<boolean> {
  const user = await owner(ownerId);
  if (!user || !db || typeof ref !== "string") return false;
  await db.delete(schema.bookmarks).where(and(eq(schema.bookmarks.userId, user.id), eq(schema.bookmarks.refId, ref)));
  return true;
}
