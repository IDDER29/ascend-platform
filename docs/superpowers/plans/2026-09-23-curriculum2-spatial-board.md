# Curriculum2 Spatial Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a URL-only sandbox at `/curriculum2` — intro strip + focused-regions spatial board — without changing production `/curriculum`.

**Architecture:** Server page loads real lesson/progress data; client `PathBoard` owns focus state; `IntroStrip` is presentational. AppSidebar treats `/curriculum2` as force-collapsed for this route only. Lesson links reuse existing `/curriculum/[level]/[slug]` pages.

**Tech Stack:** Next.js App Router `(learner)` layout, React client components, Phosphor tokens in `globals.css`, existing `Button`, progress queries.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-23-curriculum2-spatial-board-design.md`
- Phosphor: no purple hero slabs; no new brand hex in components; use `bg-bg` / `bg-paper` / `bg-elevated` / `text-ink*` / `bg-level-00`…`03` / `bg-brand-gradient`
- Do **not** rewrite `src/app/(learner)/curriculum/page.tsx` or `curriculum-levels-panel.tsx`
- Do **not** add Curriculum2 to sidebar nav
- No pan/zoom engine; no lesson locks; no new progress DB
- Repo has no unit test runner — verify with `npx eslint`, `npx tsc --noEmit`, `npm run build`, and manual browser checks
- Commit only when the user asks (or at the end of a task if they already said to commit as you go)

---

## File map

| File | Responsibility |
|------|----------------|
| `src/components/ui/sidebar.tsx` | Force-collapsed while pathname starts with `/curriculum2` |
| `src/components/curriculum2/types.ts` | Shared board/strip prop types |
| `src/components/curriculum2/intro-strip.tsx` | Title, context, Continue CTA, compact meta |
| `src/components/curriculum2/level-region.tsx` | One level region + lesson nodes |
| `src/components/curriculum2/path-board.tsx` | Survey/focus board (client) |
| `src/app/(learner)/curriculum2/page.tsx` | Server data + composition |
| `src/app/(learner)/curriculum2/layout.tsx` | Optional thin segment layout (metadata / full-height main) |
| `src/app/globals.css` | Optional `@keyframes` for “you are here” breathe if none fit |

---

### Task 1: Force-collapsed sidebar on `/curriculum2`

**Files:**
- Modify: `src/components/ui/sidebar.tsx`

**Interfaces:**
- Consumes: `usePathname()`, existing `STORAGE_KEY` / `useSyncExternalStore` collapse store
- Produces: When `pathname.startsWith("/curriculum2")`, sidebar renders collapsed; toggle disabled with explanatory title so it doesn’t fight route force

- [ ] **Step 1: Update collapse logic in `AppSidebar`**

Replace the collapsed derivation and toggle button so route force wins:

```tsx
const pathname = usePathname();
const forceCollapsedByRoute = Boolean(pathname?.startsWith("/curriculum2"));

const storedCollapsed = useSyncExternalStore(
  subscribeCollapsed,
  readCollapsed,
  () => false,
);

const collapsed = forceCollapsedByRoute || storedCollapsed;

function toggle() {
  if (forceCollapsedByRoute) return; // map view owns chrome width
  const next = !collapsed;
  window.localStorage.setItem(STORAGE_KEY, String(next));
  notifyCollapsedChange();
}
```

Update the toggle button:

```tsx
<button
  type="button"
  onClick={toggle}
  disabled={forceCollapsedByRoute}
  title={
    forceCollapsedByRoute
      ? "Sidebar stays collapsed on the map view"
      : collapsed
        ? "Expand sidebar"
        : "Collapse sidebar"
  }
  className={cn(
    "absolute -right-3 top-[22px] flex h-6 w-6 flex-none items-center justify-center rounded-full border border-divider bg-white text-ink-faint shadow-[0_2px_6px_rgba(28,18,64,.08)] transition-colors hover:text-ink-secondary",
    forceCollapsedByRoute && "cursor-not-allowed opacity-50",
  )}
>
```

Keep the rest of `AppSidebar` unchanged. Note: aside still uses `bg-white` today — do not Phosphor-rewrite the whole sidebar in this task.

- [ ] **Step 2: Verify TypeScript for sidebar**

Run: `npx tsc --noEmit 2>&1 | head -40`  
Expected: no new errors from `sidebar.tsx`

- [ ] **Step 3: Manual chrome check (after Task 4 exists)**

Deferred until `/curriculum2` page exists — sidebar should open collapsed on that URL; `/curriculum` still respects localStorage.

---

### Task 2: Shared types + IntroStrip

**Files:**
- Create: `src/components/curriculum2/types.ts`
- Create: `src/components/curriculum2/intro-strip.tsx`

**Interfaces:**
- Produces:

```ts
// types.ts
export type Curriculum2LessonNode = {
  level: string;
  slug: string;
  title: string;
  order: number;
  timeMin: number;
};

