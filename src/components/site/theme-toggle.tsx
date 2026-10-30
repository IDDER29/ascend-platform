"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "ascend-theme";

export type ThemeMode = "light" | "dark";
export type ThemePreference = "light" | "dark" | "system";

const themeListeners = new Set<() => void>();

function subscribeTheme(onStoreChange: () => void) {
  themeListeners.add(onStoreChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    themeListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function systemMode(): ThemeMode {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

function readTheme(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return systemMode();
  } catch {
    return "light";
  }
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

function notifyTheme() {
  themeListeners.forEach((listener) => listener());
}

function writeTheme(mode: ThemeMode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
  applyTheme(mode);
  notifyTheme();
}

/** Stored preference: explicit light/dark, or system (no key). */
export function getThemePreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return "system";
  } catch {
    return "system";
  }
}

/** Apply Light / Dark / System — same storage as sidebar ThemeToggle. */
export function setThemePreference(pref: ThemePreference) {
  if (pref === "system") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    applyTheme(systemMode());
    notifyTheme();
    return;
  }
  writeTheme(pref);
}

const emptySubscribe = () => () => {};

/**
 * Light / dark toggle — persists in localStorage, syncs the `dark` class on <html>.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const mode = useSyncExternalStore(subscribeTheme, readTheme, () => "light");
  const ready = useSyncExternalStore(emptySubscribe, () => true, () => false);

  function toggle() {
    writeTheme(mode === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-card-border bg-bg text-ink-secondary transition-colors hover:border-xp-border hover:bg-xp-bg hover:text-xp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/35 focus-visible:ring-offset-2",
        !ready && "opacity-0",
        className,
      )}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={mode === "dark" ? "Light mode" : "Dark mode"}
    >
      {mode === "dark" ? <Sun size={16} strokeWidth={2.2} /> : <Moon size={16} strokeWidth={2.2} />}
    </button>
  );
}
