# Bookmarks v2

## Goal
A place for what a learner wants to find again, and why. Saving takes one press
wherever the thing is; the page puts what they *didn't get* first, and turns
saved material into a Practice deck.

## User stories
- While reading, I save a lesson, a section, a code snippet or an outside resource without leaving the page.
- In Practice, I save a card I keep missing.
- When I save, I say why: **Later**, **Reference**, or **Didn't get it**. I can add a note.
- On /bookmarks I see the things I didn't get first, with a way back to each and an "I get it now" that keeps it as a reference.
- I search titles and notes, and filter by why and by kind.
- I review the Practice cards behind what I saved, in one deck.
- I pick up lessons and sections I saved for later.

## Decisions
- **Frontend only for now:** stored in this browser (`localStorage` key `ascend:bookmarks`). The `bookmarks` table stays unused until the database pass.
- **Kinds:** lesson, section (h2 in a lesson), snippet (`CodeBlock`), resource (additional resources with a URL), card (Practice question).
- **Refs** are stable: `lesson:<level>/<slug>`, `section:<key>#<h2 id>`, `snippet:<key>#<hash of code>`, `resource:<url>`, `card:<question id>`.
- **Grouping:** the shelf is grouped by topic (never levels), then "Outside resources". "Didn't get it" items sit apart in a dark "To revisit" card.
- **Practice them:** saved cards plus the cards of saved lessons, sections and snippets; the session takes the first 30.
- Built at `/bookmarksv2`; the old `/bookmarks` page stays until the user promotes v2.
- Development only: an empty page offers "load sample bookmarks" made from real lessons.

## Where
- Model + tests: `src/lib/bookmarks/model.ts`
- Store: `src/lib/bookmarks/use-bookmarks.ts`
- Save button + panel: `src/components/bookmarks/save-button.tsx`
- Lesson wiring: `src/components/bookmarks/lesson-bookmarks.tsx` (provider, section heading, snippet, resource, lesson)
- Page: `src/components/bookmarks/bookmarks-page.tsx`, `src/app/(learner)/bookmarksv2/page.tsx`
