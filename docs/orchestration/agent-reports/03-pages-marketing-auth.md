# Agent M — Marketing & Auth Pages

**Role:** Marketing & Auth surfaces (Wave 2)  
**Date:** 2026-09-22  
**Scope:** `/`, `/community`, `/privacy`, `/terms`, `/onboarding`, `/signin` (+ actions), `/reset/*`, `/streak-lost`, app error boundaries  
**Method:** Read-only inspection of page routes and cited components; no application code changes.

**Context (Wave 1):** Ascend is a bottom-up CS learning platform with real MDX curriculum and a **real** email/password account layer (bcrypt + JWT cookie), while learner gamification numbers in marketing/auth chrome are largely **fixture/demo** copy (see `01-product-objectives.md`, `02-architecture.md`).

---

## `/` — Homepage

| Field | Detail |
|-------|--------|
| **Route** | `/` |
| **Purpose** | Primary marketing landing: value prop, curriculum teaser, CTAs into lessons and sign-in. |
| **Key files** | `src/app/page.tsx`; `src/components/homepage/header.tsx`, `hero.tsx`, `stat-strip.tsx`, `why-section.tsx`, `pedagogy-section.tsx`, `curriculum-preview.tsx`, `motivation-banner.tsx`, `open-source-strip.tsx`, `final-cta.tsx`, `footer.tsx` |
| **Data source** | Hard-coded copy and arrays in homepage components (`STATS` in `stat-strip.tsx`, `LEVELS` in `curriculum-preview.tsx`); hero card shows static XP/streak/badge UI. CTAs: `hero.tsx` / `header.tsx` use `LESSON_URL` → `/curriculum/level-02-the-c-language/what-a-pointer-really-is`. |
| **Real vs stub** | **Real:** RSC page, no session read (static-friendly per architecture). Links to real curriculum routes. Stat strip “24 concepts” matches MDX inventory. **Stub/fixture:** Hero and header demo progress (12-day streak, Level 02, badge). Copy claims “No account needed to start · progress saves as you go” — **misaligned** with README/deferred per-user progress. Footer “Roadmap” / “GitHub” are non-link “coming soon” placeholders. |
| **Risks / gaps** | CTA inconsistency: homepage jumps to mid–Level 02 pointer lesson while onboarding targets `what-is-a-bit`. No in-app link to `/onboarding` (route exists but is orphaned). Product honesty gap on “progress saves as you go.” |
| **Severity** | **medium** (copy/CTA truthfulness and path coherence) |

---

## `/community` — Community hub

| Field | Detail |
|-------|--------|
| **Route** | `/community` |
| **Purpose** | Social proof and learner discussion UX (threads, categories, lightweight compose). |
| **Key files** | `src/app/community/page.tsx`; `src/lib/community-data.ts`; shared `SiteHeader` / `SiteFooter` |
| **Data source** | `THREADS` and `CATEGORIES` from `community-data.ts`; new posts only in React state (`useState(THREADS)`). |
| **Real vs stub** | **Fully client-side demo:** no API, DB, or auth. “Post thread” prepends to local state with fixed author `"Amine"`. Stats “4,900+ Members” and “~9 min Avg. reply time” are static marketing numbers; “Threads (this session)” is honest about session scope. |
| **Risks / gaps** | Presents as a live forum; refresh loses user-created threads. No moderation, search, or pagination. Error page links here as support — users may expect real help desk. |
| **Severity** | **medium** (expectation vs reality for “community”) |

---

## `/privacy` — Privacy policy

| Field | Detail |
|-------|--------|
| **Route** | `/privacy` |
| **Purpose** | Short privacy disclosure linked from sign-up. |
| **Key files** | `src/app/privacy/page.tsx`; `SiteHeader`, `SiteFooter` |
| **Data source** | Static JSX copy; `metadata.title`. |
| **Real vs stub** | **Honest stub:** explicitly states demo project, bcrypt-hashed credentials, no selling data, DB may reset. Matches actual auth storage model at a high level. Not a full legal policy. |
| **Risks / gaps** | Footer does not link to `/privacy` (only sign-in footer does). Fine for demo; insufficient for production launch. |
| **Severity** | **low** |

---

## `/terms` — Terms of service

| Field | Detail |
|-------|--------|
| **Route** | `/terms` |
| **Purpose** | Placeholder ToS so sign-up legal links resolve. |
| **Key files** | `src/app/terms/page.tsx`; `SiteHeader`, `SiteFooter` |
| **Data source** | Static JSX copy; `metadata.title`. |
| **Real vs stub** | **Explicit non-terms:** states no legal entity, demo DB can be wiped. Appropriate for current stage. |
| **Risks / gaps** | Same footer discoverability as privacy. Sign-up still says user agrees to “Terms & Privacy Policy” — legally lightweight but UX-complete for a preview. |
| **Severity** | **low** |

---

## `/onboarding` — First-run wizard

