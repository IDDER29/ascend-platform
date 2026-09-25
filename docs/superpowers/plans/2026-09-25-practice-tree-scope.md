# Practice tree + scope Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add drill-in Practice routes Path → section → lesson with section scope, keeping Due primary on `/practice`.

**Architecture:** Server-rendered path/section pages from existing outlines; extend `PracticeScope` with `section`; thin client session starter reused from Practice home; home path rows navigate into the tree.

**Tech Stack:** Next.js App Router, React, Phosphor, existing practice SM-2/session.

## Global Constraints

- Phosphor; hub 960; Due primary on home
- Tree = curriculum outlines (section = branch)
- No format filters / weak deck / personal cards
- Prefer due-in-scope then shuffle; no filler outside scope
- Client-safe data only in client bundles

## File map

| File | Role |
|------|------|
| `src/lib/practice/tree.ts` (or similar) | Client-safe path/section/lesson tree + keys |
| `src/lib/practice/session.ts` | `section` scope in `questionsForScope` / labels |
| `src/app/(learner)/practice/[pathSlug]/page.tsx` | Path branches |
| `src/app/(learner)/practice/[pathSlug]/[sectionId]/page.tsx` | Section lessons |
| `src/components/practice/*` | Path/section panels + session entry |
| `src/components/practice/practice-home.tsx` | Due + path links |
| Spec | status |

---

### Task 1: Tree helpers + section scope

- [ ] Build `practiceTree` from outlines without `node:fs` in client (server module OK for pages; export pure mappers)
- [ ] Add `{ type: "section"; pathSlug; sectionId }` to `PracticeScope`
- [ ] `questionsForScope` filters by section lesson keys
- [ ] Unit tests for section filter
- [ ] Spec → Implementing
- [ ] Commit: `feat(practice): section scope and practice tree helpers`

### Task 2: Path + section pages

- [ ] `/practice/[pathSlug]` — Study path + section list + due hints
- [ ] `/practice/[pathSlug]/[sectionId]` — Study section + lesson Study
- [ ] Breadcrumbs; notFound for bad ids
- [ ] Wire Start into existing session client (extract or embed)
- [ ] Commit: `feat(practice): path and section drill-in pages`

### Task 3: Home desk + verify

- [ ] Home path rows navigate to `/practice/[pathSlug]` (primary)
- [ ] Keep Due band; trim redundant inline path Start if it fights drill-in
- [ ] Spec Done; tsc; smoke Due + Foundations path → section → lesson session
- [ ] Commit: `feat(practice): home links into practice tree`

---

## Spec coverage

| Requirement | Task |
|-------------|------|
| Section scope + tree data | 1 |
| Drill-in pages | 2 |
| Home Due + navigate | 3 |
