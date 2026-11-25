import type { Bookmark } from "./model";

/** Limits on what one account can store, so a bookmark can't be used to fill the database. */
export const MAX_BOOKMARKS = 1000;
export const NOTE_MAX = 4000;
const MAX_TEXT = { ref: 500, title: 300, where: 300, href: 1000, preview: 1000 };

const str = (v: unknown, max: number): string | null => (typeof v === "string" && v.length <= max ? v : null);

/** A bookmark from the browser, checked and trimmed to its known fields; null if it isn't one. */
export function cleanBookmark(raw: unknown): Bookmark | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  const ref = str(b.ref, MAX_TEXT.ref);
  const title = str(b.title, MAX_TEXT.title);
  const kind = typeof b.kind === "string" && b.kind.length <= 40 ? b.kind : null;
  const reason = b.reason === "later" || b.reason === "reference" || b.reason === "revisit" ? b.reason : null;
  if (!ref || title === null || !kind || !reason) return null;
  const href = b.href === null ? null : str(b.href, MAX_TEXT.href);
  // A site path ("/lessons/...", but not "//elsewhere", which browsers read as another site) or a web URL.
  if (href !== null && !(href.startsWith("/") && !href.startsWith("//")) && !/^https?:\/\//.test(href)) return null;
  return {
    ref,
    kind: kind as Bookmark["kind"],
    title,
    where: str(b.where, MAX_TEXT.where) ?? "",
    href,
    topic: typeof b.topic === "string" ? b.topic.slice(0, 100) : null,
    lessonKey: typeof b.lessonKey === "string" ? b.lessonKey.slice(0, 200) : null,
    ...(typeof b.questionId === "string" ? { questionId: b.questionId.slice(0, 200) } : {}),
    ...(typeof b.preview === "string" ? { preview: b.preview.slice(0, MAX_TEXT.preview) } : {}),
    reason,
    note: typeof b.note === "string" ? b.note.slice(0, NOTE_MAX) : "",
    savedAt: typeof b.savedAt === "string" && !Number.isNaN(Date.parse(b.savedAt)) ? b.savedAt : new Date().toISOString(),
  };
}

/**
 * The first time a browser syncs, its bookmarks and the account's are merged (nothing is lost; for a
 * bookmark in both, the account's copy wins). After that see `laterMerge`.
 */
export function firstMerge(local: Bookmark[], remote: Bookmark[]): { merged: Bookmark[]; toUpload: Bookmark[] } {
  const remoteRefs = new Set(remote.map((b) => b.ref));
  const toUpload = local.filter((b) => !remoteRefs.has(b.ref));
  return { merged: [...remote, ...toUpload], toUpload };
}

/**
 * After the first sync the account leads, so a bookmark removed on one device doesn't come back from
 * another. One saved here since the last sync never arrived, so it's kept and uploaded. Anything else the
 * account no longer has is returned as `dropped`, for the caller to back up.
 */
export function laterMerge(
  local: Bookmark[],
  remote: Bookmark[],
  lastSyncAt: number | null,
): { merged: Bookmark[]; toUpload: Bookmark[]; dropped: Bookmark[] } {
  const remoteRefs = new Set(remote.map((b) => b.ref));
  const missing = local.filter((b) => !remoteRefs.has(b.ref));
  const unsent = (b: Bookmark) => lastSyncAt !== null && Date.parse(b.savedAt) > lastSyncAt;
  const toUpload = missing.filter(unsent);
  return { merged: [...remote, ...toUpload], toUpload, dropped: missing.filter((b) => !unsent(b)) };
}
