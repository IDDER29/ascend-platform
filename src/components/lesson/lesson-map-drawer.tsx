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
import { List, PanelLeftClose } from "lucide-react";
import type { LevelId } from "@/lib/content/schema";
import { LessonListPanel } from "@/components/lesson/lesson-list-panel";

type LessonRow = { slug: string; title: string; order: number };

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
  const open = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

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
    () => ({ open, toggle, close, level, currentOrder, lessons, nextLevelName }),
    [open, toggle, close, level, currentOrder, lessons, nextLevelName],
  );

  return (
    <LessonMapContext.Provider value={value}>{children}</LessonMapContext.Provider>
  );
}

/**
 * Closed: floating icon only.
 * Open: full-height left rail.
 * Open state lives in module memory — remounts no longer slide the rail out.
 */
export function LessonMapRail() {
  const { open, toggle, level, currentOrder, lessons, nextLevelName } = useLessonMap();

  if (!open) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-expanded={false}
        aria-controls="lesson-map-rail"
        title="Show lessons"
        className="absolute left-3 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-card-border bg-paper text-ink-secondary shadow-[var(--elevate-rest)] transition-colors hover:bg-xp-bg hover:text-xp-text dark:bg-elevated"
      >
        <List size={18} strokeWidth={2.2} />
      </button>
    );
  }

  return (
    <aside
      id="lesson-map-rail"
      className="sticky top-0 z-10 flex h-screen w-[288px] flex-none flex-col self-start border-r border-divider bg-bg"
    >
      <div className="flex flex-none items-center justify-end px-3 pt-4">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={true}
          aria-controls="lesson-map-rail"
          title="Hide lessons"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-xp-border bg-xp-bg text-xp-text transition-colors hover:bg-xp-bg"
        >
          <PanelLeftClose size={18} strokeWidth={2.2} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 pb-6 pt-2">
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
