/**
 * Where bookmarks live in the browser: one list per account, and one for the guest, so people sharing a
 * browser never see (or upload) each other's. Pure: the storage is passed in.
 */
import type { Bookmark } from "./model";

export type KeyValue = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  keys: () => string[];
};

/** The single list every account used to share. */
export const LEGACY_KEY = "ascend:bookmarks";
/** Old bookmarks that could belong to more than one account: kept, shown and sent to nobody. */
const UNCLAIMED_KEY = "ascend:bookmarks:unclaimed";
const UNREADABLE_KEY = "ascend:bookmarks:unreadable";

export const bookmarksKey = (owner: string | null) => `ascend:bookmarks:v2:${owner ?? "guest"}`;
export const backupKey = (userId: string) => `ascend:bookmarks:backup:${userId}`;
export const syncedKey = (userId: string) => `ascend:bookmarks-synced:${userId}`;
export const lastSyncKey = (userId: string) => `ascend:bookmarks-lastsync:${userId}`;

export function parseList(raw: string | null): Bookmark[] {
  try {
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((b): b is Bookmark => typeof b?.ref === "string" && typeof b?.kind === "string")
      : [];
  } catch {
    return [];
  }
}

export function readList(storage: KeyValue, key: string): Bookmark[] {
  return parseList(storage.getItem(key));
}

/** Add `incoming` to the list at `key`; on a clash the incoming copy wins. */
export function mergeInto(storage: KeyValue, key: string, incoming: Bookmark[]) {
  if (incoming.length === 0) return;
  const byRef = new Map([...readList(storage, key), ...incoming].map((b) => [b.ref, b]));
  storage.setItem(key, JSON.stringify([...byRef.values()]));
}

/**
 * Move the old shared list to whoever it belongs to. Each account that synced in this browser left a flag:
 * none means it's the guest's; one means it's that account's; with more there's no telling, so it is set
 * aside. The old key is removed only once the copy is written. An old tab can write it again, so this runs
 * on every load.
 */
export function migrateLegacyBookmarks(storage: KeyValue): void {
  try {
    const raw = storage.getItem(LEGACY_KEY);
    if (raw === null) return;
    const list = parseList(raw);
    if (list.length === 0) {
      if (raw !== "[]") storage.setItem(UNREADABLE_KEY, raw);
    } else {
      const prefix = syncedKey("");
      const owners = storage
        .keys()
        .filter((k) => k.startsWith(prefix) && storage.getItem(k) === "1")
        .map((k) => k.slice(prefix.length));
      const target = owners.length === 0 ? bookmarksKey(null) : owners.length === 1 ? bookmarksKey(owners[0]) : UNCLAIMED_KEY;
      mergeInto(storage, target, list);
    }
    storage.removeItem(LEGACY_KEY);
  } catch {
    // Storage blocked or full: the old list stays where it is.
  }
}

/** Move what was saved while signed out into this account's list (its own copy wins on a clash). */
export function claimGuestBookmarks(storage: KeyValue, userId: string): void {
  try {
    const guest = readList(storage, bookmarksKey(null));
    if (guest.length === 0) return;
    const own = readList(storage, bookmarksKey(userId));
    const mine = new Set(own.map((b) => b.ref));
    storage.setItem(bookmarksKey(userId), JSON.stringify([...own, ...guest.filter((b) => !mine.has(b.ref))]));
    storage.removeItem(bookmarksKey(null));
  } catch {
    // Storage blocked or full: they stay with the guest.
  }
}

export function browserStorage(): KeyValue {
  return {
    getItem: (key) => window.localStorage.getItem(key),
    setItem: (key, value) => window.localStorage.setItem(key, value),
    removeItem: (key) => window.localStorage.removeItem(key),
    keys: () => Object.keys(window.localStorage),
  };
}
