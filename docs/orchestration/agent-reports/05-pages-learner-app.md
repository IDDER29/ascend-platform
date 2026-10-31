# Agent L — Learner App Shell

**Role:** Learner App Shell (Wave 2)  
**Date:** 2026-09-22  
**Scope:** `(app)` layout, `/dashboard`, `/progress`, `/profile`, `/settings`, `/achievements`, `/bookmarks`, `/playground`, and shared shell (sidebar, topbar, command palette, notifications)  
**Method:** Read-only audit; no application code changes.  
**Context:** Wave 1 reports `01-product-objectives.md`, `02-architecture.md`.

---

## Domain overview

The **learner app shell** is the signed-in UX surface grouped under `src/app/(app)/`. It shares a repeated layout pattern: fixed `AppSidebar`, sticky `AppTopbar`, and a main content column. Session is loaded once in `(app)/layout.tsx` via `getCurrentUser()` and passed through `AuthProvider` so sidebar/topbar/profile can show real account identity when a cookie exists.

**What is real today**

- **Auth identity:** Name, username, email (in DB at sign-up) surface on profile when signed in; sign-out works via server action.
- **Curriculum wiring (partial):** Dashboard “Up next” and Resume links use `getAllLessons()` from MDX — lesson URLs and titles are real content.
- **Navigation:** Sidebar, topbar profile link, and root `CommandPalette` (⌘K) navigate to real routes including learner pages.
- **Playground honesty:** Run only matches known snippets (`findSnippetByCode`); custom C shows an explicit non-compiler message.

**What is demo / fixture**

- **All gamification numbers:** XP, streaks, level progress, badges, activity heatmaps, notifications, topbar chips, sidebar “Level 8 / 1,800 XP” — static demo narrative (“Amine”, Day 12, 1,440 XP, 19/25 concepts) unless partially overridden by auth name/initial only.
- **Settings:** Entire form is React `useState` seeded with demo defaults; Save shows “this session only”; danger zone copy admits demo.
- **Bookmarks / achievements:** Static modules (`bookmarks-data.ts`, `achievements-data.ts`); no reads/writes to `bookmarks` or `badges_earned` tables.
- **Progress / dashboard completion state:** Hard-coded `LEVEL_DONE`, `CURRENT_LEVEL`, `CURRENT_ORDER`, charts, and recent completions — not `lesson_progress` or `streaks`.

**Schema exists but unused by these pages:** `lesson_progress`, `bookmarks`, `badges_earned`, and most `profiles` preference columns (`pace`, `theme`, `accent`, notification flags) — see `src/lib/db/schema.pg.ts`. Only `users` + `profiles` (name/username at signup) and `streaks` row creation on signup are touched by auth; streak values are never read in the shell UI.

---

## Shared shell components

### `(app)` layout — session boundary

| Field | Detail |
|-------|--------|
| **Route** | N/A (wraps all `(app)/*` pages) |
| **Purpose** | Scope dynamic session read to learner routes; provide `AuthProvider` for descendants. |
| **Key files** | `src/app/(app)/layout.tsx`, `src/lib/auth/auth.ts`, `src/lib/auth/context.tsx` |
| **Data source** | JWT cookie → DB `users` + `profiles` via `getCurrentUser()` |
| **Real vs stub** | **Real** session resolution when DB available; **no** route guard — pages render for anonymous users with demo fallbacks. |
| **Risks / gaps** | No middleware or `requireAuth`; signed-out users see full shell with fake progress. Misleading if users expect progress to “save as you go” (product copy tension per Agent P). |
| **Severity** | **medium** |

### `AppSidebar`

