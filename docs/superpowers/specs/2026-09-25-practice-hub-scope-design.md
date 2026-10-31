# Practice hub — review scope

**Date:** 2026-09-25  
**Status:** Implemented  
**Route:** `/practice` (Ready / hub outside the quiz)

## Goal

Let students choose **what** to review before Start: everything unlocked, one path, or a custom set of lessons — without turning every visit into a checkbox farm.

## Layout

1. **Hero** — primary **Review all unlocked** · misses waiting if any  
2. **By path** — card per path that has unlocked bank items (Foundations always; others when unlocked) · **Review path**  
3. **Custom** — “Choose lessons…” expands a checklist grouped by path · **Start with N**

## Session filter

`buildSession` accepts a scope:

- `all` — Foundations starter ∪ completed-lesson unlocks (current default)  
- `path:<slug>` — unlocked questions whose lesson maps to that path  
- `lessons: level/slug[]` — unlocked questions for selected lessons only  

Miss queue still prefers misses that fall inside the active scope.

## Honesty

- No XP / hearts / streak theater on the hub  
- Paths with zero unlocked questions are omitted (not “locked” gray theater)  
- Foundations remains the always-open starter  

## Out

- Separate `/practice/[path]` routes (v1 stays one page)  
- Spaced-rep intervals  
