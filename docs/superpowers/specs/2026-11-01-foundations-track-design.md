# The track: from bits to designing processors (2026-11-01)

## Goal
A deep foundation in computing covers far more than one path can hold: information and logic, the CPU, C in depth, tools, data structures, the OS, networking, security and computer architecture. Rather than cram it into Foundations, Ascend shows it as **one connected track in three stages**, with milestones and side paths, and makes every planned lesson visible before it is written. Learners see where a path leads; we see what's missing.

## The three stages
| Stage | Path | Leaves you |
|---|---|---|
| 1 | Foundations (live, 5 courses) | Ready to start C |
| 2 | Systems Programmer (live, expanded to 10 courses) | Understand C deeply (after Data Structures in C), then Understand the OS |
| 3 | Computer Architect (soon) | Ready to design processors |

**Systems Programmer**, in order: Machine & Memory, *C Basics*, The C Language, *The C Contract*, *Tools*, *Data Structures in C*, Systems & Software, *Virtual Memory, Threads & Files*, ShellForge, *Your own malloc*. Italic = outlined, not written. The three live topics also gained "coming soon" items (memory hierarchy, calls in assembly, integer conversions, strings, linkage, ownership, context switching, permissions, buffered I/O).

**Computer Architect**: Performance & trade-offs, Pipelining, Advanced execution, Caches & memory systems, Multicore & GPUs, Digital design with Verilog, Verification, From RTL to silicon, Compilers & theory, and the capstone, a RISC-V core designed and verified by the learner.

**Side paths**: Python, Linux, Network and AI branch off Foundations; Security Engineer (new) branches off Systems Programmer. Network and Security have full lesson outlines; Linux, Python and AI keep course counts until their outline pass.

## Decisions
- **Outlines are data, shown as "Coming soon"**: courses with no lessons yet carry an `outline` (`src/lib/paths/planned-outlines.ts`); live topics carry `upcoming` items per section (`course-outlines.ts`). Planned counts come from the outlines, not typed by hand.
- **A course without lessons is never "You're here"**, and a milestone counts as reached only when every course before it is finished, so a learner never "finishes" a stage whose lessons aren't written.
- **The track map** (`src/components/paths-v2/track-map.tsx`) sits on `/paths` (with progress) and `/catalog` (static). Path pages say "Stage n of 3" and list milestones between courses.
- **When a course gets its first lesson** it becomes a topic: a new id in `src/lib/content/schema.ts` (`levelIds`, `LEVELS`), its owner in `lesson-urls.ts`, and its outline moves from `planned-outlines.ts` to `course-outlines.ts`. Lesson ids in the outline become the slugs.
- **Mastery skills on cards**: every card kind maps to what it asks of the learner: recognise (flashcard, choices), explain (short answer, fill in the blank), predict (output, order), build (bits), debug (spot the bug). Derived in `src/lib/practice/mastery.ts`, shown and filterable in the card bank, so a lesson whose cards are all "recognise" stands out.

## Writing rules for the outlines
Plain sentence-case titles, 5–10 minute lessons, no em dashes, never "level"; projects start "Project: " (capstones "Capstone: "). `src/lib/paths/catalog.test.ts` checks these.

## Order of work
See "What to write next" in `docs/curriculum/registry.md`.