| Field | Detail |
|-------|--------|
| **Route** | Used on all scoped learner pages (+ curriculum/practice/lessons outside this agent) |
| **Purpose** | Primary nav: Learn (dashboard, curriculum, practice, playground) and You (progress, achievements, bookmarks); profile card at bottom. |
| **Key files** | `src/components/ui/sidebar.tsx` |
| **Data source** | `useAuthUser()` for name/initial; **localStorage** `ascend:sidebar-collapsed`; nav targets are static arrays |
| **Real vs stub** | **Real:** collapse preference, active route via `usePathname`, auth display name. **Stub:** “Level 8”, XP bar (1,800 / 2,000) always fixed. |
| **Risks / gaps** | XP/level in sidebar contradict signed-in user’s actual (zero) progress; lesson routes without `AuthProvider` still show “Amine” (architecture note — outside `(app)` but same component). |
| **Severity** | **low** (UX honesty) |

### `AppTopbar`

| Field | Detail |
|-------|--------|
| **Route** | Same as sidebar |
| **Purpose** | Search trigger (palette), streak/XP chips, notifications, profile avatar link. |
| **Key files** | `src/components/ui/app-topbar.tsx`, `src/components/ui/chip.tsx`, `src/components/ui/notifications-bell.tsx` |
| **Data source** | `useAuthUser()` for avatar initial only; streak **12**, XP **1,440** hard-coded |
| **Real vs stub** | **Stub** gamification chips; **real** palette event dispatch and `/profile` link |
| **Risks / gaps** | Chips imply live stats; no connection to `streaks` table or computed XP. |
| **Severity** | **medium** |

### `CommandPalette` (global)

| Field | Detail |
|-------|--------|
| **Route** | Global (root `src/app/layout.tsx`) — affects learner journeys |
| **Purpose** | ⌘K search: lessons (from build-time `getAllLessons()`), fixed actions (resume lesson, practice, playground, achievements, dashboard, profile), Shellforge projects. |
| **Key files** | `src/components/command-palette.tsx`, `src/app/layout.tsx` |
| **Data source** | MDX lesson list (real titles/hrefs); **fixed** “Resume last lesson” → `what-a-pointer-really-is`; keyboard shortcuts client-only |
| **Real vs stub** | **Real** lesson index search; **stub** “last lesson” and engagement shortcuts assume demo progress |
| **Risks / gaps** | Resume action not personalized to user or `lesson_progress`; same for all visitors. |
| **Severity** | **low** |

### `NotificationsBell`

| Field | Detail |
|-------|--------|
| **Route** | Topbar on learner pages |
| **Purpose** | Dropdown of activity notifications with read/unread client state. |
| **Key files** | `src/components/ui/notifications-bell.tsx`, `src/lib/notifications-data.ts` |
| **Data source** | Static `NOTIFICATIONS` array; read IDs in component state only |
| **Real vs stub** | **Fully stub** — no push, email, or DB; CTAs link to real routes (curriculum, achievements, progress, shellforge). |
| **Risks / gaps** | Settings notification toggles do not affect this feed; users may think toggles control real delivery. |
| **Severity** | **low** |

---

## Per-route inventory

### `/dashboard`

| Field | Detail |
|-------|--------|
| **Route** | `/dashboard` |
| **Purpose** | Home hub: greeting, resume current lesson, stats, up-next list, level climb, activity grid, achievement teaser. |
| **Key files** | `src/app/(app)/dashboard/page.tsx`; `AppSidebar`, `AppTopbar`; `getAllLessons`, `LEVELS`, `levelIds` from content lib |
| **Data source** | **MDX:** lesson list for up-next and resume URLs. **Constants:** `CURRENT_LEVEL`, `CURRENT_ORDER`, `LEVEL_DONE`, all stats, heatmap, dates, “Good afternoon, Amine”, streak Day 12 |
| **Real vs stub** | **Real:** links to actual lesson pages derived from content index. **Stub:** entire progress narrative; does not call `useAuthUser()` — greeting always “Amine” even when signed in. |
| **Risks / gaps** | Signed-in users still see demo name and fixed progress; primary post-login landing misrepresents state. Resume target hard-coded to level-02 order 3, not user-specific. |
| **Severity** | **high** (post-auth trust / product promise) |

### `/progress`

