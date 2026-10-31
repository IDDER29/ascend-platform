# Agent ANON — Anonymous visitor flows

**Agent:** ANON (Anonymous visitor & start)  
**Date:** 2026-09-22  
**Method:** Read-only code trace (no app changes)  
**Spine assumption:** A+Open — curriculum readable without account; progress persistence requires sign-in.

---

## Cross-cutting checks

| Check | Finding | Evidence |
|-------|---------|----------|
| Homepage `LESSON_URL` | Single canonical first-lesson href | `LESSON_HREF` and exported `LESSON_URL` in `src/components/homepage/header.tsx` → `/curriculum/level-00-bits-logic/what-is-a-bit` |
| Curriculum signed-out defaults | Level 00, order 1; no DB progress | `CURRENT_LEVEL`, `CURRENT_ORDER` in `src/app/curriculum/page.tsx`; `getContinueLesson` only when `user` is truthy |
| Lesson footer `signedIn={false}` | No “Mark complete” control; copy-only CTA | `src/components/lesson/lesson-footer.tsx` branches at `signedIn`; lesson page passes `signedIn={Boolean(user)}` in `src/app/curriculum/[level]/[slug]/page.tsx` |
| Sidebar “Amine” fallback | Shown when `useAuthUser()` is null **or** `user.name` is falsy (not strictly `null`) | `user?.name \|\| "Amine"` in `src/components/ui/sidebar.tsx` and `(user?.name \|\| "Amine")` in `src/components/ui/app-topbar.tsx` |
| Route protection | No middleware gate on `/` or `/curriculum/*` | No `middleware.ts` match for curriculum; lesson uses `getLesson` + `notFound()` only for invalid slugs |
| Session on curriculum | Layout loads user for chrome only | `src/app/curriculum/layout.tsx` wraps children in `AuthProvider` after `getCurrentUser()` |

---

## Flow 1 — Land on `/` → start CTA → first lesson

### Name & intent

Anonymous visitor discovers Ascend on the marketing homepage and starts the curriculum at the designated entry lesson without signing in.

### Steps

1. GET `/` — `src/app/page.tsx` renders `SiteHeader`, `Hero`, sections, `FinalCta`, `SiteFooter`.
2. Visitor clicks any primary start CTA:
   - Header **Start free** → `Button href={LESSON_HREF}` (`header.tsx`)
   - Hero **Start learning free** → `Button href={LESSON_URL}` (`hero.tsx`, re-export from header)
   - Final CTA **Start learning free** → same `LESSON_URL` (`final-cta.tsx`)
3. Client navigates to `/curriculum/level-00-bits-logic/what-is-a-bit`.
4. Lesson page loads MDX for level `level-00-bits-logic`, slug `what-is-a-bit` (frontmatter `order: 1` in `content/curriculum/level-00-bits-logic/what-is-a-bit.mdx`).
5. `getCurrentUser()` returns `null` → footer shows “Sign in to save progress”; no server progress reads.

Secondary paths on same page:

- Nav **Curriculum** → `/curriculum` (`header.tsx`).
- Hero **Browse the curriculum** → in-page `#path` (`curriculum-preview.tsx` section id), not the app curriculum route.

### Entry / exit

| | |
|---|---|
| **Entry** | `/` (direct, referral, or external link) |
| **Exit (happy path)** | First lesson URL above; user may continue via footer **Next:** link (`getLessonNavigation` in `src/lib/content/lessons.ts`) |

### Code path (files)

- `src/app/page.tsx`
- `src/components/homepage/header.tsx` (`LESSON_HREF`, `LESSON_URL`, CTAs)
- `src/components/homepage/hero.tsx`, `final-cta.tsx`
- `src/app/curriculum/layout.tsx`
- `src/app/curriculum/[level]/[slug]/page.tsx`
- `src/lib/content/lessons.ts`, `content/curriculum/level-00-bits-logic/what-is-a-bit.mdx`

### Status

**Pass** — All documented start CTAs point at the same first lesson; lesson renders without auth.

