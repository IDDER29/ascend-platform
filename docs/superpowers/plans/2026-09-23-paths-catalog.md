# Paths Catalog (`/paths`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a scaffolded `/paths` catalog page — Odin-shaped rhythm (thesis → Foundations → primary path), Phosphor feel, locked outcome copy — without retargeting landing or sidebar yet.

**Architecture:** Pure data module `catalog.ts` holds copy + level scopes + href helpers. Presentational `PathCard` renders one large catalog card. Server page under `(learner)` loads session continue state and composes header + Foundations + divider + primary path.

**Tech Stack:** Next.js App Router `(learner)` layout, existing `Button` / `PageHeader` / hub padding, Phosphor tokens, `getContinueLesson` / `getAllLessons`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-23-paths-catalog-design.md`
- Copy verbatim from spec (All paths / See the bit / Until the machine makes sense / divider)
- Phosphor: tokens only; no purple; no TOP green clone; no game-map / curriculum2 board
- Do **not** add Paths to sidebar; do **not** retarget landing Start CTAs
- Do **not** delete or redesign `/curriculum2` or `/curriculum`
- Repo has no unit test runner — verify with `npx eslint`, `npx tsc --noEmit`, `npm run build`, HTTP smoke
- Commit only when the user asks

---

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/paths/catalog.ts` | Path definitions, scopes, explore href resolution |
| `src/lib/routes.ts` | Add `PATHS_HREF = "/paths"` (constant only; unused by landing this pass) |
| `src/components/paths/path-card.tsx` | Shared Foundations / Path card UI |
| `src/app/(learner)/paths/page.tsx` | Server composition |

---

### Task 1: Catalog data + routes constant

**Files:**
- Create: `src/lib/paths/catalog.ts`
- Modify: `src/lib/routes.ts`

**Interfaces:**
- Produces:

```ts
export const FOUNDATIONS_LEVEL = "level-00-bits-logic" as const;
export const PRIMARY_PATH_LEVELS = [
  "level-01-machine-memory",
  "level-02-the-c-language",
  "level-03-systems-software",
] as const;

export type PathCardId = "foundations" | "primary";

export type PathCardDef = {
  id: PathCardId;
  eyebrow: string;
  meta: string;
  title: string;
  body: string;
  ctaLabel: "Explore";
};

export const PATH_CARDS: Record<PathCardId, PathCardDef>;

export function firstLessonHrefForLevel(levelId: string): string;
export function resolvePrimaryExploreHref(args: {
  continueHref: string | null;
  continueLevel: string | null;
}): string;
```

- [ ] **Step 1: Add `PATHS_HREF` to routes**

In `src/lib/routes.ts`, after `CURRICULUM_HREF`:

```ts
export const PATHS_HREF = "/paths";
```

- [ ] **Step 2: Create `src/lib/paths/catalog.ts`**

```ts
import { getAllLessons } from "@/lib/content/lessons";
import { FIRST_LESSON_HREF } from "@/lib/routes";
import type { LevelId } from "@/lib/content/schema";

export const FOUNDATIONS_LEVEL = "level-00-bits-logic" as const satisfies LevelId;

export const PRIMARY_PATH_LEVELS = [
  "level-01-machine-memory",
  "level-02-the-c-language",
  "level-03-systems-software",
] as const satisfies readonly LevelId[];

export type PathCardId = "foundations" | "primary";

export type PathCardDef = {
  id: PathCardId;
  eyebrow: string;
  meta: string;
  title: string;
  body: string;
  ctaLabel: "Explore";
};

export const PATH_CARDS: Record<PathCardId, PathCardDef> = {
  foundations: {
    id: "foundations",
    eyebrow: "Foundations",
    meta: "~5 lessons · where it begins",
    title: "See the bit",
    body: "Hands-on first principles — how a bit becomes a decision, and what you'll lean on before the deep path.",
    ctaLabel: "Explore",
  },
  primary: {
    id: "primary",
    eyebrow: "Path",
    meta: "~19 lessons · 1 capstone",
    title: "Until the machine makes sense",
    body: "The full ascent — how the machine runs, how code touches hardware, how the OS keeps it alive — through to Shellforge.",
    ctaLabel: "Explore",
  },
};

export function firstLessonHrefForLevel(levelId: string): string {
  const lessons = getAllLessons()
    .filter((l) => l.meta.level === levelId)
    .sort((a, b) => a.meta.order - b.meta.order);
  const first = lessons[0];
  if (!first) {
    return levelId === FOUNDATIONS_LEVEL
      ? FIRST_LESSON_HREF
      : FIRST_LESSON_HREF;
  }
  return `/curriculum/${first.meta.level}/${first.meta.slug}`;
}

export function foundationsExploreHref(): string {
  return firstLessonHrefForLevel(FOUNDATIONS_LEVEL);
}

export function resolvePrimaryExploreHref({
  continueHref,
  continueLevel,
}: {
  continueHref: string | null;
  continueLevel: string | null;
}): string {
  if (
    continueHref &&
    continueLevel &&
    (PRIMARY_PATH_LEVELS as readonly string[]).includes(continueLevel)
  ) {
    return continueHref;
  }
  return firstLessonHrefForLevel("level-01-machine-memory");
}
```

