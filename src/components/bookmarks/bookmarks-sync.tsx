"use client";

import { useEffect } from "react";
import { listBookmarksAction, removeBookmarkAction, saveBookmarksAction } from "@/lib/bookmarks/actions";
import type { Bookmark } from "@/lib/bookmarks/model";
import {
  backupKey,
  browserStorage,
  claimGuestBookmarks,
  lastSyncKey,
  LEGACY_KEY,
  mergeInto,
  migrateLegacyBookmarks,
  syncedKey,
} from "@/lib/bookmarks/storage";
import { firstMerge, laterMerge } from "@/lib/bookmarks/sync-rules";
import { localBookmarks, replaceLocalBookmarks, setBookmarkOwner, setBookmarkRemote } from "@/lib/bookmarks/use-bookmarks";

const DEBOUNCE_MS = 800;

/**
 * Says whose bookmarks this browser shows and, when signed in, keeps them and the account's in step.
 * Renders nothing. On load it brings in the account's bookmarks; after that, every save, edit and removal is
 * sent to the account, edits debounced so typing a note isn't a request per key.
 */
export function BookmarksSync({ userId }: { userId: string | null }) {
  useEffect(() => {
    setBookmarkOwner(userId);
    // A tab running the previous version may write the old shared list again.
    const onStorage = (e: StorageEvent) => {
      if (e.key === LEGACY_KEY) migrateLegacyBookmarks(browserStorage());
    };
    window.addEventListener("storage", onStorage);
    const stop = () => {
      window.removeEventListener("storage", onStorage);
      setBookmarkOwner(undefined);
    };
    if (!userId) return stop;

    let cancelled = false;
    const pending = new Map<string, ReturnType<typeof setTimeout>>();

    setBookmarkRemote({
      save(b: Bookmark) {
        clearTimeout(pending.get(b.ref));
        pending.set(
          b.ref,
          setTimeout(() => {
            pending.delete(b.ref);
            void saveBookmarksAction([b], userId);
          }, DEBOUNCE_MS),
        );
      },
      remove(ref: string) {
        clearTimeout(pending.get(ref));
        pending.delete(ref);
        void removeBookmarkAction(ref, userId);
      },
    });

    void (async () => {
      const startedAt = Date.now();
      const remote = await listBookmarksAction(userId);
      if (cancelled || remote === null) return;
      const storage = browserStorage();
      let first = true;
      let lastSyncAt: number | null = null;
      try {
        first = storage.getItem(syncedKey(userId)) !== "1";
        lastSyncAt = Number(storage.getItem(lastSyncKey(userId))) || null;
      } catch {
        // Storage blocked: treat every load as a first merge, which loses nothing.
      }

      let merged: Bookmark[];
      let toUpload: Bookmark[];
      if (first) {
        claimGuestBookmarks(storage, userId);
        ({ merged, toUpload } = firstMerge(localBookmarks(), remote));
      } else {
        const result = laterMerge(localBookmarks(), remote, lastSyncAt);
        ({ merged, toUpload } = result);
        try {
          // Keep a copy of whatever the account no longer has before it leaves this list.
          mergeInto(storage, backupKey(userId), result.dropped);
        } catch {
          return;
        }
      }
      replaceLocalBookmarks(merged);
      if (toUpload.length > 0 && !(await saveBookmarksAction(toUpload, userId))) return;
      try {
        storage.setItem(syncedKey(userId), "1");
        storage.setItem(lastSyncKey(userId), String(startedAt));
      } catch {
        // Fine: the next load merges again.
      }
    })().catch((err) => console.warn("[bookmarks] sync did not finish:", err));

    return () => {
      cancelled = true;
      setBookmarkRemote(null);
      // Send any edit still waiting, rather than dropping it.
      for (const [ref, t] of pending) {
        clearTimeout(t);
        const b = localBookmarks().find((x) => x.ref === ref);
        if (b) void saveBookmarksAction([b], userId);
      }
      stop();
    };
  }, [userId]);
  return null;
}
