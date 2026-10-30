# Paths v2

**Goal:** Paths is the main way into the curriculum (the sidebar's Paths). It should answer: which paths am I on and how far along, what else could I train for, and — on a path's page — exactly what it covers, where I am in it, and what finishing it earns.

**User stories**
- I see the paths I've joined first: how far along, the topics I've finished (with their clan crests), and Continue.
- New here: Foundations is offered first ("New here? Start with Foundations").
- I can explore the other paths: one line on what each is, the topics it covers, how long it takes, how many projects, what it builds on; Join or View.
- Coming-soon paths are honest: "Coming soon · N courses planned", see what's planned, no Join.
- On a path's page: what it is, its size, Join / Start / Continue; every topic with its sections and lessons — done ✓, minutes, project marks, "You're here" / "Up next", and how well I remember each lesson's cards; the capstone's state; what it builds on; what it earns (clans, topic badges, project badges); Leave path (progress stays).

**Decisions**
- Built at `/pathsv2` and `/pathsv2/<slug>`; the old `/paths` stays until promoted.
- Coach style, no levels (topics by name, e.g. Bits & Logic — not the course name), no purple, no percentages; "N of M lessons", segment per topic.
- Active = the joined, unfinished path worked on last — same rule as the dashboard.
- Join/Leave use the same following cookie as the old Select/Unselect (`joinPathV2Action`, `leavePathV2Action`).
- Lesson memory chip: `setMemory` over that lesson's Practice cards (blue when holding, orange when some are due); shown whenever its cards have been reviewed.
- Model: `src/lib/paths/paths-v2-model.ts` (tested); loader `paths-v2-data.ts` turns the catalog + outlines into model input.
- Fixed in the catalog: "ShellForge" spelling.