Use straight apostrophe `you'll` in body strings (match spec intent; avoid curly-quote encoding issues).

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit 2>&1 | head -40`  
Expected: no errors from new catalog file

---

### Task 2: PathCard component

**Files:**
- Create: `src/components/paths/path-card.tsx`

**Interfaces:**
- Consumes: `PathCardDef` fields (or inline props)
- Produces:

```tsx
export function PathCard(props: {
  eyebrow: string;
  meta: string;
  title: string;
  body: string;
  href: string;
  ctaLabel?: string;
  featured?: boolean; // primary path may use slightly stronger CTA
}): JSX.Element
```

- [ ] **Step 1: Create PathCard**

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function PathCard({
  eyebrow,
  meta,
  title,
  body,
  href,
  ctaLabel = "Explore",
  featured = false,
}: {
  eyebrow: string;
  meta: string;
  title: string;
  body: string;
  href: string;
  ctaLabel?: string;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-card-border bg-paper p-6 sm:p-8 dark:bg-elevated",
        featured && "sm:p-9",
      )}
    >
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-fainter">
            {eyebrow}
          </span>
          <span className="font-mono text-[11px] text-ink-fainter">{meta}</span>
        </div>
        <h2 className="font-display text-[26px] font-extrabold tracking-[-0.03em] text-ink sm:text-[30px]">
          {title}
        </h2>
        <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-ink-secondary">
          {body}
        </p>
      </div>
      <div>
        <Button
          href={href}
          variant={featured ? "primary" : "secondary"}
          size="md"
        >
          {ctaLabel}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Lint**

Run: `npx eslint src/components/paths/path-card.tsx`  
Expected: clean

---

### Task 3: `/paths` page

**Files:**
- Create: `src/app/(learner)/paths/page.tsx`

**Interfaces:**
- Consumes: `PATH_CARDS`, `foundationsExploreHref`, `resolvePrimaryExploreHref`, `PathCard`, `getCurrentUser`, `getContinueLesson`, `HUB_MAIN_CLASS`, `HUB_CONTENT_CLASS`

- [ ] **Step 1: Create the page**

```tsx
import { getCurrentUser } from "@/lib/auth/auth";
import { getContinueLesson } from "@/lib/progress/queries";
import {
  PATH_CARDS,
  foundationsExploreHref,
  resolvePrimaryExploreHref,
} from "@/lib/paths/catalog";
import { PathCard } from "@/components/paths/path-card";
import { HUB_CONTENT_CLASS, HUB_MAIN_CLASS } from "@/components/ui/page-header";

export const metadata = {
  title: "All paths — Ascend",
  description:
    "Start with foundations, then walk the ascent until the machine makes sense.",
  robots: { index: false },
};

export default async function PathsPage() {
  const user = await getCurrentUser();
  let continueHref: string | null = null;
  let continueLevel: string | null = null;

  if (user) {
    try {
      const cont = await getContinueLesson(user.id);
      continueHref = cont.href;
      continueLevel = cont.level;
    } catch {
      // open-path defaults
    }
  }

  const foundations = PATH_CARDS.foundations;
  const primary = PATH_CARDS.primary;

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <header className="mb-10 max-w-[640px]">
          <h1 className="font-display text-[32px] font-extrabold tracking-[-0.032em] text-ink sm:text-[36px]">
            All paths
          </h1>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-secondary">
            A clear way from bit to shell — start with foundations, then walk the
            ascent.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <PathCard
            eyebrow={foundations.eyebrow}
            meta={foundations.meta}
            title={foundations.title}
            body={foundations.body}
            href={foundationsExploreHref()}
            ctaLabel={foundations.ctaLabel}
          />

          <p className="pt-2 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-fainter">
            Then continue the ascent:
          </p>

          <PathCard
            eyebrow={primary.eyebrow}
            meta={primary.meta}
            title={primary.title}
            body={primary.body}
            href={resolvePrimaryExploreHref({ continueHref, continueLevel })}
            ctaLabel={primary.ctaLabel}
            featured
          />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Lint + typecheck**

```bash
npx eslint "src/app/(learner)/paths/**/*.{ts,tsx}" src/components/paths/ src/lib/paths/
npx tsc --noEmit 2>&1 | head -40
```

Expected: clean for new files

- [ ] **Step 3: Build**

Run: `npm run build`  
Expected: `/paths` appears in route list; build succeeds

- [ ] **Step 4: Manual / HTTP verification**

1. Open `/paths` — AppShell topbar + sidebar (normal, not force-collapsed)  
2. Copy matches spec (All paths, See the bit, Until the machine makes sense, divider)  
3. Foundations Explore → L00 first lesson; Path Explore → L01 first or continue  
4. Confirm sidebar has **no** Paths row; landing Start still → `/curriculum`  
5. Light + dark readable; no purple slab  

---

### Task 4: Polish only if verification fails

- Fix overflow (`min-w-0`), dark contrast, meta typography  
- Re-run eslint + build  

---

## Spec coverage (self-review)

| Spec item | Task |
|-----------|------|
| `/paths` under learner | 3 |
| Locked copy | 1 (catalog) + 3 (header/divider) |
| Foundations + primary + divider | 3 |
| Explore href rules | 1 |
| PathCard Phosphor chrome | 2 |
| `PATHS_HREF` constant | 1 |
| No nav/landing retarget | (non-action) |
| `robots: { index: false }` | 3 (sandbox until promoted) |

**Placeholder scan:** none.  
**Type consistency:** `PathCardId`, `PATH_CARDS`, `resolvePrimaryExploreHref` shared across tasks.
