# Sign in (2026-10-30)

The sign-in page moves into the public site's shell and the Coach look (old page kept at `/signinv1`).

- One form, two modes (`/signin`, `/signin?mode=signup`), switched by a segmented control that keeps `?next=`.
- Beside it, what an account adds: Today page, Practice on every device, the streak, a profile. Lessons stay open without one.
- Errors: each field says what's wrong after a submit attempt, and the first wrong field gets focus; server errors ("Invalid email or password.") show above the button. A real checkbox for "Keep me signed in". The OAuth placeholders are gone until OAuth exists.
- Where you go next: signing in → `?next=` if it's a page on this site (`safeNextHref`, tested), otherwise Today. Creating an account → `/onboarding` to pick a daily goal, then the first lesson.
