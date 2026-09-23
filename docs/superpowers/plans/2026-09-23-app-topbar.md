# App Topbar Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the learner `AppTopbar` with Phosphor light/dark tokens, Curriculum · Paths · Community links, and the shared `ThemeToggle` — without touching the sidebar or adding notifications.

**Architecture:** Single-file change to `app-topbar.tsx`. Reuse existing `ThemeToggle` (`ascend-theme` / `html.dark`). Route constants from `@/lib/routes` for Curriculum and Paths; Community stays `/community`.

**Tech Stack:** Next.js client component, Lucide Search, existing Chip + ThemeToggle, Phosphor Tailwind tokens.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-23-app-topbar-design.md`
- **Top bar only** — do not modify sidebar
- No notification UI
- Remove separate Sign in text link; guest avatar still → sign-in
- Links: Curriculum, Paths, Community
- Reuse `@/components/homepage/theme-toggle` as-is
- Phosphor tokens only — no `#F3F1FA` / `#E2DDEF` / `bg-white/85` in the topbar
- Repo has no unit test runner — verify with eslint + HTTP/manual smoke
- Commit only when the user asks

---

## File map

| File | Responsibility |
|------|----------------|
| `src/components/ui/app-topbar.tsx` | Full topbar rewrite per spec |
| `src/components/homepage/theme-toggle.tsx` | Reuse only (no edit unless required) |

---

### Task 1: Rewrite `AppTopbar`

**Files:**
- Modify: `src/components/ui/app-topbar.tsx`

**Interfaces:**
- Consumes: `ThemeToggle`, `Chip`, `useAuthUser`, `CURRICULUM_HREF`, `PATHS_HREF`, `SIGNIN_HREF`
- Produces: unchanged `AppTopbar({ streakDays?: number | null })`

- [ ] **Step 1: Replace `app-topbar.tsx` with the following**

```tsx
"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Chip } from "./chip";
import { ThemeToggle } from "@/components/homepage/theme-toggle";
import { useAuthUser } from "@/lib/auth/context";
import { CURRICULUM_HREF, PATHS_HREF, SIGNIN_HREF } from "@/lib/routes";

const NAV = [
  { href: CURRICULUM_HREF, label: "Curriculum" },
  { href: PATHS_HREF, label: "Paths" },
  { href: "/community", label: "Community" },
] as const;

/**
 * Learner top chrome: search + quiet links + theme + identity.
 * No notification theater. Sidebar owns primary nav.
 */
export function AppTopbar({ streakDays = null }: { streakDays?: number | null }) {
  const user = useAuthUser();
  const signedIn = Boolean(user);
  const initial = (user?.name?.trim() || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-2.5 border-b border-divider bg-bg/85 px-4 backdrop-blur-[14px] backdrop-saturate-[1.4] sm:gap-4 sm:px-8">
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("ascend:open-palette"))}
        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-card-border bg-elevated px-3.5 py-2.5 text-left text-ink-faint sm:max-w-[460px]"
      >
        <Search size={16} strokeWidth={2.2} />
        <span className="min-w-0 flex-1 truncate text-sm">Search lessons…</span>
        <span className="hidden rounded-md border border-card-border px-1.5 py-0.5 font-mono text-[11px] text-ink-fainter sm:inline">
          ⌘K
        </span>
      </button>
      <div className="ml-auto flex flex-none items-center gap-1.5 sm:gap-2.5">
        {signedIn && streakDays != null && streakDays > 0 ? (
          <Chip variant="streak" className="hidden sm:inline-flex">
            <span className="animate-flame inline-block h-[15px] w-3 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-[#FFCE4A] to-[#FF6B4A]" />
            {streakDays}
          </Chip>
        ) : null}
        <nav
          aria-label="Top"
          className="hidden items-center gap-3 sm:flex sm:gap-3.5"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13.5px] font-bold text-ink-secondary transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
        <Link
          href={signedIn ? "/profile" : SIGNIN_HREF}
          className="flex h-[39px] w-[39px] flex-none items-center justify-center rounded-xl bg-brand-gradient font-display font-extrabold text-white shadow-glow"
          title={signedIn ? "Profile" : "Sign in"}
        >
          {signedIn ? initial : "?"}
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Lint**

Run: `npx eslint src/components/ui/app-topbar.tsx`
Expected: no errors

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0 (or no new errors from this file)

- [ ] **Step 4: Commit (only if user asked)**

```bash
git add src/components/ui/app-topbar.tsx
git commit -m "$(cat <<'EOF'
feat: polish AppTopbar with Phosphor tokens, links, and theme toggle

EOF
)"
```

---

### Task 2: Smoke verification

**Files:** none (verify only)

- [ ] **Step 1: HTTP / browser smoke on `/dashboard`**

With dev server on `http://localhost:3000`:

| Check | Expect |
|-------|--------|
| Light mode | Header uses theme bg (not flat white wash); search uses elevated surface |
| Dark mode | Toggle flips `html.dark`; topbar remains readable |
| Links | Curriculum → `/curriculum`, Paths → `/paths`, Community → `/community` |
| Guest | No “Sign in” text link; avatar → sign-in |
| Narrow viewport | Text links hidden; search + theme + avatar remain |
| Sidebar | Unchanged |

- [ ] **Step 2: Final eslint**

Run: `npx eslint src/components/ui/app-topbar.tsx`
Expected: clean

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Phosphor tokens / light+dark | Task 1 |
| Curriculum · Paths · Community | Task 1 |
| ThemeToggle | Task 1 |
| Drop Sign in text link | Task 1 |
| No sidebar / notifications | Task 1 (by omission) |
| Smoke light/dark + links | Task 2 |
