# Phosphor Sign-In Design

**Date:** 2026-09-23  
**Status:** Approved for implementation  
**Related:** `docs/design/PHOSPHOR-THEME.md`, `docs/design/PHOSPHOR-LESSONS-AND-RUNBOOK.md`, **`docs/design/AUTH-PATH-COPY-PLAYBOOK.md`** (copy decisions & problem→solution log)

## Goal

Make `/signin` (and shared auth chrome) match Phosphor + honesty spine: account saves progress; curriculum stays open; no purple leftover; light/dark both work.

## Locked decisions

| Decision | Choice |
|----------|--------|
| Layout | Keep split (Approach A) |
| OAuth | Keep GitHub/Google **disabled** with persistent “Coming soon” — flip `OAUTH_ENABLED` later |
| Reset | Full UI flow (`/reset` → inbox → `/reset/new-password` → success, plus `/reset/expired`); flip `RESET_EMAIL_ENABLED` when email lands |
| Scope | Sign-in + rewrite `AuthSplitLayout` so reset pages inherit |
| Backends | No new OAuth / reset email |
| Left path card | Understanding **ladder** copy (`PATH_STEPS`), keep `00–03` list layout — see playbook |

## Visual

- **Left:** `bg-landing-ink` + green/gold washes; `brand-mark`; glass path card under subtitle
- **Right:** `bg-bg` / semantic form; mode tabs via xp tokens; inputs elevated/paper + card-border; CTA `Button` primary / brand-gradient
- **Dark:** All semantic; no `bg-white` / purple hex

## Copy

- Thesis: pick up where you left off; save completed lessons
- Path card (locked — detail in playbook):
  - Eyebrow: **The ascent**
  - Title: **Until the machine makes sense**
  - Rows: `00`–`03` + See / Understand / Control / Orchestrate + gains from `path-ladder.ts`
  - Footer: **Curriculum stays open. Signing in only saves what you've finished.**
  - No corner meta (`4 steps` / `bottom-up` removed)
- Forgot password: link to `/reset` UI (email gated by `RESET_EMAIL_ENABLED`)

## Files

- `src/components/auth/auth-split-layout.tsx`
- `src/components/auth/auth-styles.ts` (primitives)
- `src/components/auth/auth-oauth.tsx`
- `src/components/homepage/path-ladder.ts`
- `src/app/signin/page.tsx`, `signin-client.tsx`
- `src/app/reset/*`, `src/lib/auth/reset-flow.ts`

## Out of scope

Learner-app purple cleanup; wiring OAuth/reset email; changing post-login redirect.