### Honesty notes

- Hero and final CTA copy correctly state sign-in is for saving progress (`hero.tsx`, `final-cta.tsx`).
- Hero decorative card shows Level 02 / streak / badges — illustrative only (no claim of user state).
- **Gap (medium):** `open-source-strip.tsx` claims “Progress saves locally — sign in only if you want it synced.” No local progress implementation under `src/lib/progress/` or lesson footer; anonymous progress is not persisted anywhere traced.

---

## Flow 2 — Browse curriculum index while signed out

### Name & intent

Visitor opens the full curriculum overview, sees the open-path “current” lesson, and can open any lesson from the path panel without an account.

### Steps

1. GET `/curriculum` — server component `CurriculumPage` (`src/app/curriculum/page.tsx`).
2. `getCurrentUser()` → `null` → `currentLevel` stays `level-00-bits-logic`, `currentOrder` stays `1`; `levelDone` all zeros.
3. Hero strip **Pick up where you left off** shows first lesson title; primary button label is **Start** (not **Continue**) when `!user`.
4. `CurriculumLevelsPanel` receives signed-out defaults: level 00 expanded, lesson 1 “in progress”, others link as **Open** / **Start** / **Review** — no hard locks (`curriculum-levels-panel.tsx`; “Open path — recommended after earlier levels” for ahead levels when `done === 0`).
5. Sidebar + topbar: `AuthProvider` user is `null` → display name **Amine**, demo streak **12** and XP **1,440** in topbar (`app-topbar.tsx`); sidebar profile card shows **Level 8** / **1,800 XP** static demo (`sidebar.tsx`).
6. Right column cards (progress ring, streak, badges) show static demo numbers — not tied to `getCurrentUser()`.

### Entry / exit

| | |
|---|---|
| **Entry** | `/curriculum`, homepage nav, or in-page preview “See the full curriculum” |
| **Exit** | Any `/curriculum/{level}/{slug}` link from panel, “Up next”, or hero **Start** button |

### Code path (files)

- `src/app/curriculum/page.tsx`
- `src/app/curriculum/layout.tsx`
- `src/components/curriculum/curriculum-levels-panel.tsx`
- `src/components/ui/sidebar.tsx`, `app-topbar.tsx`
- `src/lib/auth/auth.ts` (`getCurrentUser`)
- `src/lib/content/lessons.ts` (`getAllLessons` sort order)

### Status

**Pass** for A+Open browsing and signed-out resume defaults.

**Gap** for honesty spine on chrome: signed-out users see another person’s name (**Amine**) and fake XP/streak/level in shell UI.

### Honesty notes

- Banner text “Pick up where you left off” for a first-time anon is slightly misleading; behavior is “start at lesson 1” (accurate destination, optimistic wording).
- **Gap (high):** Sidebar/topbar imply a signed-in learner (**Amine**, Level 8, streak 12) while session is anonymous.
- **Gap (medium):** “Your progress” sidebar widgets on curriculum index are demo-only with no “sign in” disclaimer.

---

## Flow 3 — Open any deep-linked lesson without account

### Name & intent

Visitor lands directly on any valid lesson URL (share link, search, manual URL) and reads content without redirect to sign-in.

### Steps

1. GET `/curriculum/{level}/{slug}` — dynamic segment resolved in `LessonPage`.
2. `getLesson(level, slug)` — missing content → `notFound()`; no auth check.
3. Full lesson UI: MDX body, knowledge check, assignment, footer with **Next:** (or Shellforge / level-complete handoff per navigation rules).
4. `generateStaticParams()` prebuilds all lesson params from content tree — all lessons are valid static targets.
5. Any lesson in any level is reachable; panel links use the same URL pattern for **Open** on non-current lessons.

### Entry / exit

| | |
|---|---|
| **Entry** | Arbitrary valid `/curriculum/level-XX-…/{slug}` |
| **Exit** | Next lesson via footer, prev/next in header, sidebar nav to other app areas (dashboard, etc. — those routes may have their own auth UX; out of ANON scope) |

