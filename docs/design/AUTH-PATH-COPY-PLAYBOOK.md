# Auth & path copy — decision playbook

**Date:** 2026-09-23  
**Purpose:** When we restyle auth, landing, or another page that talks about “the path,” reuse these decisions instead of re-debating from scratch.  
**Related:** `docs/superpowers/specs/2026-09-23-phosphor-signin-design.md`, `src/components/homepage/path-ladder.ts`, `src/app/signin/signin-client.tsx`

---

## Two vocabularies (do not mix)

Ascend has **two maps**. They look similar (four items) but answer different questions.

| | **Understanding ladder** | **Curriculum levels** |
|---|---|---|
| **Question** | How does understanding deepen? | What do I study / save progress on? |
| **Marks** | See → Understand → Control → Orchestrate (→ Arrive) | `00` Bits & Logic → `03` Systems · Shellforge |
| **Source of truth** | `PATH_STEPS` + `PATH_OUTCOME` in `path-ladder.ts` (hero + auth card) | Lesson schema / curriculum UI |
| **Best home** | Landing hero, auth left “proof” card | Curriculum page, learner nav, progress |
| **Not** | Syllabus, project list, “steps” checklist | Marketing ladder of verbs |

**Rule:** Pick one vocabulary per surface. Sign-in left card = **ladder** (same words as hero). Curriculum index = **levels**.

---

## Best-world student outcome

After completing the ladder (and the real curriculum that backs it), the learner is not “done with four modules.”

**Best world:** they *get* the machine end-to-end — bit → decision → running machine → code on hardware → OS keeping it alive — and can prove it toward a working shell.

Card title locked to that goal:

> **Until the machine makes sense**

Not: path/destination slogans that feel like a checklist (“Bits → a working shell”, “4 steps”, “From bit to shell” as step vibes).

---

## Sign-in path card — locked copy

Glass card under the left-panel thesis. **Keep layout chrome; change words carefully.**

| Slot | Locked | Why |
|------|--------|-----|
| Eyebrow | **The ascent** | Names the ladder; doesn’t repeat the title (“Understanding” did). Brand-adjacent without saying “steps.” |
| Title | **Until the machine makes sense** | Student goal, not a route map. |
| Corner meta | *(none)* | Dropped `4 steps` / `bottom-up` — redundant with the list. |
| Rows | `00`–`03` + **title** + **gain** from `PATH_STEPS` | Keep `00` graphic layout; copy = See / Understand / … + sub-lines. No level color badges, no hero PathNode UI. |
| Footer | **Curriculum stays open. Signing in only saves what you've finished.** | Only auth-specific line — honesty spine + why the form exists. |

**Do not:**

- Restyle into hero PathNodes (colored squares, ★ Arrive row) on this card — user rejected “add numbers/images”; keep the quiet list.
- Swap back to Bits & Logic names here without an explicit product decision (that’s curriculum vocab).
- Call them “steps” or “levels” in the eyebrow/meta.

---

## Problem → solution log (reuse these moves)

Use this table when a new page hits a similar conflict.

| Symptom / debate | What we tried | What stuck | Reusable move |
|------------------|---------------|------------|---------------|
| Left panel feels like a second hero | Quiet spine (no card) | User preferred **keep the card**, polish copy | Prefer polish-in-place over removing a composition the user already likes |
| Curriculum names vs hero ladder | Argue “auth = levels” | User wanted **ladder copy**, keep **00–03 layout** | Keep structure; swap vocabulary; don’t rebuild chrome |
| Copy too long | Full “See · How a bit…” on one line | Title + gain on two lines under `00` | Key word + sub-line, same as hero meaning |
| “Just the keywords” felt empty | Keywords only | Undo → restore gains | Keywords alone lose the “why”; keep gains |
| Header still felt like old steps | “Bits → shell”, “4 steps”, “From bit to shell” | Goal title + ascent eyebrow; **no count chip** | Name the *outcome*, not the itinerary; drop decorative counters |
| Eyebrow duplicated title | “Understanding” | **The ascent** | Eyebrow = category; title = promise |
| Footer generic / not auth | “Open curriculum. Account remembers…” | Tighten to **stays open / signing in only saves…** | Footer = page job (why this form), not more ladder poetry |
| Future OAuth / reset | Remove vs placeholder | **Disabled UI with flip flags** (`OAUTH_ENABLED`, `RESET_EMAIL_ENABLED`) | Ship final styling + honesty; wire later without redesign |

---

## When you start another page

1. **Ask:** Is this surface selling *understanding* or tracking *curriculum progress*? Choose one vocabulary.
2. **If sharing ladder copy:** import `PATH_STEPS` / `PATH_OUTCOME` — don’t fork strings.
3. **If keeping an existing card/layout the user likes:** change copy first; only change layout when they ask.
4. **Title test:** Does it describe the *best-world student*, or a list of stops? Prefer the former for marketing/auth; latter for curriculum.
5. **Chrome diet:** Eyebrow ≠ title paraphrase. Meta chip only if it adds info the list doesn’t already show.
6. **Honesty line:** Auth/marketing footers should answer “what does the account do?” when progress is involved.
7. **Update this doc** when a decision flips — same day, one row in the log + locked table.

---

## Code anchors

| Piece | Where |
|-------|--------|
| Ladder strings | `src/components/homepage/path-ladder.ts` |
| Hero uses ladder | `src/components/homepage/hero.tsx` |
| Auth path card | `decoration` in `src/app/signin/signin-client.tsx` |
| Auth split chrome | `src/components/auth/auth-split-layout.tsx` |
| OAuth placeholders | `src/components/auth/auth-oauth.tsx` → `OAUTH_ENABLED` |
| Reset flow gate | `src/lib/auth/reset-flow.ts` → `RESET_EMAIL_ENABLED` |

---

## Spec pointer

Implementation scope for Phosphor sign-in remains in  
`docs/superpowers/specs/2026-09-23-phosphor-signin-design.md`.  
**Copy & composition judgment lives here** so future pages inherit the reasoning, not only the pixels.
