# Auth funnel flows (Agent AUTH)

**Date:** 2026-09-22  
**Agent:** AUTH — sign-up, sign-in, OAuth stubs, password-reset demotion  
**Method:** Read-only code trace (no app edits)  
**Orchestration:** [00-FLOW-ORCHESTRATION.md](./00-FLOW-ORCHESTRATION.md)

## Summary

| Journey | Status | One-line verdict |
|---------|--------|------------------|
| Sign-up (create account) | **Pass** | Real DB user + profile + streak row; JWT session cookie; redirect `/dashboard`. |
| Sign-in (credentials) | **Pass** | bcrypt verify; same session + redirect as sign-up. |
| Sign-out | **Pass** | Clears `ascend_session`; redirect `/signin` from profile only. |
| OAuth (GitHub / Google) | **Gap** | Buttons are UI-only; inline notice after click. |
| Password reset (`/reset*`) | **Gap** | Demoted demo; no email, token, or `passwordHash` update; success does **not** open dashboard or session. |

**Overall auth funnel:** **Pass** for email/password session auth; **Gap** for OAuth and reset (intentionally stubbed with mixed pre-submit copy honesty).

---

## 1. Sign-up — Create account

**Intent:** New learner registers with name, email, password and lands in the app shell with a persisted session.

### Steps

1. User opens `/signin` and toggles **Create account** (`mode === "signup"`).
2. Client validates name non-empty, email regex, password ≥ 6, confirm matches (`src/app/signin/page.tsx`).
3. Form posts to server action `signUpAction` (`src/app/signin/actions.ts`).
4. Server re-checks confirm match; calls `signUp({ name, email, password })` (`src/lib/auth/auth.ts`).
5. `signUp` inserts `users` (bcrypt hash), `profiles` (unique username slug), `streaks`; throws `AuthError` on duplicate email or validation failure.
6. `setSessionCookie(userId, keepSignedIn)` writes httpOnly JWT cookie `ascend_session` (`src/lib/auth/session.ts`).
7. `redirect("/dashboard")`.

### Entry / exit

| | |
|---|---|
| **Entry** | `/signin` (signup tab), links from marketing/header |
| **Exit** | `/dashboard` on success; stays on `/signin` with error banner on failure |

### Code path

- UI: `src/app/signin/page.tsx`
- Actions: `src/app/signin/actions.ts` → `signUpAction`
- Auth: `src/lib/auth/auth.ts` → `signUp`
- Session: `src/lib/auth/session.ts` → `setSessionCookie`, `createSessionToken` (30d JWT, `maxAge` when “keep signed in”)

### Status: **Pass**

### Honesty notes

- Footer on sign-in page states real local/Postgres accounts and that OAuth is not wired — aligned with code.
- Sign-up password minimum is **6 characters**; reset stub UI requires **12 + complexity** — inconsistent product rules, not a broken sign-up path.
- No post-sign-up onboarding redirect; user goes straight to dashboard (design choice, not auth failure).
- No route middleware: dashboard is reachable without session (A+Open); sign-up still establishes a real session when DB is up.

---

## 2. Sign-in — Credentials → session → landing

**Intent:** Returning user authenticates and continues in the app with the same session mechanism as sign-up.

### Steps

1. User opens `/signin` (default **Sign in** mode).
2. Client validation: email regex, password ≥ 6.
3. Form posts to `signInAction` (`src/app/signin/actions.ts`).
4. `signIn({ email, password })` loads user by email, `bcrypt.compare` on `passwordHash` (`src/lib/auth/auth.ts`); generic error on miss.
5. `setSessionCookie(userId, keepSignedIn)`.
6. `redirect("/dashboard")`.

### Entry / exit

| | |
|---|---|
| **Entry** | `/signin`, topbar/profile CTAs when logged out |
| **Exit** | `/dashboard` on success; `/signin` with error on failure |

### Code path

- `src/app/signin/page.tsx` → `signInFormAction`
- `src/app/signin/actions.ts` → `signInAction`
- `src/lib/auth/auth.ts` → `signIn`
- `src/lib/auth/session.ts` → cookie + JWT verify path used later by `getSessionUserId`

### Session consumption after landing

