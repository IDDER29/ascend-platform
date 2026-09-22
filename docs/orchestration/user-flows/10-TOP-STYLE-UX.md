# TOP-style student experience (IA changes)

**Date:** 2026-09-22

## Product spine (what we optimized for)

```text
/  →  Start the path  →  Lesson 1
     →  learn freely (open path)
     →  Sign in to save
     →  land on continue lesson (not vanity dashboard)
     →  Curriculum map / Continue hub / Profile (real counts)
```

## Changes shipped

1. **Landing** — “Start the path” → first lesson; secondary “Browse the curriculum”; copy de-emphasizes XP theater  
2. **Sidebar** — Curriculum first; Continue (=dashboard); guest card “Sign in to save”; no Amine / fake Level 8 XP  
3. **Topbar** — no fake streak/XP for guests; Sign in link; real streak only when provided  
4. **Auth** — after sign-up/sign-in → `getContinueLesson` (back into the path)  
5. **Profile** — real lessons done / streak / per-level bars; guest empty honesty  

## Still electives (not critical path)

Practice, achievements, bookmarks, playground, community — reachable but not the first-session funnel.
