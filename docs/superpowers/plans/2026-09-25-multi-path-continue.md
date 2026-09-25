# Multi-path Continue Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox (`- [ ]`) syntax. Do **not** git commit unless the user asks (repo rule).

**Goal:** Following-based Your paths + Unselect, Continue hero from last completed lesson/project, path days from first lesson completion.

**Architecture:** Persist a following map cookie (`ascend_paths_following`). Pure helpers resolve Continue target path and path days from completions. Dashboard wires following list + last-work Continue; Select/Unselect server actions mutate following only.

**Tech Stack:** Next.js Server Actions, cookies, existing Drizzle progress queries, Phosphor UI.

## Global Constraints

- Select never moves Continue — only newer lesson/project completion does.
- Your paths = following only (not progress-alone).
- Path days = first completed lesson on that path; hide if none.
- Phosphor tokens only; no purple one-offs.
- Cookie writes only in Server Actions.
- No git commits unless user requests.

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/paths/selected-path.ts` | Following map CRUD; migrate from old single cookie; deprecate enter-tenure for dashboard |
| `src/lib/paths/actions.ts` | `unselectPathAction`; Select adds to following |
| `src/lib/dashboard/continue-target.ts` | `resolveContinuePathSlug`, `firstLessonCompletedAt`, `pathDaysFromCompletions`, map level→path |
| `src/lib/dashboard/tenure.ts` | keep formatters; dashboard stops using enter cookie for path days |
| `src/app/(learner)/dashboard/page.tsx` | Continue from last-work path; enrolledRows = following |
| `src/components/dashboard/learner-standing.tsx` | Your path(s) heading + Unselect |
| `docs/superpowers/specs/2026-09-25-multi-path-continue-design.md` | Status → Implemented |

---

### Task 1: Following cookie API

**Files:**
- Modify: `src/lib/paths/selected-path.ts`
- Modify: `src/lib/paths/actions.ts`

**Produces:**
- `getFollowingMap(): Promise<Record<string, Date>>`
- `isFollowing(slug): Promise<boolean>`
- `followPath(slug): Promise<void>` — add/update selectedAt (used by select)
- `unfollowPath(slug): Promise<void>`
- `getSelectedPathSlug()` → most recently selected among following (compat)
- `unselectPathAction(formData)`

- [x] **Step 1:** Replace enter-map–centric API with following map cookie `ascend_paths_following` = `encodeURIComponent(JSON.stringify({ [slug]: iso }))`. On read, if following empty and `ascend_selected_path` set, seed following with that slug.

- [x] **Step 2:** `setSelectedPathSlug` / select actions call `followPath`. Add `unselectPathAction` that unfollow + `revalidatePath('/dashboard')` + redirect dashboard or stay.

- [x] **Step 3:** `./node_modules/.bin/tsc --noEmit` passes.

---

### Task 2: Continue-target + path-days helpers

**Files:**
- Create: `src/lib/dashboard/continue-target.ts`

**Produces:**
- `pathSlugForLevel(level: string): string | null`
- `pathSlugForLesson(level, slug): string | null` (level membership)
- `resolveContinuePathSlug({ completed, shellforgePassedAt?, paths }): string | null`
- `earliestLessonCompletedAt(path, completed): Date | null`
- `pathDaysOnPath(path, completed, now): number | null`

- [x] **Step 1:** Implement helpers (pure). Last work = max `completedAt` among lessons; if newest Shellforge `passed` submission is newer, use Foundations path containing shellforge course (`systems` / whichever path owns `/projects/shellforge`).

- [x] **Step 2:** Verify with a short `node --import tsx` or inline assert script, or tsc-only if no runner — prefer small assert in shell importing compiled logic via `npx tsx -e '...'`.

---

### Task 3: Dashboard wire-up

**Files:**
- Modify: `src/app/(learner)/dashboard/page.tsx`
- Modify: `src/components/dashboard/learner-standing.tsx`
- Modify: `src/components/dashboard/continue-home.tsx` (pass-through only if needed)

- [x] **Step 1:** Continue `path` = `getPathBySlug(resolveContinuePathSlug(...)) ?? foundations`. Path days from `pathDaysOnPath` (not enter cookie / account fallback).

- [x] **Step 2:** `enrolledRows` = following slugs only; Active when row.slug === continue path slug; days from first lesson.

- [x] **Step 3:** Panel title Your path / Your paths; Unselect form button per row calling `unselectPathAction`.

- [x] **Step 4:** tsc + manual sanity on `/dashboard`.

---

### Task 4: Spec status

- [x] Mark design spec Status: Implemented.
- [x] Update student-continue dashboard tenure bullets to match (first lesson; following).

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| Following set + Select | 1 |
| Unselect hides | 1, 3 |
| Continue = last lesson/project | 2, 3 |
| Days from first lesson | 2, 3 |
| Plural Your paths | 3 |
| Outline ≠ Select | already pathHref; keep |
| Migration old cookie | 1 |
