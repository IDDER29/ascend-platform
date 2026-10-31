# practicev2 complete — design (2026-10-29)

## Context
practicev2 already runs a real loop: home, session, complete, bank and custom decks all use live data. Grades go through SM-2 (`src/lib/practice/sm2.ts`), and sessions and cards are saved to the DB (`savePracticeSessionAction` / `upsertPracticeCardsAction` in `src/lib/practice/actions.ts`). Four gaps keep it from being "complete":

1. **Daily goal is browser-only.** `src/lib/practice/daily-goal.ts` uses localStorage, so signed-in users lose it when they switch device. Session history and cards are already in the DB.
2. **Card bank is thin.** There are 42 cards covering 10 of 25 lessons, and Level 01 and Level 03 have none (`src/lib/practice/bank*.ts`).
3. **Foundations desk is fake.** `/practicev2/foundations` injects static HTML (`practice-coach-v2-foundations-markup.ts`) with made-up numbers, and other paths have no desk at all.
4. **Not the real Practice yet.** The sidebar, command palette, footer, 404 page and dashboard all link to the old `/practice` (`practice-home.tsx` plus the demo bar).

User decisions: I draft about 6 cards per lesson. One shared desk serves every path. v2 moves to `/practice/*` and the old UI is deleted.

Repo convention, kept here: each phase gets a short spec in `docs/superpowers/specs/2026-10-29-*-design.md`, then the code, then one commit (`feat(practicev2): …`). Work happens on a new branch `feat/practicev2-complete`, cut from the current branch.

---

## Phase 1: Persist the daily goal for signed-in users
- Add a table `practice_settings (user_id PK → users, daily_goal int default 20, updated_at)`:
  - `src/lib/db/schema.pg.ts`
  - `src/lib/db/schema.sqlite.ts`
  - `src/lib/db/sqlite-ddl.ts`, using `CREATE TABLE IF NOT EXISTS`. A new table avoids ALTERs on existing `local.db` files.
- Query: `getPracticeDailyGoal(userId)` in `src/lib/practice/queries.ts`.
- Action: `savePracticeDailyGoalAction(goal)` in `actions.ts`, following the shape of `savePracticeDeckAction`. Validate with `isDailyGoal`.
- `server-page-data.ts` (`loadPracticePageData`) returns `initialGoal`.
- `practice-coach-v2-home-live.tsx` and `practice-coach-v2-complete-live.tsx`:
  - Use the server goal when signed in, falling back to `readDailyGoal`.
  - On change, call `writeDailyGoal` and also fire the action when a user is present.
  - Guests keep localStorage.
- Generate the Postgres migration with `npm run db:generate`.

## Phase 2: Fill the card bank (~150 cards)
- Write about 6 cards for each of the 25 lessons, mixing mcq / flashcard / typed / cloze. Top up lessons that have fewer than 6.
- Source every card from that lesson's MDX in `content/curriculum/<level>/<slug>.mdx`. No facts that aren't in the lesson.
- Every card gets a `hint`, a `conceptId` and a `reviewLabel`.
- Ids follow the existing pattern `<topic>-<kind>-NN`. Existing ids stay unchanged, because saved SM-2 rows key on `questionId`.
- File layout:
  - `bank.ts`, `bank-flashcards.ts`, `bank-typed.ts` and `bank-cloze.ts` are getting large.
  - Split by level into `src/lib/practice/bank/level-00.ts … level-03.ts`. Each file exports its items by kind.
  - `bank.ts` keeps exporting `PRACTICE_BANK` (and `MCQ_BANK` etc. if imported elsewhere), so no consumer changes.
- New test `bank.test.ts`:
  - ids are unique
  - every `lessonLevel/lessonSlug` resolves to a real MDX lesson
  - every lesson has ≥ 5 cards
  - mcq `correct` is in range
  - cloze has exactly one `{{blank}}`
  - typed/cloze `answers` are non-empty
- Content goes in two commits (Levels 00–01, then 02–03) to keep review manageable.

## Phase 3: Shared path desk (replaces static Foundations)
- **Route:** `src/app/(learner)/practicev2/paths/[slug]/page.tsx`.
  - `/practicev2/foundations` redirects to `/practicev2/paths/foundations`.
  - Unknown slug, or a path with no cards, returns `notFound()`.
