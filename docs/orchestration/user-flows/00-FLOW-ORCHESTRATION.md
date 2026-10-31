# User-Flow Orchestration System

**Date:** 2026-09-22  
**Purpose:** Verify end-to-end learner journeys against the honesty-spine implementation (A+Open).

## Goals

| # | Goal | Success |
|---|------|---------|
| F1 | Map primary user journeys (anonymous → learner → capstone) | Each journey has steps + entry/exit |
| F2 | Verify each step against real code (not README claims) | Pass / gap / broken with file evidence |
| F3 | Flag honesty breaks (UI promises vs behavior) | Severity tagged |
| F4 | Produce a durable flow report | `docs/orchestration/user-flows/` |

## Orchestration

```
Coordinator
  Wave 1 (parallel)
    Agent ANON  — Anonymous visitor & start
    Agent AUTH  — Sign-up / sign-in / reset demotion
  Wave 2 (parallel)
    Agent LEARN — Lesson loop (open path, mark complete, continue)
    Agent APP   — Dashboard / settings / shell chrome
    Agent CAP   — Level-complete → Shellforge demo
  Wave 3
    Coordinator — Master flow report + gap matrix
```

### Rules
1. One journey family per agent — no overlapping route ownership.
2. Read-only; do not change app code in this pass.
3. Cite file paths; mark **Pass** / **Gap** / **Broken**.
4. Assume A+Open: locks are cosmetic; progress requires sign-in.

## Agent roster

| ID | Role | Journeys |
|----|------|----------|
| ANON | Anonymous visitor | `/` → start CTA → first lesson; browse without account |
| AUTH | Auth funnel | `/signin` sign-up/in; OAuth stubs; `/reset*` demotion |
| LEARN | Learning loop | curriculum index → lesson → mark complete → continue; practice |
| APP | App shell | dashboard resume; settings save; sidebar identity |
| CAP | Capstone handoff | finish L03 / level-complete → Shellforge labeled demo |

## Per-flow template

For each journey:
1. **Name** & intent  
2. **Steps** (numbered)  
3. **Entry / exit**  
4. **Code path** (files)  
5. **Status** Pass | Gap | Broken  
6. **Honesty notes**  
