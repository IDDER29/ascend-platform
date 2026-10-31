# Agent APP — App shell flows

**Agent:** APP (Dashboard / settings / shell chrome)  
**Date:** 2026-09-22  
**Method:** Read-only code trace (no app changes)  
**Assumption:** A+Open — curriculum open without account; persisted progress requires sign-in.

## Scope summary

| Journey | Status | Headline |
|---------|--------|----------|
| F-APP-1 Post sign-in → `/dashboard` | **Pass** (core) | Greeting, Resume, and continue card use real session + DB progress when available. |
| F-APP-2 Shell identity (sidebar / topbar) | **Gap** | Real name/avatar initial when signed in; fixture streak/XP/level in several chrome surfaces. |
| F-APP-3 `/settings` load + save | **Pass** (persist) / **Gap** (UX) | Profile fields round-trip to `profiles`; client auth context and pace vs dashboard goal not synced. |
| F-APP-4 `/profile` | **Broken** (honesty) | Name/username from session; almost all stats and copy remain demo fixtures when authed. |
| F-APP-5 Residual Amine / fake XP (authed) | **Gap** | Sidebar footer + profile + several `(app)` pages still show hardcoded XP/level/streak. |

---

## F-APP-1 — After sign-in: dashboard greeting, Resume, continue card

### Intent

Land on `/dashboard` after auth, see a personalized header, and jump back into the correct lesson via Resume / “Continue learning”.

### Steps

1. User submits sign-in or sign-up on `/signin`.
2. Server action sets session cookie and `redirect("/dashboard")`.
3. Dashboard server component loads `getCurrentUser()` and, if present, progress queries.
4. UI renders time-of-day greeting, primary Resume CTA, and gradient continue card.

### Entry / exit

| | |
|---|---|
| **Entry** | Successful `signInAction` / `signUpAction` (`src/app/signin/actions.ts`) |
| **Exit** | User follows `continueHref` into `/curriculum/{level}/{slug}` or other dashboard links |

### Code path

| Step | Files |
|------|--------|
| Redirect after auth | `src/app/signin/actions.ts` — `setSessionCookie` then `redirect("/dashboard")` |
| Session + user | `src/lib/auth/auth.ts` — `getCurrentUser()` (cookie → `users` + `profiles`) |
| App route auth boundary | `src/app/(app)/layout.tsx` — `AuthProvider` wraps `(app)/*` |
| Dashboard data | `src/app/(app)/dashboard/page.tsx` — `getContinueLesson`, `getStreak`, `listCompletedLessons`, `countCompletedInLevel` |
| Continue target | `src/lib/progress/queries.ts` — `getContinueLesson` (first incomplete lesson in curriculum order) |

### Behavior (verified)

- **Greeting:** `greetingForHour()` + `firstName` from `user.name` → `"Good morning, {firstName}."` when signed in with a non-empty name; otherwise `"Good morning."` without name (`dashboard/page.tsx` ~114–244).
- **Subtitle:** Signed-in copy uses `remainingInLevel` from real completion counts; signed-out copy nudges to `/signin`.
- **Resume (header):** `Button` label `"Resume"` when `user`, else `"Start"`; `href={continueHref}` (~267–272).
- **Continue card:** Shows `currentLesson` derived from continue lesson’s level/order; progress bar uses `doneInCurrentLevel / levelMeta.totalConcepts`; CTA `"Resume lesson"` when signed in (~275–314).
- **DB failure:** `try/catch` around progress block keeps open-path defaults (first lesson, zeros) (~78–104).

### Status: **Pass** (primary journey)

Core post-auth dashboard behavior matches the honesty spine: resume target and headline stats (streak, XP from completions, concepts done) come from the database when `user` is set and DB is reachable.

### Honesty notes

| Severity | Note |
|----------|------|
| Low | **Activity heatmap** grays out all cells when `user` is set (`#F0EEF7` only) — not fake activity, but not real either (~575–586). |
| Low | **Badges earned** stat card value is always `"—"` for signed-in users (~172–177); achievements strip is decorative (~623–638). |
| Medium | **Daily goal** is hardcoded `dailyGoalTarget = 3` (~128–131), not read from settings `pace` (`casual` / `regular` / `intense`). |
| Low | Anonymous dashboard still shows decorative sparklines on stat cards (~179–219); values are `"—"` / `0/N` with honest badges (`sign in`, `open path`). |

---

## F-APP-2 — Sidebar / topbar identity: signed in vs out (lessons vs app)

### Intent