- **Model:** pure `src/lib/practice/coach-path-model.ts` plus a test, in the style of `coach-home-model.ts`. Inputs are cards, history, completedKeys and slug. Built from `practiceTreeForPath` / `practiceSectionsForPath` / `sectionLessonKeys` (`src/lib/practice/tree.ts`) and `strengthBuckets` / `cardStrength` (`coach-home-model.ts`). Outputs:
  - **Hero:** title, mark and blurb from `path-map.ts`, plus branch, lesson and card counts.
  - **Sections ("branches"):** each lesson row shows card count, due-now count, a strength label (Needs work / Not started / ok), and links:
    - Practice → `session?scope=lessons…`, using the scope format the custom deck already produces
    - Branch → `session?scope=section&…`
    - Open lesson → `lessonHref`
  - **Progress panel:** hit rate and correct/total/sessions from the path's history, strength buckets, and a "Browse all N cards" link to the bank filtered by path.
  - **"Where to focus" tip:** the section with the most misses, linking to the custom deck builder preloaded with those lessons. Hidden when there's no history, in line with the "learning honesty" rule in the functional-loop spec.
  - **CTAs:** "Review N due" (only when N > 0) and "Build a custom deck".
- **Components:** `src/components/practice/coach-path/*`. Reuse the Coach tokens and the visual layout of the current Foundations markup, rebuilt in Tailwind like `coach-home/*`. Wrapper is `practice-coach-v2-path-live.tsx`, which follows the home-live pattern: `mergeSessionHistory(readLocalHistory…)` and `syncLocalCards`.
- **Home:** show a path card for each path the learner has unlocked cards in, not only Foundations. Generalize `FoundationsPathCard`'s `PATH_HREF` to `/practicev2/paths/${slug}` and extend `foundationsPath()` in `coach-home-model.ts` to a per-path builder.
- **Delete:** `practice-coach-v2-foundations*.ts(x)` and its markup test.
- **Check:** the bank and custom pages accept a path filter param. Add one if they don't.

## Phase 4: Cutover, v2 becomes `/practice`
- Delete the old UI:
  - `src/app/(learner)/practice/page.tsx`, `[pathSlug]/page.tsx`, `[pathSlug]/[sectionId]/page.tsx`
  - `practice-home.tsx`, `practice-demo-bar.tsx`, `practice-desk.ts`
  - `src/lib/practice/demo.ts`
  - `miss-queue.ts` (v2 doesn't use it; check `cards.ts` imports first and inline or remove what it needs)
  - any helpers left with no users, found by grep
- Move `src/app/(learner)/practicev2/*` → `src/app/(learner)/practice/*`. That covers home, session, complete, bank, custom and `paths/[slug]`.
- Replace every hard-coded `/practicev2` href (grep for `practicev2`, e.g. `coach-home-model.ts:122`, `foundations-path-card.tsx`) with a single helper `PRACTICE_ROUTES` in `src/lib/practice/routes.ts`.
- Redirects in `next.config.ts` (check the Next 16 docs in `node_modules/next/dist/docs/` first):
  - `/practicev2/:path*` → `/practice/:path*`
  - old `/practice/:pathSlug` → `/practice/paths/:pathSlug`
  - old `/practice/:pathSlug/:sectionId` → `/practice/session?scope=section&…`
- Update links and revalidation:
  - `revalidatePath` calls in `actions.ts`
  - the sidebar active-match in `src/components/ui/sidebar.tsx` (drop the practicev2 branch)
  - "v2"/"experiment" metadata titles
- The existing links (sidebar, command palette, footer, not-found, `mock-standing.ts`) already point to `/practice` and will just work.
- Update the README Practice section and mark the functional-loop spec's "out of scope: cutover" as done.

---

## Verification
- **Each phase:**
  - `npx tsx --test src/lib/practice/*.test.ts` (and the new bank and path-model tests)
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npm run build`
- **In the browser (run skill / Chrome), signed in on local SQLite:**
  - **Phase 1:** change the daily goal, clear localStorage, reload. The goal persists. As a guest it still works.
  - **Phase 2:** complete a Level 01 or 03 lesson, and its cards appear in due/free study. Wrong answers link to the right lesson.
  - **Phase 3:** `/practicev2/paths/foundations` and `/practicev2/paths/systems-programmer` show real counts that match the bank page. Every Practice, Branch and Open-lesson link starts the right session. The focus tip only appears after misses.
  - **Phase 4:** walk sidebar → Practice → session → complete → bank → custom → path desk entirely under `/practice`. Old `/practicev2/...` and `/practice/foundations` URLs redirect. `grep -r practicev2 src` returns nothing.
- Final pass: `/code-review` on the branch before a PR to `main`.