| Field | Detail |
|-------|--------|
| **Route** | `/onboarding` |
| **Purpose** | Four-step welcome: goal, pace, summary, deep-link to first lesson. |
| **Key files** | `src/app/onboarding/page.tsx` (single client component; inline `GOALS`, `PACES`, `FIRST_LESSON`) |
| **Data source** | Client state only (`useState` for step, `goalId`, `paceId`). `FIRST_LESSON` → `/curriculum/level-00-bits-logic/what-is-a-bit`. |
| **Real vs stub** | **UI real, persistence stub:** flow works in-browser. Step 4 greets **“Amine”** (hard-coded). Reminder time **8:00 PM** is display-only toggle area (no settings write). Copy promises tailored path and reminders — **not wired** to `profiles.pace` (DB default `"regular"` on sign-up only; see `schema.pg.ts`, `signUp` in `src/lib/auth/auth.ts`). **No route links to `/onboarding`** in `src/`. Skip goes to `/dashboard` without auth check. |
| **Risks / gaps** | Orphan page; post-sign-up goes to dashboard, not onboarding. Goal/pace choices lost on refresh. Misleading “we’ll tailor your path” vs implementation. |
| **Severity** | **medium** |

---

## `/signin` — Sign in / sign up

| Field | Detail |
|-------|--------|
| **Route** | `/signin` |
| **Purpose** | Email/password authentication and account creation. |
| **Key files** | `src/app/signin/page.tsx`; `src/app/signin/actions.ts`; `src/components/auth/auth-split-layout.tsx`; `src/lib/auth/auth.ts`, `src/lib/auth/session.ts` |
| **Data source** | Form → server actions `signInAction` / `signUpAction` → DB (`users`, `profiles`, `streaks` row on sign-up) → `setSessionCookie` → `redirect("/dashboard")`. |
| **Real vs stub** | **Real:** credentials auth, bcrypt, JWT session cookie, `keepSignedIn` passed to cookie helper. Client validation (email regex, password ≥6 sign-in/up). **Stub:** GitHub/Google buttons set `oauthNotice` only; left panel shows fixture user “Amine”, streak 12, lesson progress 62%. Footer note mentions “Supabase in production, SQLite here” — **may drift** from deploy config (architecture report: Postgres/SQLite dual layer). |
| **Risks / gaps** | OAuth UI looks production-ready but is inert (mitigated by inline notice). Marketing claims on split layout (“Your streak, XP and progress are waiting”) overstate DB-backed progress. No redirect to onboarding after sign-up. Password rules on sign-up (6 chars) **weaker** than reset flow (12 chars + complexity). No middleware — unauthenticated users can hit `/dashboard` URL from elsewhere (app-shell concern, but sign-in implies protected experience). |
| **Severity** | **medium** (OAuth stub + progress copy; auth core is real) |

---

## `/reset` — Password reset request

| Field | Detail |
|-------|--------|
| **Route** | `/reset` |
| **Purpose** | Collect email and simulate “reset link sent” UX. |
| **Key files** | `src/app/reset/page.tsx`; `AuthSplitLayout` |
| **Data source** | Client state only; default email `amine@example.com`. |
| **Real vs stub** | **Demo only:** submit sets `sent` flag; **no** server action, token, or email. Post-send UI explicitly offers navigation to `/reset/new-password` or `/reset/expired` for preview paths. Resend resets cooldown timer only. |
| **Risks / gaps** | Users may think reset worked for real accounts. No email existence check (good for privacy, but combined with fake send is confusing). OAuth hint on page points to non-functional OAuth on sign-in. |
| **Severity** | **high** if marketed as production auth; **low** with demo disclaimers (present on success state) |

---

## `/reset/expired` — Expired reset link

| Field | Detail |
|-------|--------|
| **Route** | `/reset/expired` |
| **Purpose** | Explain expired token and offer to request a new link. |
| **Key files** | `src/app/reset/expired/page.tsx`; `AuthSplitLayout` |
| **Data source** | Static UX; email field client-controlled; “Send a fresh link” → `router.push("/reset")` only. |
| **Real vs stub** | **Pure prototype** — no token validation, no backend. |
| **Risks / gaps** | Only reachable via demo button on `/reset` success state unless URL typed directly. |
| **Severity** | **low** (clearly ancillary to stub reset flow) |

---

## `/reset/new-password` — Set new password

| Field | Detail |
|-------|--------|
| **Route** | `/reset/new-password` |
| **Purpose** | Strong-password form and success state after “clicking email link.” |
| **Key files** | `src/app/reset/new-password/page.tsx`; `AuthSplitLayout` |
| **Data source** | Client state; `DEMO_EMAIL` constant; strength heuristics in component. |
| **Real vs stub** | **Stub:** submit sets `done` locally; **does not** update `users.passwordHash` or sign user in. Success navigates to `/dashboard` without session. Fixture streak copy (12-day). |
| **Risks / gaps** | **Security/product gap:** strongest password rules in the app are on a non-functional path, while live sign-up allows 6 characters. Direct URL access bypasses any token gate (there is no token). |
| **Severity** | **high** for auth completeness; **low** as labeled preview flow |

---

## `/streak-lost` — Streak reset modal page

