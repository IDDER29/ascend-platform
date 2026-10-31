# Honesty Spine Fix Program — Spec Lock (A+Open)

**Date:** 2026-09-22  
**Scope:** A+Open — honesty spine; curriculum stays open (no enforced gates).

## In scope

1. Progress + streak activity via existing `lesson_progress` / `streaks` tables  
2. AuthProvider on lesson + practice routes  
3. Dashboard greeting + continue from DB  
4. Settings load/save `profiles`  
5. Mute/hide fake XP chips when signed in  
6. Honest marketing copy (no false “progress saves” before wiring; after wiring, claim only what works)  
7. Demote password-reset funnel  
8. Link L03 / level-complete → Shellforge (labeled demo)  
9. Soften lock copy to recommended-order (links stay clickable)

## Out of scope (Spec Guardian blocks)

- Real password-reset email/tokens  
- Real Shellforge grader  
- Badge earn engine  
- Bookmarks DB unification  
- Edge auth middleware / enforced lesson locks  

## Acceptance matrix

| # | Behavior | Pass |
|---|----------|------|
| 1 | Signed-in lesson/practice sidebar shows real name, not Amine | |
| 2 | Marking a lesson complete persists across reload | |
| 3 | Dashboard continue points at real next incomplete lesson | |
| 4 | Settings name/pace persist in DB | |
| 5 | Homepage/signin do not claim unsaved progress features | |
| 6 | Password reset cannot silently succeed into a real session change | |
| 7 | Any lesson URL still loads (open path) | |
| 8 | Shellforge linked from end of L03 / level-complete; demo labeled | |
| 9 | Lint + build green | |

## Agent waves

0 Spec → 1a Data → 1b Auth Shell → 2 (Learner UI ‖ Curriculum Progress ‖ Copy) → 3 (Reset ‖ Projects) → 4 QA
