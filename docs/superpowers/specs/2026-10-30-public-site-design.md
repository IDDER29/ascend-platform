# Public site (2026-10-30)

## Goal
The public side of Ascend was one long homepage. It becomes a small site: a short front door and one page per question a visitor has, all in the Coach look the app uses, so moving from the site into a lesson feels like one product.

## Pages
| Page | Route | Job |
| --- | --- | --- |
| Home | `/` (old landing kept at `/homev1`, `/homev2` redirects) | What Ascend is, the climb from a bit to a shell, one real Practice card to answer, the lesson loop, the open paths. |
| All paths | `/catalog` | Every path, open and coming. Not the app's `/paths`: no joining, no progress. |
| One path | `/catalog/[slug]` | Its topics → sections → every lesson (lessons are public, so each links), the capstone, what finishing earns. Statically generated. |
| How it works | `/how-it-works` | Lesson → check yourself → Practice → build; the forgetting curve (FSRS power law, labelled a model) with research cited; the daily goal plans; how badges, crests and titles are earned. |
| About | `/about` | Why bottom-up, who it's for and not for, what we won't do. |
| Open source | `/open-source` | Fix a lesson, report a problem, run it locally, other ways to help. |
| FAQ | `/faq` | Native `<details>`; answers use live counts. |

Privacy, Terms and the 404 page use the same shell. The app's footer is the site footer.

## Decisions
- **One theme.** `practice-coach-v2` + `--coach-*` tokens, dark hero panels with lime buttons, 2px bordered cards. Inverted ink for the current nav item so it reads in both modes.
- **Every number is real.** Lesson, minute, card and project counts come from the lesson files and `PRACTICE_BANK` (`src/lib/site/site-data.ts`); path pages from `loadPublicPaths()` in `paths-v2-data.ts` (no session, so the pages stay static).
- **Paths get a one-line `pitch`** in `catalog.ts`, used on the site and in the app. Foundations' copy was rewritten.
- **Start free** opens the first lesson (no account needed). "Create a free account" appears only on path pages.
- **Sitemap and robots** list the public pages, path pages and lessons. `NEXT_PUBLIC_SITE_URL` must be set in production (also used for `metadataBase`).

## Before launch
- Privacy and Terms still carry the demo-project text.
- The repo has no LICENSE file; the site says "built in the open" but names no licence until one is chosen.
