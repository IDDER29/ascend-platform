# Task 2 Report: Practice Drill-in Pages

## Changes
- Added path and section server routes with linked breadcrumbs and `notFound()`.
- Added tested drill-in models with section/lesson unlocked-card counts.
- Reused the full session machine through exported `PracticeSessionHost`.
- Added path, section, and single-lesson scoped start actions.
- Kept Phosphor list surfaces, 960px hub width, and Continue row hover grammar.
- Centralized mirrored user progress, history, cards, and review-link loading.

## Verification
- TDD red observed for missing drill-in model; green after implementation.
- `npx --yes tsx --test src/lib/practice/*.test.ts` — 30 passed.
- `npx tsc --noEmit` — exit 0.
- Targeted ESLint and scoped `git diff --check` — exit 0.

## Commit
- `668c48c feat(practice): path and section drill-in pages`

## Note
- Unrelated pre-existing worktree changes were not staged or committed.

## Important review finding follow-up
- Added question IDs to path sections and section lessons so due cards can be intersected with each drill-in scope.
- Reused the live `dueQueueIds` result after server-loaded cards are mirrored locally, preserving the new-card daily limit.
- Added quiet mono `N due` labels to whole-path/branch actions and section/lesson rows only when the count is positive.
- Added regression coverage for scope question IDs and due-ID intersection.
- Verification: 31 practice tests passed; TypeScript, targeted ESLint, and scoped diff checks passed.