Chrome should reflect the real signed-in learner on app and curriculum surfaces; anonymous browsing should not impersonate a specific user’s progress.

### Steps

1. Layout reads session once and provides `AuthProvider`.
2. `AppSidebar` / `AppTopbar` read `useAuthUser()`.
3. Lesson pages use collapsed sidebar + custom lesson header (no `AppTopbar`).

### Entry / exit

| | |
|---|---|
| **Entry** | Any route under `(app)/*`, `/curriculum/*`, `/practice/*` |
| **Exit** | N/A (ambient chrome) |

### Code path

| Surface | Session boundary | Chrome |
|---------|------------------|--------|
| `(app)/*` | `src/app/(app)/layout.tsx` | `AppSidebar` + `AppTopbar` on dashboard, settings, profile, progress, etc. |
| `/curriculum` index | `src/app/curriculum/layout.tsx` | Same components (`curriculum/page.tsx`) |
| `/curriculum/.../lesson` | Same layout + page-level `getCurrentUser` | `AppSidebar defaultCollapsed`; custom sticky header (`curriculum/[level]/[slug]/page.tsx` ~97–158) |
| `/practice` | `src/app/practice/layout.tsx` | `AppSidebar` on `practice/page.tsx` |

### Signed in vs signed out

**`AppTopbar`** (`src/components/ui/app-topbar.tsx`):

| State | Avatar link | Streak / XP chips |
|-------|-------------|-------------------|
| Signed in | `/profile`, initial from `user.name` | Fake chips **hidden**. Optional real streak chip only if parent passes `streakDays > 0` (~25–31). |
| Signed out | `/signin`, initial from `"Amine"` fallback (~11) | **Fixture** streak `12` and XP `1,440` (~33–41). |

**`AppSidebar`** (`src/components/ui/sidebar.tsx`):

| State | Display name | Profile footer card |
|-------|--------------|---------------------|
| Signed in | `user.name` | Still shows **hardcoded** `Level 8`, `1,800 XP` / `2,000`, 90% bar (~219–230). |
| Signed out | `"Amine"` fallback (~111) | Same hardcoded level/XP (~202–230). |

**Who passes real streak to topbar:**

- **Yes:** `dashboard/page.tsx` — `AppTopbar streakDays={user ? streakCurrent : null}` (~226).
- **No:** settings, profile, curriculum index, progress, achievements, bookmarks, playground, shellforge pages — default `streakDays = null`, so signed-in users see no streak chip (not fake — absent).

**Lesson pages:**

- No `AppTopbar`; identity only via sidebar (fixture level/XP footer still applies).
- `streakDays` fetched on server is passed to `LessonFooter`, not the topbar (`curriculum/[level]/[slug]/page.tsx` ~80–88, ~245–252).

### Status: **Gap**

Signed-in users get a **real name and initial** in sidebar/topbar when `profiles.name` is populated. Several chrome elements still **assert fake progression** (sidebar footer level/XP) or show **demo chips** when signed out.

### Honesty notes

| Severity | Note |
|----------|------|
| **High** | Sidebar profile card **always** renders Level 8 and 1,800 XP regardless of `useAuthUser()` (~219–230). |
| **Medium** | Signed-out `AppTopbar` shows 12-day streak and 1,440 XP (~33–41) — misleading on dashboard/curriculum index. |
| **Low** | Empty `user.name` falls back to display `"Amine"` / initial `A` (~111, `app-topbar.tsx` ~11) — could mask missing profile data for a signed-in account. |
| **Low** | `NotificationsBell` uses static `NOTIFICATIONS` for all users (`src/components/ui/notifications-bell.tsx`, `src/lib/notifications-data.ts`) — not Amine-specific but not personal. |

---

## F-APP-3 — `/settings` load and save profile round-trip

### Intent

Signed-in learner opens settings, sees stored profile, edits fields, saves to account, and sees updated data on reload.

### Steps

1. GET `/settings` — server loads user + profile row.
2. Client hydrates form from `initial` props.
3. User clicks **Save changes** → `updateProfileSettingsAction`.
4. Server updates `profiles`, revalidates paths; UI shows “Saved to your account”.

### Entry / exit

| | |
|---|---|
| **Entry** | `/settings` (nav or profile gear) |
| **Exit** | Stay on page after save, or navigate to `/profile` / `/dashboard` |

### Code path

