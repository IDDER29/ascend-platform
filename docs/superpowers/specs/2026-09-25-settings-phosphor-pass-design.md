# Settings Phosphor pass

**Date:** 2026-09-25  
**Status:** Implemented  
**Route:** `/settings`

## Goal

Bring Settings into Phosphor: tokens only, no purple, honest appearance controls.

## Changes

1. Replace hard hex / purple gradients with Phosphor tokens (`ink`, `elevated`, `divider`, `brand-violet`, `xp-*`, `paper`).
2. Inputs + focus rings: brand green, not purple.
3. Toggle on = brand green; Save = shared `Button` primary.
4. Selected pace / theme chips: brand / xp border, not magenta.
5. Avatar → `PlaceholderAvatar` (drop purple wash + fake upload chrome emphasis).
6. Remove accent color picker from UI (stop offering non-Phosphor accents).
7. Appearance: Light/Dark apply via same `ascend-theme` localStorage + `.dark` class as sidebar `ThemeToggle`. Drop “dark isn’t built” badge. System option = follow `prefers-color-scheme` then clear stored preference or store `"system"` if we extend storage — prefer Light | Dark matching sidebar for v1, keep System as “match OS” by removing stored key.
8. Soften XP/badge copy in notifications / danger where we don’t award them.

## Non-goals

- New settings sections or backend fields.
- Wiring reset/delete account.
- Photo upload.

## Acceptance

- [ ] No purple hex / purple gradients on `/settings`.
- [ ] Theme Light/Dark actually toggles the app.
- [ ] No accent swatches.
- [ ] Save uses Phosphor primary button.