export type Curriculum2LevelRegion = {
  id: string; // LevelId
  name: string;
  short: string;
  timeLabel: string;
  totalConcepts: number;
  done: number;
  accentClass: string; // e.g. "bg-level-00"
  lessons: Curriculum2LessonNode[];
};

export type Curriculum2IntroProps = {
  continueHref: string;
  continueTitle: string;
  contextLine: string;
  ctaLabel: "Continue" | "Start";
  pathPct: number | null; // null when signed out
  streakCurrent: number | null; // null when signed out or 0
};
```

- [ ] **Step 1: Create `types.ts`** with the types above (exact names).

- [ ] **Step 2: Create `IntroStrip`**

```tsx
// src/components/curriculum2/intro-strip.tsx
import { Button } from "@/components/ui/button";
import type { Curriculum2IntroProps } from "./types";

export function IntroStrip({
  continueHref,
  continueTitle,
  contextLine,
  ctaLabel,
  pathPct,
  streakCurrent,
}: Curriculum2IntroProps) {
  const metaParts: string[] = [];
  if (pathPct !== null) metaParts.push(`${pathPct}% of path`);
  if (streakCurrent !== null && streakCurrent > 0) {
    metaParts.push(`${streakCurrent} day streak`);
  }

  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.032em] text-ink sm:text-[32px]">
          The path to the machine
        </h1>
        <p className="mt-1.5 max-w-[560px] text-[15px] leading-relaxed text-ink-secondary">
          {contextLine}
        </p>
        {metaParts.length > 0 ? (
          <p className="mt-2 font-mono text-[11px] tracking-wide text-ink-fainter">
            {metaParts.join(" · ")}
          </p>
        ) : null}
      </div>
      <div className="flex w-full flex-col items-stretch gap-1 sm:w-auto sm:items-end">
        <Button href={continueHref} variant="primary" size="md" className="w-full sm:w-auto">
          {ctaLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
        <span className="truncate text-center text-[12px] text-ink-fainter sm:text-right">
          {continueTitle}
        </span>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Lint the new files**

Run: `npx eslint src/components/curriculum2/types.ts src/components/curriculum2/intro-strip.tsx`  
Expected: clean (or only pre-existing unrelated warnings)

---

### Task 3: LevelRegion + PathBoard (focused regions)

**Files:**
- Create: `src/components/curriculum2/level-region.tsx`
- Create: `src/components/curriculum2/path-board.tsx`
- Modify (only if needed): `src/app/globals.css` — add `.animate-here-breathe` using a small keyframe

**Interfaces:**
- Consumes: `Curriculum2LevelRegion`, `Curriculum2LessonNode` from `./types`
- Produces: `PathBoard` props:

```ts
type PathBoardProps = {
  regions: Curriculum2LevelRegion[];
  currentLevel: string;
  currentOrder: number;
};
```

- [ ] **Step 1: Create `LevelRegion`**

```tsx
// src/components/curriculum2/level-region.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Curriculum2LevelRegion } from "./types";

export function LevelRegion({
  region,
  focused,
  dimmed,
  isCurrentLevel,
  currentOrder,
  onFocus,
}: {
  region: Curriculum2LevelRegion;
  focused: boolean;
  dimmed: boolean;
  isCurrentLevel: boolean;
  currentOrder: number;
  onFocus: () => void;
}) {
  const indexLabel = region.id.replace("level-", "").slice(0, 2); // "00", "01", …

  return (
    <section
      className={cn(
        "min-w-0 rounded-2xl border border-card-border bg-paper/80 p-4 transition-all duration-300 ease-out dark:bg-elevated/80",
        focused && "z-10 scale-[1.02] shadow-[0_12px_32px_rgba(15,26,20,0.12)]",
        dimmed && "scale-[0.98] opacity-45",
        !focused && !dimmed && "hover:border-xp-border",
      )}
    >
      <button
        type="button"
        onClick={onFocus}
        className="flex w-full items-start gap-3 text-left"
        aria-expanded={focused}
      >
        <span
          className={cn(
            "flex h-10 w-10 flex-none items-center justify-center rounded-xl font-mono text-sm font-bold text-white",
            region.accentClass,
          )}
        >
          {indexLabel}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-display text-base font-extrabold text-ink">{region.name}</div>
          <div className="mt-0.5 text-[12.5px] text-ink-fainter">
            {region.short} · {region.done}/{region.lessons.length} · {region.timeLabel}
          </div>
        </div>
        {isCurrentLevel && !focused ? (
          <span className="animate-here-breathe mt-1 h-2.5 w-2.5 flex-none rounded-full bg-brand-gradient" aria-label="You are here" />
        ) : null}
      </button>

      {focused ? (
        <ul className="mt-4 flex flex-col gap-1 border-t border-divider pt-3">
          {region.lessons.map((lesson) => {
            const here =
              isCurrentLevel && lesson.order === currentOrder;
            return (
              <li key={lesson.slug}>
                <Link
                  href={`/curriculum/${lesson.level}/${lesson.slug}`}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13.5px] transition-colors hover:bg-xp-bg",
                    here && "bg-xp-bg font-bold text-xp-text",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 flex-none items-center justify-center rounded-lg font-mono text-[11px]",
                      here
                        ? "animate-here-breathe bg-brand-gradient text-white"
                        : "bg-elevated text-ink-faint",
                    )}
                  >
                    {String(lesson.order).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-ink">{lesson.title}</span>
                  <span className="font-mono text-[11px] text-ink-fainter">{lesson.timeMin}m</span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 2: Add breathe animation in `globals.css`** (near other `@keyframes`)

```css
@keyframes here-breathe {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.08);
  }
}