| Step | Files |
|------|--------|
| Page loader | `src/app/(app)/settings/page.tsx` — `getCurrentUser()`, `getProfileSettings(user.id)` |
| Read profile | `src/lib/progress/queries.ts` — `getProfileSettings` joins `users` + `profiles` |
| Client form | `src/app/(app)/settings/settings-client.tsx` — controlled state, `save()` |
| Server action | `src/lib/progress/actions.ts` — `updateProfileSettingsAction` → `updateProfileInDb` |
| Write profile | `src/lib/progress/queries.ts` — `updateProfileSettings` (validate name/username, uniqueness, `UPDATE profiles`) |
| Revalidation | `revalidatePath("/settings")`, `"/profile"`, `"/dashboard"` |

### Behavior (verified)

- **Signed out:** Banner “Sign in to edit…”; fields disabled; save disabled (`settings-client.tsx` ~116, ~162–166, ~490–493).
- **Signed in, DB up:** Form prefilled from `ProfileSettings` (~56–72, ~98–109).
- **Save:** Persists `name`, `username`, `bio`, `pace`, `theme`, `accent`, `reminderTime`, notification toggles; email read-only from `users.email` (~241–247).
- **Validation errors:** Surfaced via `result.error` (e.g. empty name, username taken) (~140–145, queries ~202–210).
- **Not wired:** Photo upload/remove disabled with explicit copy (~200–215); danger zone reset/delete shows dismiss-only stub (~472–483).

### Status: **Pass** (database round-trip) / **Gap** (live shell sync)

Persistence path is real for signed-in users when `db` is available. Gaps are UX/honesty adjacent, not blocking save.

### Honesty notes

| Severity | Note |
|----------|------|
| Medium | After save, **`AuthProvider` is not refreshed** — `useAuthUser()` in sidebar/topbar/profile hero keeps pre-save name until full navigation or hard reload (`settings-client.tsx` has no `router.refresh()`). |
| Medium | **`pace` saved** (1/3/5 concepts per day in UI) but **dashboard daily goal ignores it** (fixed 3) — settings promise ≠ dashboard behavior. |
| Low | **Theme / accent** persist to DB but appearance card states dark mode “isn’t built in this preview yet” (~366–368) — stored prefs may not affect UI. |
| Low | `getProfileSettings` returns `null` if no DB/profile — form falls back to empty defaults; user may look signed in via layout but see blank profile. |

---

## F-APP-4 — `/profile` — real name vs fixtures

### Intent

Profile should represent the authenticated learner’s identity and progress, or clearly label a demo when anonymous.

### Steps

1. `(app)/layout` supplies `AuthProvider` with `PublicUser`.
2. Client `ProfilePage` reads `useAuthUser()`.
3. Hero and sections render mix of live identity and static demo data.

### Entry / exit

| | |
|---|---|
| **Entry** | Sidebar profile card, topbar avatar (signed in), direct `/profile` |
| **Exit** | Settings, sign-out, share link |

### Code path

| Data | Source |
|------|--------|
| Name, username, initial, sign-out | `src/app/(app)/profile/page.tsx` — `useAuthUser()` (~62–65, ~139–148) |
| Demo fallbacks | Same file — `"Amine El Khaldi"`, `"amine"` when `user` null (~63–64) |
| Demo banner | ~152–159 when `!user` |
| Skills progress | `LEVEL_DONE` constant (~29–34, ~196–218) |
| Hero stats | Hardcoded `1,440` XP, `19/25` concepts, streak `12`, etc. (~162–175) |
| Projects | `PASSED_PROJECTS` static Shellforge (~46–58, ~223–273) |
| Badges | `BADGES.filter earned` from `src/lib/achievements-data` (~36, ~286–305) |
| Activity grid | Seeded colors + `31 active days` (~313–327) |

### Behavior (verified)

| Field | Signed in | Signed out |
|-------|-----------|------------|
| Display name / @username | **Real** from session | Fixture Amine / amine |
| Bio, tier, join date, GitHub links | **Fixture copy** | Same fixtures |
| LV 8, XP, concepts, streak, skills, projects, activity | **Fixture numbers** | Same + demo banner |

### Status: **Broken** (honesty when authed)

Anonymous demo is **partially labeled** (“You’re viewing the demo profile”). For **signed-in users there is no disclaimer**, but the page still presents Amine-style portfolio stats and Shellforge pass — **UI promises progress the app does not load from DB on this route**.

### Honesty notes

| Severity | Note |
|----------|------|
| **High** | Authed users see **1,440 XP, 12-day streak, 19/25 concepts, LV 8** regardless of real progress (`profile/page.tsx` ~162–175, ~93). |
| **High** | **Skills** and **projects passed** are static constants, not `listCompletedLessons` / project submissions. |
| Medium | **Bio** and social links are hardcoded, not `profiles.bio` from settings save. |