| Field | Detail |
|-------|--------|
| **Route** | `/progress` |
| **Purpose** | Analytics-style view: time studied, concepts, quiz accuracy, streak record, XP chart, mastery by level, recent completions. |
| **Key files** | `src/app/(app)/progress/page.tsx` (`"use client"`); `LEVELS`, `levelIds`; inline `LEVEL_PROGRESS`, `RECENT_COMPLETIONS`, `XP_POINTS` |
| **Data source** | Static fixtures; range toggle only swaps two hard-coded time strings |
| **Real vs stub** | **Stub** — no DB, no auth hook; lesson links in recent list point to real curriculum routes but completion times/XP are fictional |
| **Risks / gaps** | Presents precise metrics (96% accuracy, 14h 20m) with no data pipeline; could be mistaken for analytics product. |
| **Severity** | **medium** |

### `/profile`

| Field | Detail |
|-------|--------|
| **Route** | `/profile` |
| **Purpose** | Public-style profile: hero, skills by level, passed projects, badges preview, activity heatmap; share link; settings/sign-out when authed. |
| **Key files** | `src/app/(app)/profile/page.tsx`; `useAuthUser`, `signOutAction`; `BADGES` from `achievements-data.ts`; `PASSED_PROJECTS` inline |
| **Data source** | **DB (partial):** `name`, `username` from session. **Fixtures:** bio tier text, join date, GitHub/ascend.dev links, all stats, `LEVEL_DONE`, heatmap, Shellforge “passed” card |
| **Real vs stub** | **Real:** identity + sign-out + demo banner when logged out. **Stub:** XP, streak, badges count, skills, projects, activity |
| **Risks / gaps** | Best shell page for auth integration but stats remain demo; “LV 8” and tier copy not from DB. |
| **Severity** | **medium** |

### `/settings`

| Field | Detail |
|-------|--------|
| **Route** | `/settings` |
| **Purpose** | Profile fields, learning pace, reminders, notification prefs, appearance, danger zone (reset/delete). |
| **Key files** | `src/app/(app)/settings/page.tsx` |
| **Data source** | Client state only; initial values hard-coded (“Amine El Khaldi”, `amine@example.com`, etc.) — **does not** use `useAuthUser()` or load `profiles` |
| **Real vs stub** | **Stub UI** with honest labels: “Saved (this session only)”, danger zone explains demo; appearance notes dark mode not built |
| **Risks / gaps** | Signed-in users edit fake email/name unrelated to account; schema columns for pace/theme/notifications unused — wasted backend readiness. Upload/remove photo non-functional. |
| **Severity** | **high** (account settings appear to work but do not persist) |

### `/achievements`

| Field | Detail |
|-------|--------|
| **Route** | `/achievements` |
| **Purpose** | Badge gallery with filters, progress ring, “Almost there” in-progress badges, full grid. |
| **Key files** | `src/app/(app)/achievements/page.tsx`; `src/lib/achievements-data.ts` |
| **Data source** | Static `BADGES`, `BADGE_STATS` (earned/in-progress/locked counts precomputed in source) |
| **Real vs stub** | **Fully stub** — no `badges_earned` table reads; filter UI is real client behavior on static data |
| **Risks / gaps** | Badge definitions not tied to lesson completion events; earning is not achievable through app actions. |
| **Severity** | **medium** |

### `/bookmarks`

| Field | Detail |
|-------|--------|
| **Route** | `/bookmarks` |
| **Purpose** | Saved lessons, resources, snippets with tabs and remove-from-list. |
| **Key files** | `src/app/(app)/bookmarks/page.tsx`; `src/lib/bookmarks-data.ts`; lesson bookmark toggle in `src/components/lesson/lesson-header.tsx` (separate route, affects UX) |
| **Data source** | Initial `BOOKMARKS` seed; `useState` for list — removals session-only. Lesson header bookmark toggles local state against same static seed, **does not** sync with bookmarks page state |
| **Real vs stub** | **Stub** — no `bookmarks` table; cross-page bookmark actions disconnected |
| **Risks / gaps** | User can “bookmark” on lesson then not see it on `/bookmarks` after navigation (separate state trees). Playground “Save to Bookmarks” card is copy only (no handler). |
| **Severity** | **medium** |

