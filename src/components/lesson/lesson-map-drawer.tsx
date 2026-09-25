"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { LevelId } from "@/lib/content/schema";
import { LessonListPanel } from "@/components/lesson/lesson-list-panel";
import { cn } from "@/lib/cn";

/** Ascend course-contents mark — outline rows for sticky chrome. */
function CourseContentsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="2.5"
        y="2.5"
        width="15"
        height="15"
        rx="3.25"
        stroke="currentColor"
        strokeWidth="1.55"
      />
      <circle cx="6.85" cy="7" r="1.15" fill="currentColor" />
      <path
        d="M9.35 7h5.15"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <circle cx="6.85" cy="10" r="1.15" fill="currentColor" />
      <path
        d="M9.35 10h5.15"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <circle cx="6.85" cy="13" r="1.15" fill="currentColor" />
      <path
        d="M9.35 13h3.5"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    </svg>
  );
}

type LessonRow = { slug: string; title: string; order: number; href?: string };

type LessonMapContextValue = {
  open: boolean;
  toggle: () => void;
  close: () => void;
  level: LevelId;
  currentOrder: number;
  lessons: LessonRow[];
  nextLevelName: string | null;
};

const STORAGE_KEY = "ascend:lesson-map-open";

/** Survives provider remounts (Strict Mode / lesson navigations) so the rail doesn’t flash out. */
let memoryOpen = false;
let storageHydrated = false;
const storeListeners = new Set<() => void>();

function emit() {
  storeListeners.forEach((l) => l());
}

function subscribe(onStoreChange: () => void) {
  storeListeners.add(onStoreChange);
  return () => {
    storeListeners.delete(onStoreChange);
  };
}

function getClientSnapshot() {
  return memoryOpen;
}

function getServerSnapshot() {
  return false;
}

function readStorage() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeStorage(open: boolean) {
  try {
    sessionStorage.setItem(STORAGE_KEY, open ? "1" : "0");
  } catch {
    // ignore
  }
}

function hydrateFromStorage() {
  if (storageHydrated) return;
  storageHydrated = true;
  memoryOpen = readStorage();
  emit();
}

function setOpen(open: boolean) {
  memoryOpen = open;
  storageHydrated = true;
  writeStorage(open);
  emit();
}

const LessonMapContext = createContext<LessonMapContextValue | null>(null);

function useLessonMap() {
  const ctx = useContext(LessonMapContext);
  if (!ctx) throw new Error("LessonMap components need LessonMapProvider");
  return ctx;
}

export function LessonMapProvider({
  level,
  currentOrder,
  lessons,
  nextLevelName,
  children,
}: {
  level: LevelId;
  currentOrder: number;
  lessons: LessonRow[];
  nextLevelName: string | null;
  children: React.ReactNode;
}) {
  const open = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  useLayoutEffect(() => {
    hydrateFromStorage();
  }, []);

  const toggle = useCallback(() => setOpen(!memoryOpen), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const value = useMemo(
    () => ({
      open,
      toggle,
      close,
      level,
      currentOrder,
      lessons,
      nextLevelName,
    }),
    [open, toggle, close, level, currentOrder, lessons, nextLevelName],
  );

  return (
    <LessonMapContext.Provider value={value}>{children}</LessonMapContext.Provider>
  );
}

/**
 * Odin-style sticky strip above lesson content — toggle course contents.
 * Sits in the article column so it flows with the page (not a floating FAB).
 */
export function LessonMapToggleBar() {
  const { open, toggle } = useLessonMap();

  return (
    <div className="sticky top-0 z-20 -mx-2.5 bg-paper px-2.5 dark:bg-bg md:-mx-0 md:px-0">
      <div
        className={cn(
          "flex h-12 items-center border-b",
          open ? "border-divider" : "border-divider/50",
        )}
      >
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="lesson-map-rail"
          aria-label={open ? "Hide course contents" : "Show course contents"}
          title={open ? "Hide course contents" : "Show course contents"}
          className={cn(
            "-ml-1 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[11px]",
            "border border-card-border bg-elevated text-ink transition-all duration-150",
            "hover:border-xp-border hover:bg-xp-bg hover:text-xp-text",
            "active:scale-[0.96] active:bg-xp-bg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-bg",
            open &&
              "border-xp-border bg-xp-bg text-xp-text shadow-[0_0_0_3px_rgba(13,159,110,0.12)] hover:border-xp-border hover:bg-xp-bg hover:text-xp-text",
          )}
        >
          <CourseContentsIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}

/** Left course-contents rail — only mounts when open. Toggle lives in LessonMapToggleBar. */
export function LessonMapRail() {
  const { open, level, currentOrder, lessons, nextLevelName } = useLessonMap();

  if (!open) return null;

  return (
    <aside
      id="lesson-map-rail"
      className="sticky top-0 z-10 flex h-screen w-[288px] flex-none flex-col self-start border-r border-divider bg-bg"
    >
      <div className="min-h-0 flex-1 overflow-auto px-4 pb-6 pt-5">
        <LessonListPanel
          level={level}
          currentOrder={currentOrder}
          lessons={lessons}
          nextLevelName={nextLevelName}
        />
      </div>
    </aside>
  );
}
