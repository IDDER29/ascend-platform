# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Ascend is a learning platform for how computers really work (bits → CPU → C → systems), built with Next.js 16 (App Router), React 19, Tailwind v4, Drizzle and MDX. Trust the code over `README.md` where they disagree.

## Commands

```bash
npm run dev                      # http://localhost:3000 (also rewrites the Next.js block in AGENTS.md)
npm run build                    # next build --webpack
npm run lint                     # eslint; 2 warnings are pre-existing — don't count those as yours
npx tsc --noEmit                 # type-check; ignore errors reported under .next/
npx tsx --test $(git ls-files 'src/**/*.test.ts')   # all tests (node:test via tsx; @/ paths resolve)
npx tsx --test src/lib/practice/sm2.test.ts          # one test file (add new untracked test files explicitly)
npm run db:generate              # Postgres migrations (drizzle.config.pg.ts) — only when changing schema.pg.ts
```

There is no `npm test` script and no Prettier config. Many existing files mix two formatting styles, so running Prettier on a whole existing file reflows unrelated lines — edit by hand there. New files in the Coach-era code are formatted with `npx prettier --print-width 120`.

## Architecture

**Routes.** `src/app/(learner)/layout.tsx` wraps every app screen (dashboard, paths, lessons, practice, progress, profile, achievements, bookmarks, settings, projects, `/u/[username]`) in `AppShell` (sidebar + footer, no top bar) and is the only place that reads the session — that keeps the homepage and marketing pages static. Lessons live at `/lessons/[publicSlug]`; `src/lib/paths/lesson-urls.ts` maps `level/slug` ↔ public slug (server-only: it reads the lesson files), and old `/curriculum/[level]/[slug]` URLs redirect there.

**Public site.** Home, `/catalog` (+ `/catalog/[path]`, the public paths catalog, separate from the in-app `/paths`), `/how-it-works`, `/about`, `/open-source`, `/faq`, `/privacy`, `/terms`, `/signin`, `/reset/*` and the 404 sit outside `(learner)` in `SiteShell` (`src/components/site/`), so they stay static; their numbers come from the lesson files and card bank (`src/lib/site/site-data.ts`). Sign-up goes to `/onboarding` (pick a path and the daily goal). Account actions (change password, reset progress, delete account) live in `src/lib/auth/account-actions.ts`.

**Page versions.** Redesigns are built beside the original at `/<page>v2`, then promoted: v2 moves to `/<page>` and `next.config.ts` redirects `/<page>v2` → `/<page>`. The v1 pages kept during the Coach redesigns were removed before launch (their URLs redirect to today's pages); `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` records each page's goal, user stories and decisions.

**Content.** Lessons are `content/curriculum/<level-id>/<slug>.mdx`: Zod-validated frontmatter (`src/lib/content/schema.ts`) plus an MDX body rendered by `next-mdx-remote/rsc` with components from `src/lib/mdx-components.tsx`. MDX gotchas (see README): `prop={expr}` attributes arrive empty — pass JSON strings (`linesJson='[...]'`) or boolean shorthand; a literal `<` in prose breaks parsing — keep entities escaped and decode inside the component (`src/lib/content/entities.ts`).

**Topics, not levels.** Internal ids stay `level-00-bits-logic` … `level-03-systems-software` (saved progress keys on them), but nothing user-facing says "level": groups are *topics* by name (`LEVELS[id].name`). Paths (`src/lib/paths/catalog.ts`) group topics into roles (Foundations; Systems Programmer + ShellForge capstone; others "soon"), with named sections from `course-outlines.ts` / `foundations-outline.ts`. Joined paths are an httpOnly cookie (`selected-path.ts`).

**Data layer.** `src/lib/db/client.ts` uses Postgres when `DATABASE_URL` is set, otherwise a local SQLite file (`local.db`) created on first use. Three files must stay in step: `schema.pg.ts`, `schema.sqlite.ts`, and `sqlite-ddl.ts` (`CREATE TABLE IF NOT EXISTS`). Auth is bcrypt + a signed JWT cookie (`src/lib/auth`). The current phase is frontend-first: several features keep state only in the browser (bookmarks, answer times, guest Practice), and some tables are unused — see the memory/prelaunch notes before wiring the database.

**The model / loader / live split** (used by Practice, Progress, Profile, Achievements, Bookmarks, Dashboard, Paths):
- `src/lib/<area>/*-model.ts` — pure, client-safe functions from records to view data, each with a `*.test.ts` beside it. Put logic here.
- `src/lib/<area>/server-page-data.ts` (or `*-data.ts`) — `import "server-only"` loaders that read the DB/lesson files and build model input. Guests may get a sample learner (`SHOW_SAMPLE_PROFILE_TO_GUESTS` in `src/lib/profile/sample-profile.ts`); the dashboard deliberately doesn't.
- `*-live.tsx` / client components — merge server data with browser storage (`mergeSessionHistory(readLocalHistory(userId), initialHistory)`, `syncLocalCards`) inside `useEffect` + `queueMicrotask` (the lint rule forbids synchronous setState in effects); per-browser stores use `useSyncExternalStore` over localStorage (`src/lib/bookmarks/use-bookmarks.ts`).

**Practice and memory.** Scheduling is SM-2 (`src/lib/practice/sm2.ts`; the UI grades only Again/Good). Cards come from `PRACTICE_BANK` (`src/lib/practice/bank/`) and unlock as lessons are completed; Practice URLs go through `src/lib/practice/routes.ts`. Recall is *estimated* with FSRS's power-law curve: `memory-curve.ts` (deck), `card-memory.ts` (one card's sawtooth, replayed from history), `deck-memory.ts` (`setMemory` for any subset), `shaky.ts` (right but slow or just-recovered, using answer times). Reasoning and open ideas: `docs/learning-science/spaced-repetition.md` — read and update it when touching Practice or memory.

**Goal and streak.** One daily goal (`GOAL_PLANS` in `src/lib/practice/daily-goal.ts`: Casual/Regular/Serious) set in onboarding or Settings, driving the dashboard's Today checklist (`src/lib/dashboard/day-plan.ts`). One streak, counting days with a finished lesson only (`src/lib/progress/streak.ts`); the old dashboard, lesson footer and `/streak-lost` still read the `streaks` table.

**Achievements** are computed from records, never stored: badges each have their own rule in `src/lib/achievements/catalog.ts`; ninja titles come from counts of ranked tasks (D–S grade tasks, never badges); clan crests per topic. Original art only.

## Design

Two layers, both in `src/app/globals.css`:
- **Phosphor** (base theme; rules in AGENTS.md and `.cursor/rules/`): no purple (`--brand-violet` is a legacy name for green), tokens instead of hex, light and dark both correct.
- **Coach** — the look of every rebuilt page: wrap the page in `practice-coach-v2` and use `--coach-*` tokens (`--coach-hero-bg` dark cards with `--coach-lime` buttons, `--coach-surface` cards with 2px `--coach-border`). Chart series colours are `--coach-chart-kept` / `--coach-chart-stopped` (validated for colour-blind contrast in both modes).

Learner chrome (`.cursor/rules/app-shell-chrome.mdc`): no top bar, no fake search, theme toggle in the sidebar, `PlaceholderAvatar` for faces. The sidebar (desktop) and the bottom tab bar + "More" sheet (phones, `mobile-tab-bar.tsx`) share one nav model, `src/lib/nav/app-nav.ts`; Practice shows a due-card badge read from this browser's deck.
