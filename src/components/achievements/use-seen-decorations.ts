"use client";

import { useEffect, useSyncExternalStore } from "react";

/** Decorations already seen in this browser, so a newly awarded one is marked until its citation is read. */
const KEY = "ascend:decorations-seen";
const EVENT = "ascend:decorations-seen";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function write(ids: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage can be blocked; nothing is marked new then.
  }
}

function parse(raw: string | null): Set<string> | null {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

export function useSeenDecorations(earnedIds: string[]) {
  const seen = parse(useSyncExternalStore(subscribe, read, () => null));
  const earnedKey = earnedIds.join(",");

  // First visit: everything already earned counts as seen, so nothing is "new" yet.
  useEffect(() => {
    if (read() === null) write(earnedKey ? earnedKey.split(",") : []);
  }, [earnedKey]);

  return {
    isNew: (id: string) => Boolean(seen && earnedIds.includes(id) && !seen.has(id)),
    markSeen: (id: string) => {
      if (seen && !seen.has(id)) write([...seen, id]);
    },
  };
}
