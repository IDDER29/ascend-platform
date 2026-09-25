# Task 2 Report: Route + renderer + home links

## Status

**Complete.** `/practicev2/foundations` serves the Foundations path desk inside the learner AppShell with cream shell matching `/practicev2`.

## Commits

- `d3b8603` — `feat(practicev2): add Foundations path route and wire home links`

Files in commit:

| File | Action |
|------|--------|
| `src/components/practice/practice-coach-v2-foundations.tsx` | Created — client renderer mirroring `PracticeCoachV2` |
| `src/app/(learner)/practicev2/foundations/page.tsx` | Created — metadata + cream `main` wrapper |
| `src/components/practice/practice-coach-v2-markup.ts` | Added (untracked) with 7× `href="/practicev2/foundations"` |

Note: `practice-coach-v2-markup.ts` was previously untracked on this branch; the commit includes the full home extract plus href wiring (not href-only diff). `/practice/foundations` production route untouched.

## Verification

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/practicev2/foundations
# → 200

curl -s http://localhost:3000/practicev2/foundations | grep -o "Foundations" | head -3
# → Foundations (×3)
```

## Self-review

- **Pattern parity:** Renderer matches `practice-coach-v2.tsx` (`style` id + scoped wrapper class + `dangerouslySetInnerHTML`).
- **Shell parity:** Page uses same `flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10` and `max-w-[1100px]` as `practicev2/page.tsx`.
- **Links:** All 7 home Foundations targets (Open path + 6 lesson chips) point to `/practicev2/foundations`; no other hrefs in markup file were changed in this task.
- **Skipped (optional):** `sc-camel-view-box` → `viewBox` in foundations markup — deferred to Task 3 per brief.
- **Follow-up (out of scope):** `/practicev2` home page (`page.tsx`, `practice-coach-v2.tsx`) remains untracked; user may commit separately when ready.

## Concerns

- None blocking. Home at `/practicev2` still requires committing its page/component if not already on branch.
