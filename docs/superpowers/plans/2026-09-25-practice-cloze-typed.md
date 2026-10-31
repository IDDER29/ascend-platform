# Practice cloze + typed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add handcrafted cloze and typed items to the mixed Practice queue with hybrid grading (normalize → Good; miss → Again/Hard).

**Architecture:** Extend `PracticeItem` union; pure `normalizeAnswer` / `answersMatch`; shared produce UI branch in session; seeds in dedicated bank files; existing shuffle + SM-2 unchanged.

**Tech Stack:** TypeScript, Next.js, React, Phosphor, `npx tsx --test`.

## Global Constraints

- Phosphor only — no purple; no XP/streaks/mastery claims
- Mixed shuffled session — no mode picker
- Hybrid: hit → good; miss → reveal + again|hard only (no Good after reveal)
- Handcrafted seeds only; single `{{blank}}` per cloze
- MCQ / flashcard behavior unchanged

## File map

| File | Role |
|------|------|
| `src/lib/practice/types.ts` | TypedItem, ClozeItem |
| `src/lib/practice/normalize.ts` (+ test) | normalize + match |
| `src/lib/practice/bank-typed.ts` | typed seeds |
| `src/lib/practice/bank-cloze.ts` | cloze seeds |
| `src/lib/practice/bank.ts` | compose into PRACTICE_BANK |
| `src/components/practice/practice-home.tsx` | produce panel |
| `src/lib/practice/demo.ts` / sampleSession | demo ids |
| Spec status | design doc |

---

### Task 1: Types + normalize helpers + bank seeds

**Files:** types, normalize(+test), bank-typed, bank-cloze, bank.ts, spec → Implementing

- [ ] Add `TypedItem` / `ClozeItem` to union
- [ ] Implement `normalizeAnswer` + `answersMatch` with unit tests (case, spaces, trailing `;`)
- [ ] Author 6–10 typed + 6–10 cloze with real `level-00` slugs; each cloze has exactly one `{{blank}}`
- [ ] Merge into `PRACTICE_BANK`
- [ ] `npx tsc --noEmit`
- [ ] Commit: `feat(practice): typed and cloze bank seeds`

---

### Task 2: Produce panel UI + hybrid grade wiring

**Files:** practice-home.tsx (and optional extract `practice-produce-panel.tsx`)

- [ ] Branch `kind === "typed" | "cloze"`: input → Check → good advance OR miss reveal + Again/Hard
- [ ] Cloze renders template/`templateCode` with blank slot
- [ ] Enter key submits Check when unresolved
- [ ] Wire grades into existing answered/`applyGrades` path
- [ ] Update SessionView so unknown kinds never blank (exhaustiveness)
- [ ] `npx tsc --noEmit`
- [ ] Commit: `feat(practice): cloze and typed produce panel`

---

### Task 3: Demo + hub copy + verify

**Files:** practice-home sampleSession, demo.ts, page description, spec → Done

- [ ] Demo session includes ≥1 typed and ≥1 cloze
- [ ] Hub/page blurb mentions mixed recall formats briefly
- [ ] Run full practice tests + tsc
- [ ] Smoke `/practice?demo=1`
- [ ] Spec Done; commit: `feat(practice): demo cloze and typed recall`

---

## Spec coverage

| Requirement | Task |
|-------------|------|
| Types + seeds + normalize | 1 |
| Hybrid UI | 2 |
| Demo + copy + Done | 3 |
