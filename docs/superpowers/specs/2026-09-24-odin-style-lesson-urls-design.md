# Lesson URLs — Odin-style public slugs

**Date:** 2026-09-24  
**Status:** Implemented  
**Pattern:** `/lessons/{path}-{courseKey}-{lessonSlug}`

## Examples

- `/lessons/foundations-bits-what-is-a-bit`
- `/lessons/foundations-logic-project-half-adder`
- `/lessons/systems-programmer-cpu-instructions-inside-the-cpu`

## Behavior

- Canonical links use `lessonHref(level, slug)` from `src/lib/paths/lesson-urls.ts`
- Course key = Foundations section id or systems topic section id (from course outlines)
- Legacy `/curriculum/[level]/[slug]` **redirects** to the public `/lessons/...` URL
- Lesson UI lives at `/lessons/[publicSlug]` via `LessonDocument`

## Out of scope (follow-up)

- Rewriting every legacy hard-coded `/curriculum/level-…` string in older hubs (they still redirect)
- Changing content file paths on disk (`content/curriculum/...`)
