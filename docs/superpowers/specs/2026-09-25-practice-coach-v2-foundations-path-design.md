# Practice Coach v2 — Foundations path

**Date:** 2026-09-25  
**Status:** Implementing  
**Route:** `/practicev2/foundations`  
**Builds on:** Coach home at `/practicev2` · source mock `Ascend Practice.html` → **Practice — Foundations path (desktop)**  
**Chosen approach:** Mirror home — extract Coach `<main>` body into AppShell cream desk; static markup first; screenshot-until-fixed  

## Goal

Port the Coach **Foundations path** desktop screen into Ascend under the learner shell, matching the mock composition the same way `/practicev2` matched Coach home. Production `/practice/foundations` stays untouched until a later swap.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Approach | **A — parallel Coach route** (not restyle live drill-in, not `?view=` switch) |
| Route | `/practicev2/foundations` |
| Shell | Learner AppShell; cream main `#F6F4EE` (flush, no nested paper card) |
| Markup | Static extract of mock `<main>`; strip mock top nav / footer |
| CSS | Shared / extended `practice-coach-v2` styles; inline + scoped CSS; verify applied |
| Data | Demo/static numbers from mock (same as home v2) |
| Out of scope | Mobile twin; live SM-2 wiring; other Coach sub-screens (bank, custom, session) |

## Composition (from mock)

1. **Breadcrumb** — Practice → Foundations (Practice links to `/practicev2`)
2. **Hero** — title Foundations · “Always open” · blurb · meta `3 branches · 6 lessons · 32 cards`
3. **Primary CTAs** — Build a custom deck · Review 8 due cards  
   - Both href → `/practicev2` until custom-deck / session Coach screens ship (no empty routes)
4. **Branch sections** (in order)
   - **Bits** — 3 lessons · 17 cards · Practice this branch · lesson rows (What is a bit?, Counting in binary, Bytes and hex) with Practice / Open lesson
   - **Logic** — 2 lessons · 11 cards · Needs work chips · Boolean logic, Logic gates
   - **First principles** — 1 lesson · 4 cards · Not started · Thinking from first principles · Start lesson
5. **Your progress** — Hit rate · Card strength · Browse all 32 cards
6. **Where to focus** — tip copy · Build that deck

## Link map (home → path)

| Home control | Target |
|--------------|--------|
| Open path | `/practicev2/foundations` |
| Lesson chips (1–6) | `/practicev2/foundations` (same page until lesson deep-links exist) |

## QA

- Tile screenshots per major block (hero, each branch, progress, focus)
- Full viewport with AppShell
- Confirm coach CSS present; no overflow; cream flush
- Re-shot after each fix (same loop as home)

## Non-goals

- Replacing `/practice/[pathSlug]`
- Mobile Foundations path mock
- Wiring real `practicePathDrillIn` data into this surface yet
