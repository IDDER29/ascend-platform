# Sign in (2026-10-30)

The sign-in page moves into the public site's shell and the Coach look (old page kept at `/signinv1`).

- One form, two modes (`/signin`, `/signin?mode=signup`), switched by a segmented control that keeps `?next=`.
- Beside it, what an account adds: Today page, Practice on every device, the streak, a profile. Lessons stay open without one.
- Errors: each field says what's wrong after a submit attempt, and the first wrong field gets focus; server errors ("Invalid email or password.") show above the button. A real checkbox for "Keep me signed in". The OAuth placeholders are gone until OAuth exists.
- Where you go next: signing in → `?next=` if it's a page on this site (`safeNextHref`, tested), otherwise Today. Creating an account → `/onboarding` to pick a daily goal, then the first lesson.

## Onboarding and password reset (same day)
- **Onboarding** (`/onboarding`, old at `/onboardingv1`): one screen, two real choices — where to start (Foundations or Systems Programmer, which joins that path) and the daily goal (saved to the account and this browser) — then the path's first lesson. The old page's goal question (never stored) and "remind me at 8:00 PM" (no reminders exist) are gone.
- **Password reset** (`/reset`, `/reset/new-password`, `/reset/expired`; old at `/resetv1/...`): while `RESET_EMAIL_ENABLED` is false, `/reset` and the new-password page say plainly that email reset isn't available and what to do instead, and the actions refuse. When it's switched on, the request → check inbox (resend timer) → new password → done flow is ready; the server still needs tokens and email (TODOs in `src/lib/auth/reset-actions.ts`).
- One password rule: `MIN_PASSWORD_LENGTH` (6) in `reset-flow.ts`, used by sign-up, the forms and reset (reset used to demand 12).
