"use client";

import { useSyncExternalStore } from "react";
import type { Bookmark, BookmarkReason, BookmarkTarget } from "./model";

/**
 * Bookmarks live in this browser for now (frontend-only phase). The
 * `bookmarks` table is waiting for a cross-device version.
 */
const KEY = "ascend:bookmarks";
const EVENT = "ascend:bookmarks";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

let cache: { raw: string | null; list: Bookmark[] } = { raw: null, list: [] };

function parse(raw: string | null): Bookmark[] {
  if (raw === cache.raw) return cache.list;
  let list: Bookmark[] = [];
  try {
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (Array.isArray(parsed))
      list = parsed.filter((b): b is Bookmark => typeof b?.ref === "string" && typeof b?.kind === "string");
  } catch {
    list = [];
  }
  cache = { raw, list };
  return list;
}

function write(list: Bookmark[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage can be blocked; the save just doesn't stick.
  }
}

const current = () => parse(readRaw());

export function saveBookmark(target: BookmarkTarget, reason: BookmarkReason = "later") {
  const list = current();
  const existing = list.find((b) => b.ref === target.ref);
  if (existing) return;
  write([...list, { ...target, reason, note: "", savedAt: new Date().toISOString() }]);
}

export function updateBookmark(ref: string, patch: Partial<Pick<Bookmark, "reason" | "note">>) {
  write(current().map((b) => (b.ref === ref ? { ...b, ...patch } : b)));
}

export function removeBookmark(ref: string) {
  write(current().filter((b) => b.ref !== ref));
}

export function replaceBookmarks(list: Bookmark[]) {
  write(list);
}

/** Every bookmark in this browser; `null` until the browser store has been read. */
export function useBookmarks(): Bookmark[] | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "\u0000server");
  return raw === "\u0000server" ? null : parse(raw);
}

export function useBookmark(ref: string): Bookmark | null {
  return useBookmarks()?.find((b) => b.ref === ref) ?? null;
}
