# Practice study-desk layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reshape the Practice hub into a two-column study desk (Due + decks main; hit rate + recent rail) while keeping session/results and Anki-honest behavior unchanged.

**Architecture:** Widen `/practice` page shell to `HUB_CONTENT_CLASS`. Refactor `PracticeHub` in `practice-home.tsx` into main column + sticky `lg` rail. No new data layer.

**Tech Stack:** Next.js App Router, React client component, Tailwind, Phosphor tokens.

## Global Constraints

- Phosphor only (no purple; green/teal brand tokens)
- Due = miss queue only (`scope: due`); no filler in due sessions
- Hit rate labeled as correct÷seen — not a schedule
- Session + results stay `max-w-[640px]` centered
- No SM-2 / fake XP / streaks

---

### Task 1: Widen Practice page shell

**Files:**
- Modify: `src/app/(learner)/practice/page.tsx`
- Modify: `docs/superpowers/specs/2026-09-25-practice-study-desk-layout-design.md` (status → Implementing)

**Interfaces:**
- Consumes: `HUB_CONTENT_CLASS` from `@/components/ui/page-header`
- Produces: Practice page wraps content at `max-w-[1200px]`

- [x] Replace `HUB_NARROW_CLASS` with `HUB_CONTENT_CLASS` on the Practice page wrapper
- [x] Set spec status to Implementing
- [x] Smoke: page still renders header + hub

---

### Task 2: Study-desk hub layout

**Files:**
- Modify: `src/components/practice/practice-home.tsx` (`PracticeHub` only)

**Interfaces:**
- Consumes: existing `PracticeHub` props (`completed`, `waitingMisses`, `history`, `signedIn`, `onStart`)
- Produces: same callbacks; visual structure only

- [x] Wrap hub in `lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10 lg:items-start`
- [x] Main: Due band → Study by path → Pick lessons (current content/behavior)
- [x] Rail: Hit rate + Recent; `lg:sticky lg:top-8`; recent slice 5–8
- [x] `<lg`: natural stack order Due → Decks → Lessons → Hit rate → Recent
- [x] Keep Anki-honest CTAs and copy; no hit % on deck rows
- [x] `npx tsc --noEmit` clean

---

### Task 3: Spec done + verify

**Files:**
- Modify: `docs/superpowers/specs/2026-09-25-practice-study-desk-layout-design.md`

- [x] Mark spec Status Done
- [x] Confirm session/results still narrow (unchanged wrappers)
- [x] Manual check: `/practice` and `/practice?demo=1`