| Field | Detail |
|-------|--------|
| **Route** | `/streak-lost` |
| **Purpose** | Full-screen “streak lost” recovery UX with optional streak-freeze toggle and CTA to a lesson. |
| **Key files** | `src/app/streak-lost/page.tsx`; `src/components/streak-lost-card.tsx`; `getAllLessons()` from `src/lib/content/lessons.ts` |
| **Data source** | Server: lesson list from MDX pipeline. Page constants `CURRENT_LEVEL = level-02-the-c-language`, `CURRENT_ORDER = 3` (matches `what-a-pointer-really-is.mdx`). Card shows hard-coded XP/concepts/badges and “12-day streak” copy. |
| **Real vs stub** | **Hybrid:** real lesson metadata for link title/time. **Stub:** all streak/XP/freeze counts; freeze toggle is local state only. **Logic gap:** `nextLesson = lessons[currentIndex]` uses the **same** lesson as “current” (order 3), not `lessons[currentIndex + 1]`, so “Next up” may repeat the pointer lesson instead of advancing. |
| **Risks / gaps** | No automatic trigger from app (no references in `src/` besides page itself) — manual/demo URL. Misleading “next lesson” index bug. |
| **Severity** | **medium** |

---

## `error.tsx` — Route segment error UI

| Field | Detail |
|-------|--------|
| **Route** | App Router error boundary (non-root segments) |
| **Purpose** | Recoverable error UX with retry and navigation. |
| **Key files** | `src/app/error.tsx` |
| **Data source** | Next.js `error` / `reset` props; optional `error.digest` in terminal-style block. |
| **Real vs stub** | **Real boundary** (client component). Copy claims account/progress untouched — reasonable for render errors, not authoritative. Links: `/`, `/dashboard`, `/signin`, `/community`. |
| **Risks / gaps** | Themed page without root layout failure path (see `global-error.tsx`). Community link for “keeps happening” goes to stub forum. |
| **Severity** | **none** |

---

## `not-found.tsx` — 404 page

| Field | Detail |
|-------|--------|
| **Route** | Global 404 |
| **Purpose** | Brand-consistent missing-page recovery. |
| **Key files** | `src/app/not-found.tsx` |
| **Data source** | Static UI; command palette via `window.dispatchEvent(new CustomEvent("ascend:open-palette"))` (depends on root layout `CommandPalette`). |
| **Real vs stub** | **Real** 404 handling. **Fixture** footer line “Your 12-day streak is safe.” Quick links to curriculum, practice, achievements, community. |
| **Risks / gaps** | Primary CTA “Back to dashboard” for anonymous users may feel wrong; palette event fails silently if layout not mounted. |
| **Severity** | **low** |

---

## `global-error.tsx` — Root layout failure

| Field | Detail |
|-------|--------|
| **Route** | Root error boundary |
| **Purpose** | Last-resort UI when root layout throws. |
| **Key files** | `src/app/global-error.tsx` |
| **Data source** | Inline styles only; own `<html>` / `<body>`. |
| **Real vs stub** | **Real** minimal fallback; intentionally unstyled (no guaranteed CSS/fonts). `reset()` only recovery. |
| **Risks / gaps** | Rare path; acceptable for v1. |
| **Severity** | **none** |

---

## Domain summary — Marketing & Auth

### What’s solid

- **Homepage and legal pages** are cohesive, polished RSC/marketing shell with accurate high-level curriculum stats (24 lessons, 4 levels) and working deep links into real MDX routes.
- **Email/password auth is real end-to-end** for sign-in and sign-up (`signin/actions.ts` → DB + session cookie → dashboard redirect), with candid privacy/terms copy for a demo deployment.
- **Auth-adjacent UX polish** is consistent (`AuthSplitLayout`, reset/streak/error theming) and several surfaces **label** preview behavior (OAuth notice, reset email disclaimer).

### What’s fake or disconnected

- **Community**, **password reset** (all three routes), and **streak-lost** gamification are prototypes — no persistence, tokens, or email.
- **Onboarding** is a complete wizard but **unlinked** and **non-persistent**; sign-up does not consume goal/pace/reminders.
- **Marketing and auth chrome** repeatedly show **Amine / 12-day streak / Level 8** fixture narratives while README states progress is not wired per user.

### Top 3 risks

1. **Product copy vs implementation (homepage, sign-in, onboarding):** “Progress saves as you go,” tailored path, and “streak/XP waiting” imply saved learner state that the platform defers — trust and retention risk (**medium**, cross-cutting with Agent L/C).
2. **Password reset appears in the auth funnel but does not reset passwords:** `/reset` → `/reset/new-password` can send users to dashboard without changing credentials or establishing a session (**high** for anyone treating auth as production-ready).
3. **Fragmented “start” journey:** Homepage/header CTAs point at Level 02 pointer lesson; onboarding starts at `what-is-a-bit`; `/onboarding` is unreachable from navigation; OAuth buttons look real until clicked (**medium** UX/consistency).

---

*Agent M — Wave 2 complete. Ready for synthesis in `99-MASTER-PROJECT-REPORT.md`.*
