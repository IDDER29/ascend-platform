# Agent P — Product & Objectives

**Role:** Product & Objectives (Wave 1)  
**Date:** 2026-09-22  
**Scope:** README, orchestration goals, content schema, curriculum layout, `package.json` product signals  
**Method:** Read-only audit; no application code changes.

---

## 1. Product one-liner

**Ascend** is an open-source, self-paced learning platform (Next.js/TypeScript rebuild of a static prototype) that teaches computer science **bottom-up** — from a single bit through C, memory, and OS concepts toward a **working shell** capstone — with a Duolingo-style engagement layer (XP, streaks, badges, practice quizzes) and **file-based MDX curriculum** designed for community contributions via PRs.

Sources: `README.md` (lines 1–9, 113–114), `src/components/homepage/hero.tsx` (lines 12–21), `docs/orchestration/00-GOALS-AND-SYSTEM.md` (G1).

---

## 2. Target user / learning promise

### Who it is for

Marketing and onboarding articulate several personas with the same underlying path:

| Persona (onboarding) | Stated need | Source |
|----------------------|-------------|--------|
| Fundamentals | “Finally get how computers actually work, bottom-up.” | `src/app/onboarding/page.tsx` (`GOALS`, id `fundamentals`) |
| C & systems | Pointers, memory, OS “still feel fuzzy.” | `onboarding/page.tsx` (`c-systems`) |
| Exam / interview | “Solid on CS foundations, fast.” | `onboarding/page.tsx` (`exam-prep`) |
| Curious explorer | “Explore and learn something real.” | `onboarding/page.tsx` (`curious`) |

Site copy positions Ascend as **independent, community-built**, **no prerequisites, no gatekeeping** (`src/components/homepage/footer.tsx`), and **free · open-source · self-paced** (`hero.tsx` badge).

### Learning promise (what the product commits to)

- **Pedagogy:** Start at bits, logic, and CPU so C and systems “nothing feels like magic” (`src/components/homepage/why-section.tsx`).
- **Format:** “Clear lessons, hands-on drills, and real projects” plus gamification “that make you want to come back” (`hero.tsx`).
- **Path clarity:** “Four levels. Each unlocks the next — no guessing what to learn, ever.” (`src/components/homepage/curriculum-preview.tsx`).
- **North-star outcome:** “From a single bit to a working shell.” (`curriculum-preview.tsx`, `hero.tsx` subcopy).

### Pace promise (onboarding)

Users pick **Casual (5m/day)**, **Regular (15m/day)**, or **Intense (30m/day)**; copy ties pace to “daily goal and reminders” (`onboarding/page.tsx`, `PACES`). Step 4 summarizes goal + pace in client state and links to the real first lesson (`what-is-a-bit`). **Onboarding choices are not persisted to the database on account creation** in the current auth flow (`signUp` only seeds default `profiles.pace` — see `src/lib/auth/auth.ts` and schema defaults in `src/lib/db/schema.pg.ts`).

### Messaging tension (product honesty)

Homepage hero states: **“No account needed to start · progress saves as you go”** (`hero.tsx` line 36). README and “Known limitations” explicitly say **XP/streak/badge/progress numbers are cosmetic fixture data** and **per-user progress is not wired** (`README.md` “Not built yet”, “Known limitations”). This is a **product copy vs. implementation gap** worth resolving in a later pass.

---

## 3. Curriculum structure (levels, lesson count)

### Levels (canonical IDs)

Four levels defined in `src/lib/content/schema.ts` (`levelIds`, `LEVELS`):

| Level ID | Display name | Tagline | `totalConcepts` (metadata) | `timeLabel` | Notes |
|----------|--------------|---------|----------------------------|-------------|--------|
| `level-00-bits-logic` | Bits & Logic | The Groundwork | 5 | ~35 min | |
| `level-01-machine-memory` | Machine & Memory | The Machine | 6 | ~47 min | |
| `level-02-the-c-language` | The C Language | The Craft | 8 | ~62 min | Flagship hand-authored lesson: `what-a-pointer-really-is.mdx` (`README.md`) |
| `level-03-systems-software` | Systems & Software | The Architect | 6 | ~7 hrs | `locked: true` in `LEVELS` |

