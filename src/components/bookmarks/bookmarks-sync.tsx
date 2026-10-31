"use client";

import { useEffect } from "react";
import { listBookmarksAction, removeBookmarkAction, saveBookmarksAction } from "@/lib/bookmarks/actions";
import type { Bookmark } from "@/lib/bookmarks/model";
import { firstMerge } from "@/lib/bookmarks/sync-rules";
import { localBookmarks, replaceLocalBookmarks, setBookmarkRemote } from "@/lib/bookmarks/use-bookmarks";

const syncedKey = (userId: string) => `ascend:bookmarks-synced:${userId}`;
const DEBOUNCE_MS = 800;

/**
 * Keeps this browser's bookmarks and the signed-in account's in step. Renders nothing. On load it brings
 * in the account's bookmarks (merging, the first time this browser syncs); after that, every save, edit
 * and removal is sent to the account, edits debounced so typing a note isn't a request per key.
 */
export function BookmarksSync({ userId }: { userId: string | null }) {
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const pending = new Map<string, ReturnType<typeof setTimeout>>();

    setBookmarkRemote({
      save(b: Bookmark) {
        clearTimeout(pending.get(b.ref));
        pending.set(
          b.ref,
          setTimeout(() => {
            pending.delete(b.ref);
            void saveBookmarksAction([b]);
          }, DEBOUNCE_MS),
        );
      },
      remove(ref: string) {
        clearTimeout(pending.get(ref));
        pending.delete(ref);
        void removeBookmarkAction(ref);
      },
    });

    void (async () => {
      const remote = await listBookmarksAction();
      if (cancelled || remote === null) return;
      let first = true;
      try {
        first = window.localStorage.getItem(syncedKey(userId)) !== "1";
      } catch {
        // Storage blocked: treat every load as a first merge, which loses nothing.
      }
      if (first) {
        const { merged, toUpload } = firstMerge(localBookmarks(), remote);
        replaceLocalBookmarks(merged);
        if (toUpload.length > 0 && !(await saveBookmarksAction(toUpload))) return;
        try {
          window.localStorage.setItem(syncedKey(userId), "1");
        } catch {
          // Fine: the next load merges again.
        }
      } else {
        replaceLocalBookmarks(remote);
      }
    })();

    return () => {
      cancelled = true;
      setBookmarkRemote(null);
      // Send any edit still waiting, rather than dropping it.
      for (const [ref, t] of pending) {
        clearTimeout(t);
        const b = localBookmarks().find((x) => x.ref === ref);
        if (b) void saveBookmarksAction([b]);
      }
    };
  }, [userId]);
  return null;
}
