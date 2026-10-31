import type { Bookmark } from "./model";

/** Limits on what one account can store, so a bookmark can't be used to fill the database. */
export const MAX_BOOKMARKS = 1000;
const MAX_TEXT = { ref: 500, title: 300, where: 300, href: 1000, note: 4000, preview: 1000 };

const str = (v: unknown, max: number): string | null => (typeof v === "string" && v.length <= max ? v : null);

/** A bookmark from the browser, checked and trimmed to its known fields; null if it isn't one. */
export function cleanBookmark(raw: unknown): Bookmark | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  const ref = str(b.ref, MAX_TEXT.ref);
  const title = str(b.title, MAX_TEXT.title);
  const kind = typeof b.kind === "string" ? b.kind : null;
  const reason = b.reason === "later" || b.reason === "reference" || b.reason === "revisit" ? b.reason : null;
  if (!ref || title === null || !kind || !reason) return null;
  const href = b.href === null ? null : str(b.href, MAX_TEXT.href);
  if (href !== null && !href.startsWith("/") && !/^https?:\/\//.test(href)) return null;
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
    note: str(b.note, MAX_TEXT.note) ?? "",
    savedAt: typeof b.savedAt === "string" && !Number.isNaN(Date.parse(b.savedAt)) ? b.savedAt : new Date().toISOString(),
  };
}

/**
 * The first time a browser syncs, its bookmarks and the account's are merged (nothing is lost; for a
 * bookmark in both, the account's copy wins). After that the account is the source of truth, so a
 * bookmark removed on one device doesn't come back from another.
 */
export function firstMerge(local: Bookmark[], remote: Bookmark[]): { merged: Bookmark[]; toUpload: Bookmark[] } {
  const remoteRefs = new Set(remote.map((b) => b.ref));
  const toUpload = local.filter((b) => !remoteRefs.has(b.ref));
  return { merged: [...remote, ...toUpload], toUpload };
}