**Concept count sum:** 5 + 6 + 8 + 6 = **25 concepts** (used in badges copy, e.g. “13/25 concepts” in `src/lib/achievements-data.ts`).

### Lesson count (runtime content)

- **24 MDX files** under `content/curriculum/{level}/{slug}.mdx` (`README.md`, verified by filesystem inventory):
  - Level 00: **5** lessons  
  - Level 01: **6** lessons  
  - Level 02: **8** lessons  
  - Level 03: **5** lessons  

Each lesson is loaded via `gray-matter`, validated with `LessonFrontmatterSchema`, sorted by level then `order` (`src/lib/content/lessons.ts`).

### Navigation model

- **Within-app prev/next** crosses level boundaries (`getLessonNavigation` in `lessons.ts`).
- After the last Level 03 lesson, there is **no next lesson in MDX**; comment in `lessons.ts` states the following slot is **Shellforge** (“out of scope” for the lesson chain).
- Homepage Level 03 topics mention **“Build Shellforge”** and **“Write Corelib”** (`curriculum-preview.tsx`); **Corelib** has no dedicated route in README’s layout tree — only Shellforge under `projects/shellforge/*`.

### Content pipeline

- **23/24** lessons generated from `content-source/*.json` via `scripts/convert-lessons.py`; one flagship lesson hand-transcribed (`README.md`).
- Frontmatter fields: title, level, slug, order, `timeMin`, learning outcomes, primer, knowledge check, assignment, `whyThisMatters`, additional resources (`LessonFrontmatterSchema` in `schema.ts`).
- External resource URLs are verified where possible; inline-only references render as non-links (`README.md` “Content pipeline”).

---

## 4. What README claims is DONE vs. stub / honest limitation

### Done (real behavior claimed)

| Area | Claim | Source |
|------|--------|--------|
| Design & marketing | Design system, homepage | `README.md` “Done” |
| Curriculum | Full **24-lesson** content, SSG lesson pages, `/curriculum` index | `README.md`, `src/app/curriculum/` |
| Learner UX shell | Dashboard, progress, achievements, bookmarks, profile, practice, playground, onboarding, level-complete, streak-lost, 404 | `README.md` “Done” |
| Global UX | ⌘K command palette, notifications bell, working nav targets | `README.md` |
| Auth + DB | Sign up/in/out, bcrypt, JWT cookie, `users` / `profiles` / `streaks` rows; Drizzle + Postgres or local SQLite | `README.md` “Backend”, `src/lib/auth/`, `src/lib/db/` |
| Legal stubs | `/terms`, `/privacy` for sign-up links | `README.md` layout |

### Done UI, **honestly fake** backend (session-only or simulated)

| Area | Behavior | Source |
|------|----------|--------|
| Password reset | Full UI flow; no real email | `README.md` lines 68–73, “Known limitations” |
| Community | Seed threads, filters, compose → client state; **lost on reload** | `README.md`, `src/lib/community-data.ts` |
| Settings | Controlled fields; **“session only”**; Danger Zone disclosures | `README.md` |
| Shellforge | Checklist, submit form **pick simulated outcome**, result page | `README.md`, `projects/shellforge/*` |
| Playground | Known snippets show real output; arbitrary C **not compiled** | `README.md` “Known limitations” |
| OAuth buttons | Explicit “not wired up” message | `README.md` lines 59–61 |

### Not built / deferred (schema may exist, app doesn’t use it)

| Gap | Detail | Source |
|-----|--------|--------|
| Per-user progress | Completions, streaks, bookmarks, badges **not** read/written from DB | `README.md` “Not built yet”, lines 91–96 |
| Tables unused by pages | `lesson_progress`, `bookmarks`, `community_*`, `shellforge_submissions` | `README.md`, `schema.pg.ts` (no app imports for progress/bookmarks) |
| Settings ↔ profile DB | Settings doesn’t read/write signed-in `profiles` | `README.md` “Known limitations” |
| Discord, monorepo | Not built | `README.md` “Not built yet” |
| Disabled “Soon” nav | Described for non-existent screens | `README.md` line 98–101 (no `Soon` string found elsewhere in repo at audit time — may be aspirational or removed) |