.animate-here-breathe {
  animation: here-breathe 2.4s ease-in-out infinite;
}
```

- [ ] **Step 3: Create `PathBoard`**

```tsx
// src/components/curriculum2/path-board.tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { LevelRegion } from "./level-region";
import type { Curriculum2LevelRegion } from "./types";

export function PathBoard({
  regions,
  currentLevel,
  currentOrder,
}: {
  regions: Curriculum2LevelRegion[];
  currentLevel: string;
  currentOrder: number;
}) {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFocusedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-[min(70vh,720px)] flex-1">
      {/* soft spine */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-divider to-transparent lg:block"
      />

      <div
        className={cn(
          "relative grid gap-4",
          "grid-cols-1 sm:grid-cols-2",
          focusedId ? "lg:grid-cols-1 lg:max-w-xl lg:mx-auto" : "lg:grid-cols-2",
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) setFocusedId(null);
        }}
      >
        {regions.map((region) => {
          const focused = focusedId === region.id;
          const dimmed = focusedId !== null && !focused;
          return (
            <LevelRegion
              key={region.id}
              region={region}
              focused={focused}
              dimmed={dimmed}
              isCurrentLevel={region.id === currentLevel}
              currentOrder={currentOrder}
              onFocus={() =>
                setFocusedId((prev) => (prev === region.id ? null : region.id))
              }
            />
          );
        })}
      </div>

      {focusedId ? (
        <button
          type="button"
          onClick={() => setFocusedId(null)}
          className="mt-4 text-[13px] font-medium text-ink-fainter hover:text-ink-secondary"
        >
          Back to full path
        </button>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Lint board components**

Run: `npx eslint src/components/curriculum2/`  
Expected: clean

---

### Task 4: `/curriculum2` page + layout

**Files:**
- Create: `src/app/(learner)/curriculum2/page.tsx`
- Create: `src/app/(learner)/curriculum2/layout.tsx`

**Interfaces:**
- Consumes: `IntroStrip`, `PathBoard`, progress queries, `getAllLessons`, `LEVELS`, `levelIds`
- Produces: Route `/curriculum2` rendering under existing `(learner)` AppShell

- [ ] **Step 1: Create layout** (full-height main padding, no PageHeader contract — experiment owns chrome)

```tsx
// src/app/(learner)/curriculum2/layout.tsx
export default function Curriculum2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-10 sm:py-8">
      <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create page** — mirror data loading from `curriculum/page.tsx`, shape props for strip + board

```tsx
// src/app/(learner)/curriculum2/page.tsx
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getContinueLesson,
  countCompletedInLevel,
  getStreak,
  listCompletedLessons,
} from "@/lib/progress/queries";
import { IntroStrip } from "@/components/curriculum2/intro-strip";
import { PathBoard } from "@/components/curriculum2/path-board";
import type { Curriculum2LevelRegion } from "@/components/curriculum2/types";

export const metadata = {
  title: "Curriculum map (experiment) — Ascend",
  description: "Experimental spatial map of the Ascend curriculum.",
};

const FALLBACK_LEVEL: LevelId = "level-00-bits-logic";
const FALLBACK_ORDER = 1;

const LEVEL_ACCENT: Record<string, string> = {
  "level-00-bits-logic": "bg-level-00",
  "level-01-machine-memory": "bg-level-01",
  "level-02-the-c-language": "bg-level-02",
  "level-03-systems-software": "bg-level-03",
};

export default async function Curriculum2Page() {
  const user = await getCurrentUser();
  const lessons = getAllLessons();

  let currentLevel: LevelId = FALLBACK_LEVEL;
  let currentOrder = FALLBACK_ORDER;
  let continueHref = lessons[0]
    ? `/curriculum/${lessons[0].meta.level}/${lessons[0].meta.slug}`
    : "/curriculum";
  let continueTitle = lessons[0]?.meta.title ?? "Start the path";
  let levelDone: Record<string, number> = Object.fromEntries(
    levelIds.map((id) => [id, 0]),
  );
  let totalCompleted = 0;
  let streakCurrent = 0;

  if (user) {
    try {
      const cont = await getContinueLesson(user.id);
      currentLevel = cont.level as LevelId;
      currentOrder = cont.order;
      continueHref = cont.href;
      continueTitle = cont.title;
      const [doneCounts, completed, streak] = await Promise.all([
        Promise.all(
          levelIds.map(
            async (id) => [id, await countCompletedInLevel(user.id, id)] as const,
          ),
        ),
        listCompletedLessons(user.id),
        getStreak(user.id),
      ]);
      levelDone = Object.fromEntries(doneCounts);
      totalCompleted = completed.length;
      streakCurrent = streak?.current ?? 0;
    } catch {
      // db unavailable — open-path defaults
    }
  }

  const pathPct = lessons.length
    ? Math.round((totalCompleted / lessons.length) * 100)
    : 0;

  const levelMeta = LEVELS[currentLevel];
  const contextLine = user
    ? `${levelMeta.name} · concept ${currentOrder} of ${levelMeta.totalConcepts}`
    : "The full path is open. Sign in to save completed lessons and pick up where you left off.";

  const regions: Curriculum2LevelRegion[] = levelIds.map((id) => ({
    id,
    name: LEVELS[id].name,
    short: LEVELS[id].short,
    timeLabel: LEVELS[id].timeLabel,
    totalConcepts: LEVELS[id].totalConcepts,
    done: levelDone[id] ?? 0,
    accentClass: LEVEL_ACCENT[id],
    lessons: lessons
      .filter((l) => l.meta.level === id)
      .map((l) => ({
        level: l.meta.level,
        slug: l.meta.slug,
        title: l.meta.title,
        order: l.meta.order,
        timeMin: l.meta.timeMin,
      })),
  }));

  return (
    <>
      <IntroStrip
        continueHref={continueHref}
        continueTitle={continueTitle}
        contextLine={contextLine}
        ctaLabel={user ? "Continue" : "Start"}
        pathPct={user ? pathPct : null}
        streakCurrent={user ? streakCurrent : null}
      />
      <PathBoard
        regions={regions}
        currentLevel={currentLevel}
        currentOrder={currentOrder}
      />
    </>
  );
}
```

- [ ] **Step 3: Typecheck + lint route**

Run:

```bash
npx eslint "src/app/(learner)/curriculum2/**/*.{ts,tsx}" src/components/curriculum2/
npx tsc --noEmit 2>&1 | head -50
```

Expected: clean for new files

- [ ] **Step 4: Build**

Run: `npm run build`  
Expected: `/curriculum2` in route list; build succeeds

- [ ] **Step 5: Manual verification checklist**

1. Open `/curriculum2` — topbar present, sidebar collapsed, toggle disabled
2. Four regions visible; click one → lessons expand; Escape / “Back to full path” → survey
3. Lesson link opens real lesson under `/curriculum/...`
4. Continue/Start hits correct lesson; signed-out shows Start + honesty line; signed-in shows meta text (not cards)
5. Light + dark: no purple slab; regions readable
6. `/curriculum` unchanged

---

### Task 5: Polish pass (only if checklist fails)

**Files:** touch only what failed — likely `level-region.tsx`, `path-board.tsx`, `intro-strip.tsx`, or token classes

- [ ] Fix any overflow (`min-w-0` on flex children)
- [ ] Fix dark mode contrast on `bg-paper/80` / borders
- [ ] Re-run build + re-check light/dark

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Route `/curriculum2` under `(learner)` | 4 |
| Intro strip + Continue | 2, 4 |
| Spatial focused regions | 3 |
| Sidebar forced collapsed + topbar on | 1 (topbar via existing learner layout) |
| Real progress data, no fixtures | 4 |
| No sidebar nav entry | (explicit non-action) |
| Phosphor / no purple | 2–4 classes |
| Motion: focus, breathe, CTA hover | 3 (focus + breathe); Button already has hover |
| Mobile stack | 3 grid `grid-cols-1` |
| Production `/curriculum` untouched | (explicit non-action) |

**Placeholder scan:** none intentional.  
**Type consistency:** `Curriculum2LevelRegion` / `Curriculum2IntroProps` names shared across Tasks 2–4.
