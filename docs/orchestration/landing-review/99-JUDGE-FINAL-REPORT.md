# Ascend Landing — Orchestration Report (5-agent loop)

**Date:** 2026-09-22  
**Scope:** Landing page UI + look + copy only (not learner app)  
**Screenshots:** `docs/orchestration/landing-review/shots/`

## Method

| Agent | Role |
|-------|------|
| **V** | Visual design review |
| **C** | Copy & voice / honesty |
| **U** | UX / section structure |
| **A** | Implementability & conflict map |
| **J** | Judge — binding decisions |

Loop: V∥C∥U → A → J. Evidence: 12 screenshots (desktop full page, per-section crops, mobile hero) + source under `src/components/homepage/`.

## Executive verdict

Bones are right; execution is flat. Positioning and honesty are strong. Rhythm and mobile reachability are weak.

**Week-one priorities**

1. Move **CurriculumPreview** under the hero (path = the pitch).
2. Break the white-card corridor: dissolve StatStrip, Why 6→4, dark slim OpenSource.
3. Fix mobile header nav + `focus-visible` on buttons.

## Scores (Judge)

| Lens | Score |
|------|-------|
| Visual | 6.0 |
| Copy | 6.4 |
| UX | 4.2 |
| **Overall** | **6.1 / 10** |

## Binding decisions (Judge)

| Conflict | Decision |
|----------|----------|
| Primary CTA | Keep **Start the path → `/curriculum`**. Differentiated labels for header/final. Hero keeps **Start lesson 1** secondary. |
| StatStrip | **Dissolve**. Fold `4 levels · 24 lessons · 1 capstone` into CurriculumPreview. Canonical count = **24**. |
| Why cards | **4** cards; Community stays with **Preview** badge. |
| OpenSource | Slim + dark `#181428` band. |
| Order | Hero → Curriculum → Pedagogy → Why(4) → OpenSource → FinalCta → Footer. |
| Mobile | SiteHeader menu this pass; learner drawer later. |

## Section-by-section (summary)

### Header
- **Must:** mobile menu; Sign in at all widths; relabel CTA e.g. “Start free →” (same href).
- **Nice:** scroll-spy active states.

### Hero
- Keep curriculum primary / lesson secondary.
- **Must:** secondary button contrast (reads disabled today); focus rings.
- **Nice:** trim subhead duplication of free/no-account.

### StatStrip
- **Delete.** Numbers live on CurriculumPreview.

### CurriculumPreview (promote to #2)
- **Must:** meta line `4 levels · 24 lessons · 1 capstone`; honest Level 03 topics (no Corelib / fake Shellforge lesson); subtitle without “Four” colliding with “4”.
- **Nice:** deep-link per level; use `CURRICULUM_HREF`.

### Pedagogy
- Keep as #3. Strong differentiator.
- **Nice:** subtitle trim; accent “Break” icon only.

### Why (6→4)
- **Keep:** Bottom-up · Curated · Capstone · Community (Preview).
- **Drop:** Learn by doing (dup of Pedagogy) · Progress you can trust (rescue “No fake XP wall…” into OpenSource).
- Capstone: qualify Shellforge as demo.

### OpenSource
- Dark slim band, no card chrome.
- Soften PR/GitHub claims until repo is public.
- Fold in “No fake XP wall…”.

### FinalCta
- Relabel e.g. “Begin at Level 00 →” (same `/curriculum`).
- Cut duplicated free-forever in subhead vs mono line.

### Footer
- Replace “coming soon” with Privacy / Terms; add Community + Sign in.
- GitHub only when URL exists.

## Backlog

### P0 (~1 day)
1. Reorder `page.tsx`
2. Delete StatStrip + meta line on Curriculum
3. `focus-visible` on buttons
4. SiteHeader mobile menu
5. Why 6→4 + Community Preview
6. Honesty sweep (L03 topics, capstone demo, OpenSource PR)
7. Hero secondary contrast

### P1
8. Dark OpenSource band  
9. CTA relabels  
10. Footer links  
11. Copy trims  
12. Per-level anchors  
13. `CURRICULUM_HREF` cleanup  

### P2
Learner mobile drawer · scroll-spy · path connectors · hero cursor blink · pedagogy accent · repo metadata when public  

## Explicit rejects

- Flip primary CTA to lesson 1  
- Keep StatStrip in any form  
- Keep six Why cards  
- Fake social proof / XP marketing on landing  
- Fake live community  
- Rebrand or full redesign  
- Learner shell hamburger this pass  
- Dark mode theme / heavy hero animation  

## Screenshots

| File | Content |
|------|---------|
| `shots/00-full-page.png` | Full desktop scroll |
| `shots/01-hero-viewport.png` | First viewport |
| `shots/02-*.png` | Per-section crops |
| `shots/03-mobile-hero.png` | 390px hero |

## Ask before implementing P0

1. OK to **delete StatStrip** (100% free moves off that band)?  
2. OK to **rewrite L03 topics** (drop Corelib / Shellforge-as-lesson)?  
3. Is there a **public GitHub URL**? (changes OpenSource + footer)

Reply **go P0** (or answer 1–3) to implement.
