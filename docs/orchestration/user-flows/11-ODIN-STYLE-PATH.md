# Odin-style path IA

**Date:** 2026-09-22

## Student spine

```text
/  →  Start the path  →  /curriculum map  →  pick a lesson
   →  Start lesson 1 (secondary) → Lesson 1
Sign in  →  Continue (/dashboard) → next incomplete lesson
Optional: Practice / Playground
End of path: Shellforge
```

## Nav (AppShell)

Shared `AppShell` from one `(learner)` layout covering Continue, Curriculum,
lessons, Practice, Playground, Progress, Profile, Settings, Achievements,
Bookmarks, and Shellforge. Sidebar stays mounted across soft navigations;
collapse preference is `localStorage` (`ascend:sidebar-collapsed`).

- **Learn:** Curriculum, Continue, Practice, Playground  
- **You:** Progress, Profile  
- **More:** Achievements, Bookmarks (quieter)  
- Topbar: search + Curriculum + Sign in / profile  
- Landing: Start the path → `/curriculum`  