---

## F-APP-5 — Remaining Amine / fake XP when authenticated

Inventory of fixture persona/progression still visible **after sign-in** on app-shell-related surfaces.

| Location | What shows | Uses auth? | Evidence |
|----------|------------|------------|----------|
| `sidebar.tsx` footer | Level 8, 1,800/2,000 XP, 90% bar | Name only | ~111, ~219–230 |
| `sidebar.tsx` | Fallback name `"Amine"` if `!user?.name` | Yes | ~111 |
| `app-topbar.tsx` | Fallback initial `"Amine"` if no name | Yes | ~11 |
| `profile/page.tsx` | Full demo stats + bio + projects | Name/username only | ~63–175, ~109–112 |
| `(app)/progress/page.tsx` | `LEVEL_PROGRESS`, `RECENT_COMPLETIONS`, XP chart constants | **No** — client-only fixtures | ~19–34, ~43–45 |
| `(app)/achievements/page.tsx` | Static `BADGES` / `BADGE_STATS` | **No** | `achievements-data` import ~9 |
| `(app)/bookmarks/page.tsx` | Static bookmark list (same pattern as progress) | **No** | Client page with fixtures |
| `notifications-bell.tsx` | Static feed | **No** | `NOTIFICATIONS` import |

**Correctly honest when authed (for comparison):**

- `dashboard/page.tsx` — XP = `totalCompleted * 50`, streak/concepts from DB.
- `app-topbar.tsx` — no fake streak/XP chips when `user` is set.
- `settings` — loads/saves real profile row.

**Amine outside APP shell (informational):** `signin/page.tsx`, `community/page.tsx`, `lib/community-data.ts`, homepage marketing — not counted as authed app chrome but same persona in marketing.

### Status: **Gap**

Authed learners still encounter **Amine/name fallbacks** only when name missing; the larger issue is **hardcoded Level 8 / 1,440–1,800 XP** in sidebar and profile (and fixture pages under `(app)`).

### Honesty notes

| Severity | Note |
|----------|------|
| **High** | Sidebar footer XP/level on **every** app/curriculum/practice screen while signed in. |
| **High** | `/profile` hero metrics for signed-in users. |
| **Medium** | `/progress`, `/achievements`, `/bookmarks` behave like a static demo even with a live session (no `getCurrentUser` on those pages). |

---

## Cross-cutting architecture

```
signInAction / signUpAction
        │
        ▼
  setSessionCookie ──► redirect /dashboard
        │
        ▼
getCurrentUser() ◄── session cookie (dynamic route signal)
        │
        ├── (app)/layout ──► AuthProvider ──► AppSidebar / AppTopbar (client)
        ├── curriculum/layout ──► same
        └── practice/layout ──► same

Dashboard / curriculum index (server) ──► progress queries ──► honest resume + stats
Settings (server) ──► getProfileSettings / updateProfileSettings ──► profiles table
Profile (client) ──► useAuthUser only ──► name honest, stats not wired
```

## Recommended coordinator flags (for Wave 3 matrix)

| ID | Item | Suggested owner |
|----|------|-----------------|
| H-APP-1 | Sidebar footer level/XP always fixture | APP / LEARN |
| H-APP-2 | `/profile` authed demo stats without disclaimer | APP |
| H-APP-3 | `/progress` + `/achievements` ignore session | APP / LEARN |
| H-APP-4 | Settings save vs `AuthProvider` stale name | APP / AUTH |
| H-APP-5 | Settings `pace` vs dashboard daily goal = 3 | APP / LEARN |
| H-APP-6 | Signed-out topbar fake streak/XP on open dashboard | APP (acceptable if labeled; currently not) |

---

## Files index (primary)

- `src/app/signin/actions.ts`
- `src/app/(app)/layout.tsx`, `dashboard/page.tsx`, `settings/page.tsx`, `settings/settings-client.tsx`, `profile/page.tsx`, `progress/page.tsx`
- `src/app/curriculum/layout.tsx`, `curriculum/page.tsx`, `curriculum/[level]/[slug]/page.tsx`
- `src/app/practice/layout.tsx`
- `src/components/ui/sidebar.tsx`, `app-topbar.tsx`
- `src/lib/auth/auth.ts`, `context.tsx`
- `src/lib/progress/queries.ts`, `actions.ts`