### `/playground`

| Field | Detail |
|-------|--------|
| **Route** | `/playground` |
| **Purpose** | Multi-file scratch editor for C snippets; quick-start templates; simulated run output. |
| **Key files** | `src/app/(app)/playground/page.tsx`; `src/lib/playground-snippets.ts` |
| **Data source** | `DEFAULT_FILES`, `SNIPPETS` in client state; run via `findSnippetByCode` match |
| **Real vs stub** | **Hybrid:** known snippet bodies show pre-recorded “real” output; arbitrary code **not** compiled. New file button disabled. Files/session not persisted |
| **Risks / gaps** | Marketing “write and run C freely” is qualified in UI — good. No bookmark save despite UI card. No server sandbox. |
| **Severity** | **low** (limitations disclosed in UI) |

---

## Cross-cutting patterns

| Pattern | Observation |
|---------|-------------|
| **Layout duplication** | Each page repeats `AppSidebar` + `AppTopbar` + main wrapper — no shared `(app)` chrome layout component beyond `AuthProvider`. |
| **Client vs RSC** | Only `dashboard` is a Server Component among owned routes; others are `"use client"` islands. Dashboard still avoids auth for greeting. |
| **Demo persona** | “Amine” / level-02 pointer lesson is the canonical demo arc across dashboard, palette, notifications, command palette resume. |
| **DB-backed vs fixture** | See summary table below. |

### Data backing summary

| Surface | DB-backed | Fixture / client-only |
|---------|-----------|------------------------|
| Session / identity | Yes (`users`, `profiles` partial) | Display name on dashboard still “Amine” |
| Streaks / XP / lesson progress | Schema only | All shell UI |
| Badges | `badges_earned` schema only | `achievements-data.ts` |
| Bookmarks | `bookmarks` schema only | `bookmarks-data.ts` + page state |
| Settings prefs | `profiles` columns exist | Settings page state |
| Notifications | — | `notifications-data.ts` |
| Playground files | — | In-memory |
| Curriculum links | MDX content | — |

---

## Top risks (domain)

1. **high — Post-login dashboard/settings honesty:** Users land on `/dashboard` after real sign-up but see fixed demo progress and “Amine” greeting; settings do not load or save their `profiles` row despite schema support.
2. **high — Progress persistence gap:** Product and shell UI imply saved XP, streaks, and concepts; no learner route reads `lesson_progress` or `streaks` (aligned with README “Not built yet”).
3. **medium — Fragmented bookmark model:** Lesson bookmark UI, bookmarks page, and DB table are three isolated stories; session-only removals reset on reload to seed data.
4. **medium — Gamification everywhere:** Topbar chips and sidebar XP bar reinforce fake stats for authenticated users — worse than anonymous demo because it suggests account-backed state.
5. **medium — Achievements disconnected from behavior:** Full badge UX with no earn path undermines engagement layer credibility.
6. **low — Command palette / notifications:** Useful navigation but narratively frozen to demo timeline; settings toggles do not govern notifications feed.

---

## Evidence index (primary paths)

- Layout: `src/app/(app)/layout.tsx`
- Pages: `src/app/(app)/{dashboard,progress,profile,settings,achievements,bookmarks,playground}/page.tsx`
- Shell: `src/components/ui/sidebar.tsx`, `src/components/ui/app-topbar.tsx`, `src/components/ui/notifications-bell.tsx`, `src/components/command-palette.tsx`
- Fixtures: `src/lib/achievements-data.ts`, `src/lib/bookmarks-data.ts`, `src/lib/notifications-data.ts`, `src/lib/playground-snippets.ts`
- Schema (unused by pages): `src/lib/db/schema.pg.ts` (`lesson_progress`, `bookmarks`, `badges_earned`, profile prefs)
- Auth: `src/lib/auth/auth.ts`, `src/lib/auth/context.tsx`

---

*End of Agent L report.*
