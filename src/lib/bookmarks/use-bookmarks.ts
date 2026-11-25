"use client";

import { useSyncExternalStore } from "react";
import type { Bookmark, BookmarkReason, BookmarkTarget } from "./model";
import { bookmarksKey, browserStorage, migrateLegacyBookmarks, parseList } from "./storage";

/**
 * Bookmarks live in this browser first, so saving is instant and works signed out. Each account has its own
 * list, and so does the guest. BookmarksSync (`src/components/bookmarks/bookmarks-sync.tsx`) says whose
 * list to use and, when signed in, registers a remote so every change is also sent to the account.
 */
const EVENT = "ascend:bookmarks";
/** What a read gives before we know whose list it is (and during server rendering). */
const UNKNOWN = "\u0000unknown";

/** undefined until BookmarksSync says; null for the guest. */
let owner: string | null | undefined;

export function setBookmarkOwner(next: string | null | undefined) {
  owner = next;
  if (next !== undefined) migrateLegacyBookmarks(browserStorage());
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readRaw(): string | null {
  if (owner === undefined) return UNKNOWN;
  try {
    return window.localStorage.getItem(bookmarksKey(owner));
  } catch {
    return null;
  }
}

let cache: { raw: string | null; list: Bookmark[] } = { raw: null, list: [] };

function parse(raw: string | null): Bookmark[] {
  if (raw !== cache.raw) cache = { raw, list: parseList(raw) };
  return cache.list;
}

function write(list: Bookmark[]) {
  if (owner === undefined) return;
  try {
    window.localStorage.setItem(bookmarksKey(owner), JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage can be blocked; the save just doesn't stick.
  }
}

const current = () => parse(readRaw());

type Remote = { save: (b: Bookmark) => void; remove: (ref: string) => void };
let remote: Remote | null = null;

/** Where changes are also sent (the signed-in account); null to stop. */
export function setBookmarkRemote(r: Remote | null) {
  remote = r;
}

/** Replace this browser's bookmarks without sending anything back (used when loading the account's). */
export function replaceLocalBookmarks(list: Bookmark[]) {
  write(list);
}

export function localBookmarks(): Bookmark[] {
  return current();
}

export function saveBookmark(target: BookmarkTarget, reason: BookmarkReason = "later") {
  const list = current();
  const existing = list.find((b) => b.ref === target.ref);
  if (existing) return;
  const saved: Bookmark = { ...target, reason, note: "", savedAt: new Date().toISOString() };
  write([...list, saved]);
  remote?.save(saved);
}

export function updateBookmark(ref: string, patch: Partial<Pick<Bookmark, "reason" | "note">>) {
  const list = current().map((b) => (b.ref === ref ? { ...b, ...patch } : b));
  write(list);
  const changed = list.find((b) => b.ref === ref);
  if (changed) remote?.save(changed);
}

export function removeBookmark(ref: string) {
  write(current().filter((b) => b.ref !== ref));
  remote?.remove(ref);
}

/** Every bookmark in this browser; `null` until the browser store has been read. */
export function useBookmarks(): Bookmark[] | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => UNKNOWN);
  return raw === UNKNOWN ? null : parse(raw);
}

export function useBookmark(ref: string): Bookmark | null {
  return useBookmarks()?.find((b) => b.ref === ref) ?? null;
}
