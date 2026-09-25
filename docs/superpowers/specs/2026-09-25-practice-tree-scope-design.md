# Practice tree + scope (dashboard slice 1)

**Date:** 2026-09-25  
**Status:** Implementing
**Routes:** `/practice` · `/practice/[pathSlug]` · `/practice/[pathSlug]/[sectionId]`  
**Builds on:** Practice SM-2, flashcards/cloze/typed, study-desk polish  
**Chosen approach:** Reuse path/course outlines as the Practice tree; drill-in pages; Due stays primary on home  

## Goal

Turn Practice into a **hierarchical study map**: Path → section (branch) → lesson, so students can study a whole path, one branch, or one lesson — while **Due** remains the daily habit on `/practice`. Later slices add format filters, weak-only decks, and personal cards.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Slice | **Tree + scope only** (not formats / weak deck / user cards) |
| Navigation | **Drill-in pages** (real URLs) |
| Due | **Primary band on `/practice` home**; tree below |
| Tree source | **Curriculum outlines** (section = branch) |
| Start | Prefer due-in-scope, then shuffle; no filler outside scope |

## Vision (full dashboard — later)

1. Tree + scope ← **this**  
2. Session format filters + due/weak/all  
3. Struggle surfaces (weak concepts from SM-2)  
4. Personal / edited cards  

## 1. Routes & IA

```
/practice
  Due band (Study due cards / Nothing due + next review)
  Paths list (unlocked only) → /practice/[pathSlug]
  Rail: hit rate · recent (unchanged meaning)

/practice/[pathSlug]
  Breadcrumb Practice / {Path}
  Study whole path
  Section rows (branches) → /practice/[pathSlug]/[sectionId]
  Quiet due-in-path count when available

/practice/[pathSlug]/[sectionId]
  Breadcrumb … / {Section}
  Study this branch
  Lesson rows with Study (scope lessons: [key])
```

Invalid path/section → notFound or redirect to `/practice`.

Session + results: keep current focused UI (640); after results, “Back” returns to the page that started the session (path/section/home).

## 2. Scopes

Existing: `due` | `all` | `path` | `lessons`.

**Add:**
```ts
{ type: "section"; pathSlug: string; sectionId: string }
```

**Resolution:** Map outline live lessons in that section → completion keys → filter `PRACTICE_BANK` unlocked items for those lessons. Empty → honest empty (no fake items).

**Helpers:** `practiceTreeForPath(pathSlug)`, `sectionLessonKeys(pathSlug, sectionId)`, extend `questionsForScope` / `labelForScope`.

## 3. UI (Phosphor)

- Hub max **960**; Continue hover grammar on rows  
- Path/section pages: list surfaces, not card farms  
- Due band on home unchanged in job; paths list replaces “flat deck only” as the browse story (can keep a compact “Study by path” that links into `/practice/[slug]` instead of starting inline — prefer **navigate into tree**, primary Start on path/section/lesson pages)  
- Home path rows: navigate to path page (chevron); optional secondary “Study” that starts path scope without leaving home is OK but one primary action preferred = **open path**

## 4. Data

No new DB tables. Outlines already exist (`foundations-outline`, `course-outlines`, `lesson-urls` registration). Client-safe tree module if outlines pull `fs` — mirror practice `path-map` pattern (client-safe summary) or server-render path/section pages.

**Prefer:** path + section pages as **Server Components** that load outline + pass unlocked keys / due hints into a thin client starter (reuse PracticeHome session machine or extract `PracticeSession` client).

## 5. Out of this slice

- Format checkboxes (MCQ/flash/cloze/typed)  
- Weak-only / failed-only deck builder  
- User-authored questions  
- Explain format  
- Email / SM-2 UI for ease  

## Success criteria

- [ ] `/practice` Due + path list into drill-in  
- [ ] Path page lists sections; Study whole path works  
- [ ] Section page lists lessons; Study branch / lesson works  
- [ ] Section scope filters bank correctly  
- [ ] Empty scopes honest; Phosphor; SM-2 unchanged  

## Roadmap note

Document full dashboard layers in this spec’s Vision section so later slices don’t reinvent IA.