- `(app)` layout loads `getCurrentUser()` → reads cookie, loads user + profile (`src/app/(app)/layout.tsx`, `src/lib/auth/auth.ts`).
- Dashboard uses `user` for streak, continue lesson, stats; when `user` is null, shows open-path/demo stats (`src/app/(app)/dashboard/page.tsx`).
- Progress mutations require session: `markLessonCompleteAction` returns `"Sign in to save lesson progress."` if no user (`src/lib/progress/actions.ts`).

### Status: **Pass**

### Honesty notes

- Split-layout marketing (“Your streak, XP and progress are waiting”) is decorative fixture data, not loaded from DB on the auth page.
- **Forgot password** on sign-in is demoted: static “Forgot? (not available)” with tooltip — no link to `/reset` from sign-in (`src/app/signin/page.tsx`). Users must know `/reset` URL or docs.
- If `db` is null, `signIn`/`signUp` throw user-facing `AuthError` from `requireDb()` — no silent success.

---

## 3. Sign-out

**Intent:** End session and return to sign-in.

### Steps

1. Signed-in user opens `/profile`.
2. Submits form bound to server action `signOutAction` (`src/lib/auth/actions.ts`).
3. `clearSessionCookie()` deletes `ascend_session` (`src/lib/auth/session.ts`).
4. `redirect("/signin")`.

### Entry / exit

| | |
|---|---|
| **Entry** | Profile page logout control (only when `user` from layout is truthy) |
| **Exit** | `/signin` |

### Code path

- `src/app/(app)/profile/page.tsx` (form → `signOutAction`)
- `src/lib/auth/actions.ts`
- `src/lib/auth/session.ts` → `clearSessionCookie`

### Status: **Pass**

### Honesty notes

- **Gap (discoverability):** No sign-out in `AppTopbar` / sidebar grep — only profile. Session can also expire via JWT/cookie lifetime without explicit sign-out.
- After sign-out, `(app)` routes remain URL-accessible without middleware; user appears logged out in chrome via `getCurrentUser() === null`.

---

## 4. OAuth — GitHub / Google buttons

**Intent:** Social sign-in (not implemented in this preview).

### Steps

1. User clicks **GitHub** or **Google** on `/signin`.
2. `onClick` sets `oauthNotice` true — **no** navigation, **no** server call, **no** OAuth provider (`src/app/signin/page.tsx` lines 138–157).
3. Banner: “OAuth isn't wired up in this preview — continue with email below instead.”

### Entry / exit

| | |
|---|---|
| **Entry** | `/signin` OAuth row |
| **Exit** | Same page; user must use email form |

### Code path

- `src/app/signin/page.tsx` only (no OAuth routes or callbacks in repo trace)

### Status: **Gap**

### Honesty notes

- **Pass (mitigated):** Notice appears after click; footer mentions OAuth not wired.
- **Gap (severity medium):** Buttons look fully functional (brand icons, equal weight to email). Reset page still advises “Signed up with GitHub or Google? Use that button on the sign-in page” (`src/app/reset/page.tsx`) — misleading because those buttons do nothing.

---

## 5. Password reset demotion — `/reset`, `/reset/new-password`, `/reset/expired`

**Intent:** Password-recovery UX exists as **UI prototype**; must not change passwords or grant dashboard access pretending success.

### 5a. Request reset — `/reset`

#### Steps

1. User submits email on `/reset` — client-only `submit` sets `sent = true`; **no** server action, email API, or DB lookup (`src/app/reset/page.tsx`).
2. Success UI states explicitly: demo only, no email sent, no password change from this flow.
3. Optional: “Preview the stub new password UI” → `/reset/new-password`; “Back to sign in” → `/signin`.
4. Resend only resets client cooldown timer.

#### Entry / exit

| | |
|---|---|
| **Entry** | Direct URL `/reset` (not linked from sign-in forgot line) |
| **Exit** | `/signin`, `/reset/new-password`, or stay on success state |

#### Code path

- `src/app/reset/page.tsx`

#### Status: **Gap**

#### Honesty notes

- **Pass on success state:** Clear demo disclaimers.
- **Gap before submit:** Copy promises “we'll send a secure link” / “Send reset link” without inline demo label on the initial form — honesty improves only after submit.

---

### 5b. Set new password — `/reset/new-password`

#### Steps

