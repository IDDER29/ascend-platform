# Thin Profile — identity + account

**Date:** 2026-09-25  
**Status:** Implemented  
**Route:** `/profile`  
**Related:** Continue home (`/dashboard`), Settings (`/settings`)

## Why it exists

Continue = *what do I do next?*  
Profile = *who am I, and how do I manage the account?*

Profile must not duplicate Continue (no Resume CTA, path bars, mastery, streak cockpit).

## Goals

1. Phosphor paper hub — no purple gradient hero.
2. Identity: avatar, display name, @username, account tenure when signed in.
3. Account actions: Settings, Sign out / Sign in.
4. Optional quiet link to Progress (lesson count only) — not a progress dashboard.

## Non-goals

- Second Continue band or “Continue: {lesson}” primary CTA.
- Path / level progress lists (Continue, Paths, Progress own those).
- Fake XP, badges, “4 levels in path” theater.
- Slash breadcrumb eyebrow.

## Layout

- `HUB_MAIN_CLASS` + `HUB_CONTENT_CLASS` (1200).
- `PageHeader` for name + mono description (`@user` · Day N on Ascend, or guest copy).
- `PlaceholderAvatar` near header (same pattern as sidebar).
- Action buttons: Settings, Sign out (or Sign in). Drop Share for v1 unless already wired usefully — prefer drop if it only copies a weak URL.
- One quiet line: `{n} lessons completed` → `/progress` when signed in; omit or “Sign in to track” when guest.

## Visual

- Tokens only (`ink`, `elevated`, `brand-violet` for links). No `#1B1730` / purple blobs.
- Cards only if needed for interaction grouping; prefer open paper + hairline actions.

## Acceptance

- [ ] No purple hero; matches Paths/Continue paper stage.
- [ ] No Continue CTA / level progress card.
- [ ] Signed-in: name, @, tenure, Settings, Sign out, lessons → Progress.
- [ ] Guest: Guest title, sign-in path, no fake stats.
