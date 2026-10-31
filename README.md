# Ascend

Free lessons on how computers really work, from a single bit up to a Unix shell you write yourself. Short lessons,
questions that show what stuck, spaced-repetition Practice that brings each idea back before you forget it, and real
projects. Every lesson is a plain MDX file anyone can fix.

Built with Next.js 16 (App Router), React 19, Tailwind v4, Drizzle (Postgres or SQLite) and MDX.

## Quick start

```bash
npm install
npm run dev                      # http://localhost:3000
npm run build && npm run start   # production build
```

No setup is needed locally: without `DATABASE_URL`, a SQLite file (`local.db`) is created on first use. Copy
`.env.example` to `.env.local` to set anything.

| Variable | What it's for |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Supabase works as-is). Needed for any deployment where accounts must persist. |
| `AUTH_SECRET` | Signs the session cookie. **Required in production**; dev uses an insecure default and warns. |
| `NEXT_PUBLIC_SITE_URL` | The public URL, used by the sitemap, robots.txt and link previews. |
| `SQLITE_PATH` | Where the local SQLite file lives (default `./local.db`). |

Checks:

```bash
npm run lint
npx tsc --noEmit
npx tsx --test $(git ls-files 'src/**/*.test.ts')   # node:test via tsx
```

## What's where

**Public site** (static, in `src/components/site/`): home `/`, `/catalog` and `/catalog/[path]` (every path),
`/how-it-works`, `/about`, `/open-source`, `/faq`, `/privacy`, `/terms`, `/signin`, `/reset`, plus `/onboarding` after
sign-up.

**The app** (`src/app/(learner)/`, inside the sidebar shell; the only place that reads the session):

| Route | Page |
| --- | --- |
| `/dashboard` | Today: next lesson, the day's checklist, reviews due, your paths |
| `/paths`, `/paths/[slug]` | Join a path and follow it topic by topic |
| `/lessons/[slug]` | A lesson, its Check yourself questions and further reading |
| `/practice/*` | Spaced-repetition review: session, card bank, custom decks, a desk per path |
| `/progress`, `/profile`, `/u/[username]`, `/achievements`, `/bookmarks` | Your record, public profile, badges, saved items |
| `/projects/shellforge` | The capstone brief |
| `/settings/*` | Profile, daily goal, appearance, account (password, reset progress, delete account) |

Lessons are open to everyone; Practice and bookmarks work without an account, kept in the browser.

## Content

Lessons are `content/curriculum/<topic-id>/<slug>.mdx`: frontmatter validated by Zod (`src/lib/content/schema.ts`) plus
an MDX body rendered with `next-mdx-remote/rsc` and the components in `src/lib/mdx-components.tsx`. Practice cards are
in `src/lib/practice/bank/`, one file per topic, and unlock as lessons are finished.

Two MDX gotchas with this stack:

- **Expression attributes arrive empty.** `<Foo bar={["a"]} />` renders with `bar` undefined, with no error. Pass JSON
  in a string attribute (`linesJson='["a"]'`) and parse it in the component; use boolean shorthand (`runnable`) for
  booleans.
- **A literal `<` in prose or attributes breaks parsing** (`#include <stdio.h>`). Keep it entity-escaped (`&lt;`) in
  the MDX and decode inside the component (`src/lib/content/entities.ts`).

## Data and auth

`src/lib/db/client.ts` uses Postgres when `DATABASE_URL` is set and SQLite otherwise. Three files describe the schema
and must stay in step: `schema.pg.ts`, `schema.sqlite.ts` and `sqlite-ddl.ts` (SQLite tables are created on first use).
Postgres migrations live in `drizzle/pg/`:

```bash
npm run db:generate   # after changing schema.pg.ts
npm run db:migrate    # apply to the database in DATABASE_URL
```

Auth is our own: bcrypt password hashes and a signed JWT in an httpOnly cookie (`src/lib/auth/`). Every table that
belongs to a user cascades on delete, so deleting an account removes everything in it.

On serverless hosts without `DATABASE_URL`, SQLite falls back to `/tmp`, which is wiped between cold starts: set
`DATABASE_URL` for any real deployment.

## Not built yet

- **Password reset email.** The pages are ready; they say reset isn't available until `RESET_EMAIL_ENABLED` is turned
  on in `src/lib/auth/reset-flow.ts`, which needs reset tokens and email sending (TODOs in
  `src/lib/auth/reset-actions.ts`).
- **ShellForge grading.** The brief explains how to ship; nothing builds or tests a submitted repo.
- **Community.** `/community` is an unlinked preview with sample threads.
- **Paths marked "soon"** (Linux, networking, Python, AI) have outlines but no lessons.

## Contributing

Spot a mistake in a lesson? Every lesson links to its file on GitHub ("Edit on GitHub") and to a prefilled issue.
Design and product decisions are recorded in `docs/superpowers/specs/`; the research behind Practice is in
`docs/learning-science/spaced-repetition.md`.