### Code path (files)

- `src/app/curriculum/[level]/[slug]/page.tsx`
- `src/lib/content/lessons.ts` (`getLesson`, `getAllLessonParams`, `getLessonNavigation`)
- `content/curriculum/**`

### Status

**Pass** — No sign-in wall on lesson read path; deep links work for all published MDX lessons.

### Honesty notes

- **Pass:** Footer and hero marketing align — reading is open, saving is not.
- Add-note control is explicitly demo (`add-note-button.tsx`).

---

## Flow 4 — Mark complete while signed out

### Name & intent

Visitor attempts to record lesson completion without a session.

### Steps

1. On lesson page, `signedIn={Boolean(user)}` is `false`.
2. Footer renders a **non-interactive** pill: “Sign in to save progress” — not a button (`lesson-footer.tsx` else branch at lines 69–72).
3. There is **no** UI click target labeled “Mark complete” for anonymous users in the default render tree.
4. If `onMarkComplete` were invoked with `signedIn === false` (e.g. forced via devtools), handler sets client error: “Sign in to save progress across sessions.” and returns without calling the server.
5. Server action `markLessonCompleteAction` independently returns `{ ok: false, error: "Sign in to save lesson progress." }` when `getCurrentUser()` is null (`src/lib/progress/actions.ts`).

### Entry / exit

| | |
|---|---|
| **Entry** | Lesson footer after reading content |
| **Exit** | User stays on lesson; may use **Next:** to continue reading without persisted completion |

### Code path (files)

- `src/components/lesson/lesson-footer.tsx`
- `src/app/curriculum/[level]/[slug]/page.tsx`
- `src/lib/progress/actions.ts`

### Status

**Pass** — Progress cannot be saved anonymously; UI does not offer a misleading “Mark complete” button when signed out.

### Honesty notes

- **Pass:** Behavior matches “sign in to save progress” messaging on hero/final CTA.
- **N/A:** No local fallback completion state for anon (consistent with gap noted in Flow 1 open-source copy).

---

## Status summary

| Flow | Status | One-line verdict |
|------|--------|------------------|
| 1 — Home → CTA → first lesson | **Pass** | CTAs converge on `what-is-a-bit`; lesson loads with no account |
| 2 — Curriculum index signed out | **Pass** (browse) / **Gap** (chrome) | Open path defaults correct; demo identity/stats on shell |
| 3 — Deep-linked lesson | **Pass** | All MDX lessons readable; no auth redirect |
| 4 — Mark complete signed out | **Pass** | No save path; no Mark complete button when `signedIn=false` |

### Honesty breaks (severity)

| ID | Severity | Issue | Where |
|----|----------|-------|-------|
| H1 | **High** | Signed-out curriculum/lesson shell shows **Amine**, Level 8, streak 12, XP chips as if logged in | `sidebar.tsx`, `app-topbar.tsx` |
| H2 | **Medium** | “Progress saves locally” on homepage is false; no local progress store found | `open-source-strip.tsx` vs `lesson-footer.tsx` / `progress/*` |
| H3 | **Low** | “Pick up where you left off” for anon with no history | `curriculum/page.tsx` hero strip |

### Verified implementation details (requested)

- **`LESSON_URL`:** `/curriculum/level-00-bits-logic/what-is-a-bit` — `src/components/homepage/header.tsx:8–51`
- **Signed-out curriculum defaults:** `level-00-bits-logic`, order `1` — `src/app/curriculum/page.tsx:18–19, 32–34`
- **Lesson footer `signedIn=false`:** Static “Sign in to save progress”; guard in `onMarkComplete` — `src/components/lesson/lesson-footer.tsx:28–32, 69–72`
- **Amine fallback:** `user?.name || "Amine"` when auth context user is null (or name empty) — `src/components/ui/sidebar.tsx:111`, `app-topbar.tsx:11`

**Agent ANON complete.** Ready for Wave 3 coordinator gap matrix.
