# Sectioned Settings (GitHub-style)

**Date:** 2026-09-25  
**Status:** Implemented  
**Routes:** `/settings`, `/settings/account`, `/settings/preferences`, `/settings/appearance`

## Goal

Stop the one-page mega-form. One section per URL — student isn’t overwhelmed; deep links work.

## IA

| Nav label | Path | Content |
|-----------|------|---------|
| Public profile | `/settings` | Name, username, bio · PlaceholderAvatar note |
| Account | `/settings/account` | Email (read-only) · Sign out · Danger zone (bottom) |
| Preferences | `/settings/preferences` | Daily pace · Reminder · Notification toggles |
| Appearance | `/settings/appearance` | Light / Dark / System (live `ascend-theme`) |

## Layout

- Shell: `HUB_MAIN` + `HUB_CONTENT` (1200)
- Left sticky nav (desktop); horizontal scroll chips on small screens
- Main: `max-w-[720px]` — one section title + short description + form
- Save only on panes that persist profile fields (profile, preferences). Appearance applies immediately. Account sign-out / danger are actions, not a big save.

## Out

- Accent picker, purple chrome, XP/badge theater copy
- Single scrolling page with all sections

## Acceptance

- [x] Each nav item loads only its section
- [x] Default `/settings` = public profile
- [x] Danger zone only on Account, below the fold of that page
- [x] Phosphor tokens throughout
