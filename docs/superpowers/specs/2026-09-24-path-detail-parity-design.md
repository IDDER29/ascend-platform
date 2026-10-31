# Path detail pages — Foundations parity

**Date:** 2026-09-24  
**Status:** Implemented  
**Surface:** `/paths/[slug]` (non-foundations)

## Why Foundations looked different

`/paths/foundations` used `FoundationsDetail` (editorial header, Start band, topic cards, icons, aside). Every other slug used older `PathDetail` (flat header, Select button, numbered lesson lists).

## Approach

Bring **all other path pages** to the same editorial pattern via upgraded `PathDetail`:

- Header: breadcrumb, PathMarkRing, type meta, body, Start/Continue (live) or Soon panel
- Course map: one lifted card per course (title + blurb + lesson/project rows)
- Icons: FileText / CircuitBoard via `path-outline-marks.tsx`
- Aside: progress, Up next, prerequisite / all paths
- Soon paths: planned course cards + coming-soon CTA (no fake lesson rows)

Foundations keeps its custom outline sections (`foundations-outline.ts`); other live paths map **courses → cards** and **level lessons → rows**.

## Files

- `src/components/paths/path-detail.tsx` — rewritten
- `src/components/paths/path-outline-marks.tsx` — shared marks
- `src/app/(learner)/paths/[slug]/page.tsx` — pass completed / signedIn / continueHref