1. Page is reachable without token query (no gate).
2. User fills strength rules (12 chars, mixed case, number+symbol); submit sets local `done = true` — **no** call to `auth.ts`, **no** `users.passwordHash` update, **no** `setSessionCookie`.
3. Success screen title **“Demo complete”**; copy: “No password was changed — this page is a UI stub.”
4. Primary CTA: **Back to sign in** → `/signin` only (`router.push("/signin")`).
5. Submit button label on form: “Reset password & sign in” — **does not** sign in or redirect to dashboard.

#### Entry / exit

| | |
|---|---|
| **Entry** | Direct URL, or demo button from `/reset` success |
| **Exit** | `/signin` (success); never `/dashboard` with new session from this flow |

#### Code path

- `src/app/reset/new-password/page.tsx`

#### Status: **Gap** (stub by design; **Pass** on security/honesty spine item #6 in fix-program verification)

#### Honesty notes

- **Pass:** Cannot silently succeed into session or DB password change (verified against `99-VERIFICATION.md` matrix).
- **Gap:** Form CTA “Reset password & sign in” overpromises — only toggles local success state; user must sign in manually with **old** password.
- Left-panel copy on success still says “Your password is updated” in `AuthSplitLayout` props while body says stub — minor split-layout inconsistency.

---

### 5c. Expired link — `/reset/expired`

#### Steps

1. Static expired-link UX; email field is client state only.
2. “Send a fresh link” → `router.push("/reset")` — no backend.

#### Entry / exit

| | |
|---|---|
| **Entry** | Direct URL (not linked from `/reset` success in current code) |
| **Exit** | `/reset` or `/signin` |

#### Code path

- `src/app/reset/expired/page.tsx`

#### Status: **Gap** (prototype only; **Pass** as non-deceptive if treated as demo URL)

---

## Cross-cutting mechanics

| Concern | Behavior | Files |
|---------|----------|--------|
| Session cookie | `ascend_session`, HS256 JWT, `sub` = user id, 30d exp; httpOnly, `sameSite: lax` | `src/lib/auth/session.ts` |
| Keep signed in | `maxAge` 30 days when true; session cookie (no maxAge) when false | `signin/actions.ts`, `session.ts` |
| Current user | Never throws; null if no/invalid cookie or missing profile | `src/lib/auth/auth.ts` → `getCurrentUser` |
| Auth errors | `AuthError` messages surfaced in sign-in/up actions | `auth.ts`, `signin/actions.ts` |
| Middleware | **None** — no edge redirect to `/signin` | (absent) |

---

## Honesty breaks (tagged)

| ID | Severity | Issue | Evidence |
|----|----------|-------|----------|
| H-AUTH-1 | medium | OAuth buttons look live; reset page points users to them | `signin/page.tsx`, `reset/page.tsx` |
| H-AUTH-2 | low | `/reset` pre-submit copy implies real email send | `reset/page.tsx` (mitigated post-submit) |
| H-AUTH-3 | low | New-password submit CTA says “sign in” but only shows demo complete → manual sign-in | `reset/new-password/page.tsx` |
| H-AUTH-4 | low | Auth split panels use fixture streak/level copy unrelated to session | `signin/page.tsx`, `reset/new-password/page.tsx` |

---

## File index (required citations)

| File | Role |
|------|------|
| `src/app/signin/actions.ts` | `signInAction`, `signUpAction`, session + redirect |
| `src/lib/auth/auth.ts` | `signUp`, `signIn`, `getCurrentUser`, `AuthError` |
| `src/lib/auth/session.ts` | JWT create/verify, `setSessionCookie`, `clearSessionCookie`, `getSessionUserId` |
| `src/app/signin/page.tsx` | Sign-in/up UI, OAuth stub, validation |
| `src/lib/auth/actions.ts` | `signOutAction` |
| `src/app/reset/page.tsx` | Reset request demo |
| `src/app/reset/new-password/page.tsx` | New password stub |
| `src/app/reset/expired/page.tsx` | Expired link prototype |

---

## Agent AUTH sign-off

Email/password **sign-up** and **sign-in** paths are **Pass** end-to-end when the database is reachable. **Sign-out** works from profile. **OAuth** and **password reset** are **Gap** (stubs/demotion) with explicit demo copy on reset success and new-password completion; they do **not** grant dashboard access or change stored passwords. No **Broken** flows found in this trace for core credential auth.