### Signed-in vs. signed-out experience

- **Signed in:** Real name/initial from account on shell surfaces (`README.md`).
- **Signed out (and all gamification numbers):** Shared **demo “Amine”** fixture — same XP/streak/badge story as static prototype (`README.md` lines 63–66, 340–342; e.g. `src/app/(app)/dashboard/page.tsx` “Good afternoon, Amine.”).

---

## 5. Core product objects

### Content domain (file-based, Zod-validated)

| Object | Fields / role | Source |
|--------|----------------|--------|
| **Lesson** | `meta: LessonFrontmatter` + MDX `body` | `schema.ts` `Lesson` interface |
| **LessonFrontmatter** | title, level, slug, order, timeMin, learningOutcomes, primer[], knowledgeCheck[], assignment, whyThisMatters, additionalResources[] | `LessonFrontmatterSchema` |
| **KnowledgeCheckItem** | question, answer, jump targets for in-lesson navigation | `KnowledgeCheckItemSchema` |
| **Level** | name, short tag, totalConcepts, timeLabel, optional `locked` | `LEVELS` in `schema.ts` |

### Engagement domain (mostly **fixture modules**, not DB-backed in UI)

| Object | Role | Source |
|--------|------|--------|
| **Badge** | id, glyph, label, rarity, status (earned / in-progress / locked), progress meta | `src/lib/achievements-data.ts` |
| **Bookmark (UI seed)** | Client/filter state from seed data | `src/lib/bookmarks-data.ts` (per README) |
| **Notification items** | Derived from badge/streak fixture narrative | `src/lib/notifications-data.ts` (per README) |
| **Community thread/reply (UI)** | Seed + ephemeral client posts | `src/lib/community-data.ts` |

### Account & persistence domain (DB — **partially wired**)

| Table / object | Purpose | Wired to UI today? |
|----------------|---------|-------------------|
| **User** | email, passwordHash | Yes — auth |
| **Profile** | name, username, bio, pace, theme, accent, notification prefs | Created on signup; **not** driving Settings/Progress UI |
| **Streak** | current, longest, freezes, lastActiveDate | Row created on signup; **UI uses fixtures** |
| **LessonProgress** | userId + level + slug + completedAt | Schema only |
| **BadgesEarned** | userId + badgeId + earnedAt | Schema only |
| **Bookmark** | userId, kind, refId | Schema only |
| **CommunityThread / CommunityReply** | Discussion persistence | Schema only |
| **ShellforgeSubmission** | repoUrl, outcome, attempt | Schema only |

Sources: `src/lib/db/schema.pg.ts`, `src/lib/auth/auth.ts` (`signUp` inserts users, profiles, streaks).

### Capstone / practice (product concepts, limited backend)

| Surface | Object | Source |
|---------|--------|--------|
| `/practice` | Interactive quiz (client state, timer, scoring, streak language) | `README.md`, `src/app/practice/page.tsx` |
| `/projects/shellforge/*` | Capstone brief, simulated submit/grade | `README.md` |
| `/playground` | Multi-file C scratchpad + snippet library | `src/lib/playground-snippets.ts` (per README) |

---

## 6. Success metrics the product seems optimized for

The UI and badge catalog imply optimization for **habit + mastery + completion**, even while numbers remain demo data:

| Metric | Where it shows up | Intent |
|--------|-------------------|--------|
| **Lesson / concept completion** | Progress bars, curriculum index, level-complete pages, badges (“First Steps”, “Groundwork”, “Core Complete”) | Finish structured path |
| **Level completion** | `/level-complete/[level]`, level-themed badges | Chunked milestones |
| **XP** | Dashboard, progress chart, lesson footers (“+50 XP”), `BADGE_STATS.badgeXp` | Quantified effort |
| **Streaks (daily habit)** | Dashboard, streak-lost flow, streak-freeze toggle, badges (“Week Warrior”, “Marathoner”, “Iron Will”) | Daily return |
| **Quiz mastery** | `/practice`, badges (“Quiz Ace”, “Perfectionist”, “Pointer Wizard”) | Retrieval practice |
| **Capstone / project success** | Shellforge result states, “Shell Architect”, “Ship It”, “Systems Sage” | Apply skills |
| **Community contribution** | Badges (“Mentor”, “Helping Hand”, “Polyglot”) | Social proof (mostly locked / future) |
| **Engagement timing** | “Night Owl”, “Early Bird”, “Speed Runner” badges | Time-of-day / intensity |
| **Skill mastery by level** | Profile, progress “mastery-by-level” | Depth per tier |
| **Onboarding pace** | 5 / 15 / 30 min daily framing | Commitment setting (UI-only today) |

Orchestration meta-goal **G1** aligns with documenting this split: real product **intent** vs. **today’s** persistence (`docs/orchestration/00-GOALS-AND-SYSTEM.md`).

---

## 7. Open product questions / gaps

1. **When is progress “real”?** Homepage promises progress saves; README says otherwise. What is the intended MVP: anonymous localStorage, account-required sync, or both?

2. **Concept vs. lesson vs. project accounting:** 25 concepts vs. 24 MDX lessons vs. Shellforge (and homepage “Corelib”) — what is the canonical completion unit for “Core Complete” and level 03’s sixth concept?

3. **Level 03 `locked: true`:** Five systems lessons exist on disk; UI locks the level (`schema.ts` `LEVELS`). Is lock gating progress fixtures, content maturity, or placeholder for capstone?

4. **Onboarding → profile:** Should goal/pace from `/onboarding` write to `profiles` (and eventually drive reminders)? Signup currently ignores onboarding.

5. **OAuth & identity:** GitHub/Google are explicit stubs — required for “community-built” positioning or optional?

6. **Community & Discord:** Badges assume peer solutions and likes; community is ephemeral. Is Discord the intended social layer (`README.md` “Not built yet”)?

7. **Shellforge honesty vs. product promise:** Simulated grader is transparent — is a real remote grader a roadmap requirement or permanent “demo mode” for open-source hosting?

8. **Playground scope:** Is in-browser compilation a goal, or is “honest preview + external toolchain” the long-term design?

9. **Demo user “Amine”:** For signed-in users, when do fixtures get replaced by empty state vs. live data — and how to avoid two truths (DB streak row at 0 vs. UI showing 12 days)?

10. **Deployment story vs. learning promise:** SQLite fallback unsuitable for serverless persistence (`README.md`); does “accounts that stick” become a product requirement for claiming saved progress?

11. **Missing surfaces in README map:** “Corelib”, disabled “Soon” nav items — planned curriculum extensions or marketing placeholders?

12. **Quality bar for “done”:** Orchestration non-goals say audit-only (`00-GOALS-AND-SYSTEM.md`); product “done” today means **full UI parity with static prototype** plus **real auth**, not **real learning analytics**.

---

## Appendix: `package.json` product signals

| Signal | Evidence |
|--------|----------|
| **App identity** | `"name": "ascend-web"` |
| **Stack** | Next 16.3.5, React 19, Tailwind 4 — modern learner app shell |
| **Content** | `@next/mdx`, `next-mdx-remote`, `gray-matter`, `zod` — MDX curriculum + validation |
| **Auth/data** | `bcryptjs`, `jose`, `drizzle-orm`, `postgres`, `better-sqlite3` — dual-backend accounts without Supabase Auth |
| **Ops scripts** | `dev`, `build` (webpack), `db:generate`, `db:migrate` — no test/lint CI script beyond `eslint` |
| **Not present** | Discord SDK, email provider, sandbox/runner, analytics — consistent with deferred backend features |

Source: `package.json`.

---

*End of Agent P report. Input for Wave 2 agents (Curriculum, Learner App, Marketing/Auth, Projects) and Wave 3 synthesis.*
