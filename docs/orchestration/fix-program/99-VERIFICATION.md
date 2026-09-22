# Honesty Spine — Verification Report

**Date:** 2026-09-22  
**Scope:** A+Open  
**Commands:** `npm run lint` (exit 0), `npm run build` (exit 0)

## Acceptance matrix

| # | Behavior | Status | Evidence |
|---|----------|--------|----------|
| 1 | Signed-in lesson/practice sidebar shows real name, not Amine | **Pass (code)** | `curriculum/layout.tsx` + `practice/layout.tsx` wrap `AuthProvider`; sidebar uses `useAuthUser()` |
| 2 | Marking a lesson complete persists across reload | **Pass (code)** | `markLessonCompleteAction` → `lesson_progress` upsert; footer “Mark complete” |
| 3 | Dashboard continue points at real next incomplete lesson | **Pass (code)** | Dashboard uses `getContinueLesson` |
| 4 | Settings name/pace persist in DB | **Pass (code)** | `updateProfileSettingsAction` + settings client hydrate from `getProfileSettings` |
| 5 | Homepage/signin do not claim unsaved progress features | **Pass (code)** | Hero/CTA: “sign in to save progress”; Forgot demoted |
| 6 | Password reset cannot silently succeed into a real session change | **Pass (code)** | Reset success → sign-in only; no password DB write; no dashboard “welcome back” |
| 7 | Any lesson URL still loads (open path) | **Pass (code)** | No middleware; locks → “recommended later” / Open links |
| 8 | Shellforge linked from end of L03 / level-complete; demo labeled | **Pass (code)** | Lesson footer + level-complete unlock; Shellforge badge “CAPSTONE · DEMO” |
| 9 | Lint + build green | **Pass** | lint 0; build 0 (webpack) |

## Manual smoke (recommended)

1. Sign up → open a lesson → confirm sidebar name  
2. Mark complete → reload → button shows Saved; dashboard continue advances  
3. Settings → change name → reload → name persists  
4. Visit `/reset` → confirm demo copy; new-password success goes to `/signin`  
5. Deep-link a Level 03 lesson while “recommended later” on index — page loads  

## Out of scope (unchanged by design)

Badge earn engine, bookmarks DB, real reset email, Shellforge grader, edge auth middleware.
