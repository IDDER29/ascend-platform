# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Ascend is a learning platform for how computers really work (bits → CPU → C → systems), built with Next.js 16 (App Router), React 19, Tailwind v4, Drizzle and MDX. Trust the code over `README.md` where they disagree.

## Commands

```bash
npm run dev                      # http://localhost:3000 (also rewrites the Next.js block in AGENTS.md)
npm run build                    # next build --webpack
npm run lint                     # eslint; clean — keep it at zero warnings
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

**The tiny CPU.** Foundations teaches one machine in two versions. Version 1 is Ben Eater's 8-bit instruction set, simulated in `src/lib/tiny-cpu/machine.ts` (tested) and shown in lessons with `<TinyCpu caption='…' programJson='["LDA 14","ADD 15","OUT","HLT"]' dataJson='{"14":28}' />`. Use it for any lesson or project about instructions, memory or execution in Build a CPU. From Assembly Language on, lessons use **version 2** (the blueprint's FS-8: 256 bytes, R0–R3, a stack, CALL/RET, IN/OUT), simulated in `src/lib/tiny-cpu/v2.ts` (golden-tested) and shown with `<TinyCpu2 programJson='["loop: DEC R0","JNZ loop","HALT"]' />`; see `docs/superpowers/specs/2026-11-01-tiny-cpu-v2-design.md`. The curriculum plan is in `docs/superpowers/specs/2026-10-31-foundations-curriculum-design.md`, and where every concept lives is in `docs/curriculum/registry.md`.

**Lesson tools.** Hands-on MDX components, each over a tested pure model: `<ByteLab>` (`src/lib/byte-lab`), `<ChannelLab>` (`src/lib/channel`: a noisy two-state line, threshold, parity and repetition codes), `<GateLab>` and `<ClockLab>` (`src/lib/gate-lab`: gate expressions, clocked `REG := expr` registers, chained slices, gate budgets and longest path), `<MemoryBoard>` (`src/lib/memory-board`), `<DatapathLab>` and `<ControlLab>` (`src/lib/datapath`: Ben Eater's control signals tick by tick, and a microcode table run as the control unit, tested to match the tiny CPU simulator), `<TinyCpu>` and `<TinyCpu2>` (`src/lib/tiny-cpu`), `<AssemblerLab>`, `<TranslatorLab>` and `<EndToEnd>` (`src/lib/translator`: the tiny language compiled to tiny CPU v2 assembly), `<SyscallLab>` (`src/lib/syscall`: a teaching model of system calls across the user/kernel boundary), and `<CompilerOutput>` (a server component showing real gcc evidence from `content/evidence/`). Props are JSON strings. Before shipping a lesson, run every tool tag in it through its engine (it must parse, and a lab must not start out solved).

**Topics, not levels.** Internal ids stay `level-00-bits-logic` … `level-03-systems-software` (saved progress keys on them), but nothing user-facing says "level": groups are *topics* by name (`LEVELS[id].name`). Paths (`src/lib/paths/catalog.ts`) group topics into roles (Foundations; Systems Programmer + ShellForge capstone; others "soon"), with named sections from `course-outlines.ts` / `foundations-outline.ts`. Joined paths are an httpOnly cookie (`selected-path.ts`).

**The track.** Paths form one track: Foundations (stage 1) → Systems Programmer (2) → Computer Architect (3), each with a `milestone`; side paths set `branchOf`. Courses not written yet are outline-only (`outline` from `src/lib/paths/planned-outlines.ts`) and show every planned lesson as "Coming soon"; live topics list theirs as `upcoming` in `course-outlines.ts`. When an outlined course gets its first lesson, give it a topic id in `schema.ts` and `lesson-urls.ts` and move its outline to `course-outlines.ts`. Plan: `docs/superpowers/specs/2026-11-01-foundations-track-design.md`; what to write next: `docs/curriculum/registry.md`. Every outline item (live or coming soon, in any path) has a one-sentence `description` shown under its title; `outline-descriptions.test.ts` enforces it. Foundations is eight courses mapped from the blueprint in `docs/curriculum/sugestion/` (each item's `covers` lists its F001–F106 ids); a live Foundations lesson that changes section goes in `FOUNDATIONS_MOVED` so its old URL redirects.

**Data layer.** Production is Postgres on Neon (Vercel); `src/lib/db/client.ts` uses it when `DATABASE_URL` is set, and only outside production falls back to a local SQLite file (`local.db`, created and upgraded on first use: new columns go in `SQLITE_ADDED_COLUMNS`). Deploying, migrations and required env vars: `docs/deploy.md`. Auth hardening lives in `src/lib/auth` (rate limits, reset tokens, session revocation on password change); bookmarks sync to the `bookmarks` table when signed in (`src/components/bookmarks/bookmarks-sync.tsx`). Three files must stay in step: `schema.pg.ts`, `schema.sqlite.ts`, and `sqlite-ddl.ts` (`CREATE TABLE IF NOT EXISTS`). Auth is bcrypt + a signed JWT cookie (`src/lib/auth`). The current phase is frontend-first: several features keep state only in the browser (bookmarks, answer times, guest Practice), and some tables are unused — see the memory/prelaunch notes before wiring the database.

**The model / loader / live split** (used by Practice, Progress, Profile, Achievements, Bookmarks, Dashboard, Paths):
- `src/lib/<area>/*-model.ts` — pure, client-safe functions from records to view data, each with a `*.test.ts` beside it. Put logic here.
- `src/lib/<area>/server-page-data.ts` (or `*-data.ts`) — `import "server-only"` loaders that read the DB/lesson files and build model input. Guests never get sample data: account-only pages show `GuestPrompt` (`src/components/ui/guest-prompt.tsx`).
- `*-live.tsx` / client components — merge server data with browser storage (`mergeSessionHistory(readLocalHistory(userId), initialHistory)`, `syncLocalCards`) inside `useEffect` + `queueMicrotask` (the lint rule forbids synchronous setState in effects); per-browser stores use `useSyncExternalStore` over localStorage (`src/lib/bookmarks/use-bookmarks.ts`).

**Practice and memory.** Scheduling is SM-2 (`src/lib/practice/sm2.ts`; the UI grades only Again/Good). Cards come from `PRACTICE_BANK` (`src/lib/practice/bank/`) and unlock as lessons are completed; Practice URLs go through `src/lib/practice/routes.ts`. Recall is *estimated* with FSRS's power-law curve: `memory-curve.ts` (deck), `card-memory.ts` (one card's sawtooth, replayed from history), `deck-memory.ts` (`setMemory` for any subset), `shaky.ts` (right but slow or just-recovered, using answer times). Reasoning and open ideas: `docs/learning-science/spaced-repetition.md` — read and update it when touching Practice or memory.

**Goal and streak.** One daily goal (`GOAL_PLANS` in `src/lib/practice/daily-goal.ts`: Casual/Regular/Serious) set in onboarding or Settings, driving the dashboard's Today checklist (`src/lib/dashboard/day-plan.ts`). One streak, counting days with a finished lesson only (`src/lib/progress/streak.ts`); finishing a lesson also bumps the `streaks` table (`bumpStreak` in `src/lib/progress/queries.ts`), which Progress reads as the server-side streak.

**Achievements** are computed from records, never stored: badges each have their own rule in `src/lib/achievements/catalog.ts`; ninja titles come from counts of ranked tasks (D–S grade tasks, never badges); clan crests per topic. Original art only.

## Design

Two layers, both in `src/app/globals.css`:
- **Phosphor** (base theme; rules in AGENTS.md and `.cursor/rules/`): no purple (`--brand-violet` is a legacy name for green), tokens instead of hex, light and dark both correct.
- **Coach** — the look of every rebuilt page: wrap the page in `practice-coach-v2` and use `--coach-*` tokens (`--coach-hero-bg` dark cards with `--coach-lime` buttons, `--coach-surface` cards with 2px `--coach-border`). Chart series colours are `--coach-chart-kept` / `--coach-chart-stopped` (validated for colour-blind contrast in both modes).

Writing: no em dash ("—") in interface or card text (use a comma, colon, full stop or brackets); page titles give only their own name and the root template adds " · Ascend". Lesson bodies under `content/` still have them.

Learner chrome (`.cursor/rules/app-shell-chrome.mdc`): no top bar, no fake search, theme toggle in the sidebar, `PlaceholderAvatar` for faces. The sidebar (desktop) and the bottom tab bar + "More" sheet (phones, `mobile-tab-bar.tsx`) share one nav model, `src/lib/nav/app-nav.ts`; Practice shows a due-card badge read from this browser's deck.
