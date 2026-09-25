# Practice training desk (elite atmosphere + momentum)

**Date:** 2026-09-25  
**Status:** Implementing  
**Routes:** `/practice` · `/practice/[pathSlug]` · `/practice/[pathSlug]/[sectionId]` · in-session / results  
**Builds on:** `2026-09-25-practice-tree-scope-design.md`, study-desk polish, Phosphor  
**Chosen approach:** Shared “training desk” visual system across home, drill-in, and session — intensity dialed by mode; honest momentum, no streak/XP theater  

## Goal

Make Practice feel **elite and motivating** — a night-study training desk with phosphor heat — without turning Ascend into gamified SaaS. Atmosphere + craft first; honest momentum second. IA (Due primary, Path → section → lesson) stays.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Feeling | Not “basic” — elite, energetic, motivating |
| Energy | **Visual heat (A)** + **honest momentum (B)** |
| Scope | **Whole Practice surface** — home, drill-in, session |
| System | Shared materials; intensity ladder by mode |
| Out | XP, levels, streaks-as-theater, purple glow, confetti, mastery claims |
| Later (unchanged) | Format filters, weak-only decks, personal cards |

## Vision

Practice should feel like sitting down at a serious training desk: one clear action when cards are due, a map of knowledge below, and a rail that tells the truth about how sharp you’re getting. Once you Start, the desk goes quiet so the question owns attention — then a warmer results beat so finishing feels earned.

## 1. Visual system (shared)

**Mood:** Phosphor night-study desk with heat — green → teal → soft gold. Not neon dashboard, not Duolingo.

**Materials**
- Paper field + soft phosphor wash (stronger on home, whisper on session)
- Display for the one hero line; mono for momentum / meta
- List rows: Continue hover grammar; no card farm
- Motions (2–3 intentional): Due stage rise-in; path row sheen on hover; session progress tick — no confetti

**Intensity ladder**

| Mode | Heat | Job |
|------|------|-----|
| Home | Highest | Arena — Due is the hero |
| Path / section | Medium | Same desk, quieter — Study is the punch |
| Session | Coolest | Focus — thin chrome, soft grade feedback |

Legacy `--brand-violet` tokens remain green/teal values; no purple inventing.

## 2. Home (`/practice`)

**One composition, not a stack of boxes**

1. **Due stage (hero)**  
   - Full presence inside hub 960: display headline (“Ready to review” / “Nothing due”), oversized due count as visual anchor  
   - Primary **Study due cards** (or **Study unlocked** when caught up); secondary “Study unlocked instead” when due > 0  
   - Soft phosphor wash + short rise-in  
   - Replace current promo-tile card feel with a **stage on the desk** (still interactive, not a floating marketing card)  
   - Page header stays short; Due owns the emotional headline  

2. **Paths**  
   - Secondary geography under the stage  
   - Denser list, quieter marks, primary action = **Open path**  
   - Custom lessons remain a single quiet collapsed control (not competing with Paths)  

3. **Training rail (momentum)**  
   Reframe Hit rate / Recent into a **Training** rail:
   - Hit rate per path (honest correct ÷ seen — keep disclaimer)  
   - Cleared today / sessions this week (derived from history — no fake streak theater)  
   - Next review time  
   - Recent sessions (compact)  

## 3. Drill-in (path / section)

- Same materials as home, lower heat; optional soft wash; no second hero fighting Study  
- Header: title + quiet due count + one strong **Study whole path** / **Study this branch**  
- Branch / lesson lists: denser, Continue hover, mono meta  
- Breadcrumbs: mono, thin  

## 4. Session + results

- Keep **640** focus column; do not decorate the question body  
- Thin top chrome: scope label · progress (`n/N`) · optional quiet session hit so far  
- Grades: Good strongest weight; Again/Hard calm; tiny advance tick only  
- Results: slightly warmer wrap-up (session hit rate + Back / Study again), then return to the desk that started the session  

## 5. Out of scope

- Format checkboxes / weak-only deck builder / personal cards  
- XP, levels, badge shelves, streak flames, confetti  
- Changing SM-2 / bank / tree IA  
- New DB tables (momentum from existing history + cards)  

## Success criteria

- [ ] Home reads as one composition: Due stage → Paths → Training rail  
- [ ] Due stage feels elite (type, wash, motion) without promo-card chrome  
- [ ] Path/section pages share desk language with quieter heat + strong Study CTA  
- [ ] Session stays cool/focus; results feel earned  
- [ ] Momentum rail shows honest hit rate + cleared today / recent — no XP theater  
- [ ] Phosphor tokens only; no purple; hub 960 preserved  

## Roadmap note

Tree + scope and multi-format recall stay. Next product slices after this craft pass: format filters, struggle surfaces, personal cards.
