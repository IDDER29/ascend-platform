# Multi-path Continue — following, last-work hero, honest tenure

**Date:** 2026-09-25  
**Status:** Implemented  
**Routes:** `/dashboard`, `/paths`, path detail  
**Related:** `2026-09-24-student-continue-dashboard-design.md`  
**Plan:** `docs/superpowers/plans/2026-09-25-multi-path-continue.md`

## Problem

“Your path” implies one path, but learners can follow several. Continue must stay **one** next step. Path “days” must not be gameable by selecting early and waiting.

## Goals

1. Support multiple **followed** paths on Continue home (`Your paths` when 2+).
2. Keep Continue / Up next / mastery on a **single** path — the one with the most recent completed lesson or project.
3. Explicit **Select** / **Unselect**; browsing never commits.
4. Path tenure days from **first completed lesson** on that path only.

## Non-goals

- Parallel Continue bands or “pick a path” every load.
- Switching Continue on Select alone.
- Tenure from cookie enter time or account age (for path days).
- Fake enrollment without Select (progress alone does not put a path in Your paths).

## Concepts

| Concept | Meaning |
|---------|---------|
| **Following** | Opt-in set of path slugs (persisted). Powers **Your paths**. |
| **Selected-at** | Per followed slug, when the user last selected it (for unselect fallback order). |
| **Last work** | Most recent **completed** lesson or project (Shellforge / path project completion), with its path. |
| **Continue target** | Path of last work (see resolution below). Drives Continue band, Up next, level mastery, pulse path %. |
| **Path days** | Calendar days since **first completed lesson** on that path (day 1 = that calendar day). No lesson done → no day caption. |

## Continue target resolution

1. Among all lesson and project completions that map to a catalog path, take the **most recent** by `completedAt` (or equivalent).
2. That path is the Continue target — whether or not it is currently followed.
3. If no completions anywhere → Foundations start / guest Continue (current empty behavior).

**Select never moves Continue.** Only a newer lesson/project completion does.

**Your paths** is independent: unfollowed last-work path can still drive the hero, but it does not appear in the aside until Select again. That avoids a blank Continue after Unselect.

## Your paths aside

- Eyebrow: `Path` / `Paths` with heading **Your path** (1) or **Your paths** (2+ followed).
- Rows = following only (not “has progress”).
- **Active** mark = followed path that equals the Continue target (last work on that path). If Continue target is not followed, no aside row is Active.
- Row click → path outline only (`pathHref`). No select side effect.
- Per row: quiet **Unselect**. **Select** stays on `/paths` / path detail (existing actions).
- List order: most recently selected first.
- Unselect: remove from following. Continue target unchanged (still last work).

## Select / Unselect

| Action | Effect |
|--------|--------|
| **Select** | Add slug to following; stamp `selectedAt`. Redirects as today (outline or start) via existing server actions. Does **not** change Continue target. |
| **Unselect** | Remove slug from following. Clear its selectedAt. Hide from Your paths. Continue unchanged unless we need empty following UX only (Continue still last work). |

Persist following + selectedAt in a cookie map (or DB later). Replace single `ascend_selected_path` as the sole source of truth with:

- `ascend_paths_following`: `{ [slug]: selectedAtISO }`
- Optional: keep `ascend_selected_path` as denormalized “most recently selected” for backward compat during migration, or derive max(selectedAt).

Path-enter cookie (`ascend_path_entered`) is **not** used for tenure. May be removed from dashboard tenure reads.

## Tenure (anti-trick)

```
pathDays(path) =
  if no completed lesson on path → null (hide caption)
  else daysOnSince(earliest completedAt among lessons on that path)
```

Projects may count as last-work for Continue target; **day clock starts at first lesson completion** (not project-only), so a project-only stamp doesn’t invent “days on path” without lesson proof. If product later wants project-first paths, revisit.

Account header “Day N on Ascend” unchanged (`users.createdAt`).

## UI copy

- Continue band path tenure caption: only when `pathDays != null`.
- Your paths row meta: same day string when known.
- Unselect control: text button or menu “Unselect” — confirm not required for v1 (one click).

## Data dependencies

- Completions: existing `listCompletedLessons` (+ project submissions with pass/completed for last-work).
- Map completion → path via catalog course/level membership (existing `pathHasProgress` / lessons-on-path helpers).
- Following cookie read in RSC; write only in Server Actions (`selectPathAction`, new `unselectPathAction`).

## Migration

- On first read: if old `ascend_selected_path` set and following empty → seed following with that slug + now.
- Existing progress without following: does **not** auto-follow (honest Select). Continue still uses last work so returning learners keep a sensible hero.

## Acceptance

- [ ] Two followed paths → heading **Your paths**; both listed.
- [ ] Unselect removes row; Select on `/paths` adds it back without moving Continue until a new completion on some path.
- [ ] Completing a lesson on path B moves Continue to B (Up next + mastery for B).
- [ ] Path days absent until first lesson completed; then stable from that date; selecting early does not start the clock.
- [ ] Outline link does not Select or change Continue.
- [ ] Guest / no completions: existing start Continue; no fake days.

## Open for implementation plan (not blocking spec)

- Exact Unselect control placement (row hover vs always-visible).
- Project completion alone (no lessons on that path) **can** be Continue target; path days stay lesson-based (null until first lesson).
