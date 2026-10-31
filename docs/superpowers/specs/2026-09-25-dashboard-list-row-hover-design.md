# Dashboard list row hover — Continue home

**Date:** 2026-09-25  
**Status:** Implemented  
**Route:** `/dashboard` (Work section)

## Goal

Every tappable list row under the Continue band feels clickable on hover, with one quiet shared grammar. No card lift / shadow / scale.

## Scope

| Surface | File |
|---------|------|
| Up next rows (incl. first) | `continue-home.tsx` |
| Your path rows | `learner-standing.tsx` (`EnrolledPathsPanel`) |
| Recent project link rows | `continue-home.tsx` |

## Hover grammar

- Fill: soft `bg-elevated` bump via `transition-colors`
- Chevron (when present): `ink-fainter` → `ink` on group hover
- First Up next: resting tonal surface stays; hover still darkens slightly so it isn’t dead
- No translate, shadow, scale, or brand-violet title flash

## Out of scope

Continue band CTAs, pulse chips, “Full path” / “All” text links.
