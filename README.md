# Ascend (Next.js rebuild)

A real Next.js/TypeScript rebuild of [Ascend](../repo) — same design, same
24-lesson curriculum, different foundation. Where the static prototype
(`../repo`) is 50 self-contained `.dc.html` files with copy-pasted inline
CSS, this project makes the same product genuinely open-source-friendly:
lesson content lives as plain `.mdx` files anyone can PR a fix to, and the
UI is a small set of real, reused components instead of inline styles
repeated on every page.

## Status

**Done**: design system, homepage, full 24-lesson curriculum (all real
content, real navigation, no placeholders), `/curriculum` index,
`/dashboard`, `/practice` (a genuinely interactive quiz — not a static
mockup: real question state, scoring, streaks, a timer, and a results
screen, all client-side), `/playground` (a real multi-file editable code
scratchpad — genuine `<textarea>` editing across `main.c`/`scratch.c`/
`bitwise_test.c`/`notes.md`, quick-start snippet loading, and an honest Run
button: known snippets show their real compiled output, custom edits get
an honest "can't compile this in preview" message rather than a faked
result), `/progress` (stat cards, an XP-over-time chart, mastery-by-level
bars, recent completions — all real markup driven by real per-level data,
not a static image), `/achievements` (24 real badges across earned/
in-progress/locked states with functional client-side filter chips, an
"almost there" in-progress section, and a hero progress ring),
`/bookmarks` (real filter tabs by kind, and a genuine remove-bookmark
interaction backed by client state — not just a static list; saved
lessons/snippets link to their real destinations, saved resources without
a real URL render as honest non-links instead of dead `href="#"`s),
a global **⌘K command palette** (`src/components/command-palette.tsx`,
mounted once in the root layout — real search over all 24 lessons plus
quick actions, full keyboard nav, reachable from any page via `⌘K`/`Ctrl+K`
or the topbar search bar), a **notifications dropdown** anchored to the
topbar bell (real items derived from the same badge/streak data used
elsewhere, unread dot clears on open, click-outside closes it), and
`/profile` (hero stats, per-level skill mastery, earned badges, activity
heatmap — all reusing the same real data sources as Dashboard/Achievements/
Progress rather than a second hardcoded copy), `/onboarding` (a real
4-step flow — goal and pace are actual client state, not decoration: the
step 4 summary reflects whatever the user actually picked, and "Start
learning" links to the real first lesson), a custom `not-found.tsx` (real
quick links plus a "Search Ascend" button that opens the actual command
palette, not just decoration), `/level-complete/[level]` (real per-level
concept counts and XP math, and a real "Start Level 0X" link to that
level's actual first lesson — reachable by finishing the last lesson of
any level, which now shows a "Finish level" button instead of "Next"),
and `/streak-lost` (a real streak-freeze toggle and a "next lesson" card
computed from real curriculum data, using the same fixed demo XP/streak
numbers as the rest of the app).
Every "Learn"/"You" sidebar nav item, the topbar search bar, bell, and
avatar now point to a real, working destination.

**Also done, and now backed by a real database**: `/signin` (split-layout
sign-in/create-account with a real tab toggle, live validation, a working
password-visibility toggle) creates and authenticates real accounts —
bcrypt-hashed passwords, a signed JWT session cookie, real `users`/
`profiles`/`streaks` rows — against Supabase in production or a local
SQLite file with zero setup (see "Backend" below). The one part that's
still an honest stub is OAuth: the GitHub/Google buttons show "OAuth isn't
wired up in this preview" rather than pretending to authenticate. Once
signed in, the real name/avatar initial show up in the sidebar, topbar,
and `/profile` (with a "Sign out" control); signed-out visitors still see
the same demo "Amine" account everywhere else, since none of the XP/
streak/badge numbers are wired to real per-user data yet — see "What's
deferred and why".

Also built, **frontend-only and honestly fake** (no real backend for this
part yet — see the note below): a full password-reset journey —
`/reset` (request → a real "check your inbox" state with a
live resend cooldown and two explicit branches, since there's no real
email to click), `/reset/new-password` (a password-strength meter and
confirm-match check computed live from what's actually typed, not
hardcoded), `/reset/expired` (the honest expired-link state), `/community`
(a discussion hub with real seed threads, working category filters, a
genuine Latest/Unanswered toggle, expandable thread replies, and a real
"start a discussion" compose form that posts a new thread to the top of
the list via client state), `/settings` (every field is real controlled
state — profile inputs, a live bio character counter, pace/theme/accent
pickers, notification toggles — with an honest "changes save for this
session only" note, and Danger Zone buttons that show an explicit
disclosure instead of silently pretending to reset/delete anything), and
the Shellforge capstone project — `/projects/shellforge` (a real
requirements checklist you can self-track, backed by client state, not
just prose), `/projects/shellforge/submit` (an honest submission form:
since there's no real auto-grader, you explicitly pick which outcome to
simulate), and `/projects/shellforge/result` (renders the real passed or
failed state — test breakdown, build output/fix diff, rewards — based on
that choice).

**Not built yet**: real per-user progress-tracking (lesson completions,
streaks, bookmarks, badges), real community persistence, and Discord
integration, monorepo tooling. The `lesson_progress`, `bookmarks`,
`community_threads`/`community_replies`, and `shellforge_submissions`
tables already exist in the schema (see "Backend" below) — no page reads
or writes them yet, so every stat/list on those screens is still the
shared fixture data, real account or not. These were deliberately
deferred — see "What's deferred and why" below. Sidebar nav
items for screens that don't exist yet render as disabled (grayed out, "Soon"
label, no link) rather than pointing anywhere — see `NavItem`'s
`disabled` prop.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # production build
```

## Repository layout

```
content/curriculum/{level}/{slug}.mdx   The 24 real lessons (frontmatter + MDX body)
content-source/*.json                   Original structured JSON the 23 template-
                                         generated lessons were drafted from (kept
                                         for reference; not read at runtime)
scripts/convert-lessons.py               One-time converter: content-source/*.json
                                         → content/curriculum/**/*.mdx
src/app/
  page.tsx                              Homepage
  curriculum/page.tsx                   Curriculum index (all 4 levels, all 24 lessons)
  curriculum/[level]/[slug]/page.tsx    Lesson page template (SSG via generateStaticParams)
  (app)/                                Route group: reads the session (see "Backend")
    dashboard/, playground/,
    progress/, achievements/, bookmarks/,
    profile/, settings/,
    projects/shellforge/,
    projects/shellforge/submit/,
    projects/shellforge/result/          The signed-in app-shell screens + Shellforge capstone
                                         (Shellforge itself is still honestly fake — no real
                                         auto-grader — see Known limitations)
  practice/                             App-shell screen that doesn't need the session (icon sidebar)
  signin/                               Real signup/signin/signout (see "Backend")
  reset/, reset/new-password/,
  reset/expired/, community/            Frontend-only reset/community (honestly fake — see Known limitations)
  level-complete/[level]/, streak-lost/  Real per-level/curriculum data, no fake backend needed
  not-found.tsx                         Custom 404
  globals.css                           Tailwind v4 @theme: every design token
  layout.tsx                            Fonts + mounts the global <CommandPalette> (no session read —
                                         keeps the homepage/lesson pages statically generated)
src/components/
  ui/            Shared primitives: Button, Card, Chip, NavItem, KnowledgeCheck,
                 ProgressBar, Sidebar, LabeledSidebar, AppTopbar, NotificationsBell
  command-palette.tsx  Global ⌘K overlay (search over lessons + quick actions)
  auth/          AuthSplitLayout — shared dark-panel/form-panel shell for signin/reset pages
  homepage/      Marketing sections
  lesson/        Lesson-page-specific: LearningOutcomes, OnThisPageRail, LessonFooter,
                 MemoryDiagram + CodeLab (bespoke, for the hand-authored flagship lesson),
                 Visual + CodeBlock + TruthTable (data-driven, for the 23 generated lessons)
src/lib/
  db/, auth/              Real backend — see "Backend" section below
  content/schema.ts       Zod schema for lesson frontmatter
  content/lessons.ts      getLesson / getAllLessons / getLessonNavigation (cross-level prev/next)
  mdx-components.tsx      Maps custom tags (<Visual>, <CodeBlock>, <TruthTable>, ...) for MDXRemote
  playground-snippets.ts  Known-good C snippets + their real compiled output
  achievements-data.ts    The 24 badges (earned/in-progress/locked) — fixture data, not yet
                          wired to real per-user rows (see "What's deferred and why")
  bookmarks-data.ts       Seed bookmark items
  notifications-data.ts   Notification items (derived from achievements-data)
  community-data.ts       Seed discussion threads + categories
```

## Content pipeline

Frontmatter carries structured data (title, learning outcomes, knowledge
check, assignment, additional resources) validated against a Zod schema;
the MDX body carries prose plus inline custom components for diagrams/code/
tables. Read via `gray-matter`, rendered via `next-mdx-remote/rsc`.

Every lesson's assignment link and additional-resource links (`resourceUrl`/
`url` fields) point to real, individually-verified external URLs (man7.org
man pages, cppreference.com, Beej's Guides, Wikipedia, official textbook/
project sites, specific YouTube videos) — not placeholders. A handful of
additional-resource entries whose titles describe the lesson's own inline
diagram (e.g. "Pointers, visualized") have no external match and
intentionally render as a non-clickable reference rather than a fake link.

23 of the 24 lessons were template-generated from JSON content drafted
earlier (see `content-source/`) via `scripts/convert-lessons.py`. The
flagship lesson (`level-02-the-c-language/what-a-pointer-really-is.mdx`,
"What a pointer really is") was hand-transcribed from the static
prototype's one hand-authored lesson and gets bespoke, more elaborate
components (an actually-interactive `<CodeLab>` with a working Run button,
not just a static code display).

## ⚠️ A real gotcha: MDX drops curly-brace expression attributes

**This bit hours during the lesson migration — read this before passing any
non-string prop to an MDX component.**

With this project's stack (`next-mdx-remote/rsc` + Next 16 Turbopack + MDX),
a JSX expression-container attribute — `<Foo bar={someExpression} />`, e.g.
`lines={["a", "b"]}` or `caption={someVar}` — **silently evaluates to an
empty props object at render time.** No compile error, no runtime error
beyond whatever your component does with an undefined prop (usually
`Cannot read properties of undefined (reading 'map')`). Plain quoted string
attributes (`bar="literal text"`) work completely normally.

**The fix used throughout `scripts/convert-lessons.py` and the `CodeBlock`/
`TruthTable`/`Visual` components**: never emit `prop={...}` in generated
MDX. For arrays/objects, `JSON.stringify` the value into a plain string
attribute (e.g. `linesJson='[...]'`) and `JSON.parse` it back inside the
component. For booleans, use JSX's boolean-attribute shorthand (`runnable`
present = true, omitted = false) instead of `runnable={true}`.

A second, related gotcha: a **literal `<` character inside any MDX prose or
attribute** — even one meant as plain text, like `#include <stdio.h>` — is
parsed as the start of a new JSX tag and breaks compilation. Content
embedded into MDX from an external source should stay HTML-entity-escaped
(`&lt;`/`&gt;`/`&amp;`) rather than decoded, with the *component* decoding
entities right before it renders text to the user (see `decodeEntities()`
in `code-block.tsx`, `truth-table.tsx`, `visual.tsx`). Don't decode entities
before they're embedded in MDX source — only after they come back out.

Multi-paragraph HTML (`<p>...</p><p>...</p>` concatenated into one string,
as the source JSON does for `intro` fields) needs each internal
`</p><p>` boundary converted to a blank line — stripping only the
outermost `<p>`/`</p>` leaves an orphaned closing tag mid-string, which MDX
rejects with "Unexpected closing slash".

## Design system

Tokens live in `src/app/globals.css`'s `@theme` block: the brand gradient
(`#7B4DFF → #C13AE0 → #FF6B4A`), per-level accent colors, surfaces/ink
colors, shadows, and keyframes — all extracted directly from the static
prototype so the two stay visually identical. See `../repo/README.md`'s
design-system section for the full token reference table.

## Backend

Real data layer, no external service required to run it locally:

```
src/lib/db/
  schema.pg.ts        Drizzle schema for Postgres/Supabase
  schema.sqlite.ts    The same tables, column-for-column, for the sqlite dialect
  sqlite-ddl.ts        Raw CREATE TABLE IF NOT EXISTS for the local fallback
  client.ts           Picks a backend at runtime and exports `db` + `schema`
src/lib/auth/
  session.ts          Signed JWT cookie (jose) — createSessionToken/getSessionUserId
  auth.ts             signUp / signIn / getCurrentUser (bcrypt, no external auth service)
  actions.ts          signOutAction (server action)
  context.tsx         AuthProvider/useAuthUser — passes the current user to client components
src/app/(app)/         Route group: every screen that reads the session
  layout.tsx           (dashboard, profile, settings, achievements, progress,
                       bookmarks, playground, projects/*) — fetches getCurrentUser()
                       once here, not in the root layout
drizzle.config.pg.ts   `npm run db:generate` / `npm run db:migrate` against Postgres
```

**Backend selection is one env var.** If `DATABASE_URL` is set, `db` is a
`drizzle-orm/postgres-js` instance against that Postgres connection string
(Supabase's connection string works as-is — Supabase is used here purely
as hosted Postgres, not its own Auth/Storage products). If it's unset, `db`
falls back to a local SQLite file (`./local.db`, path overridable via
`SQLITE_PATH`) that's created and schema-migrated automatically on first
use — this is what runs by default in dev and in CI/tests, with zero setup.
Repository code (`src/lib/auth/auth.ts`, and anything written later against
`lesson_progress`/`bookmarks`/etc.) is written once against the Postgres-
shaped types and never branches on which backend is live — see the comment
in `client.ts` for why that cast is safe (the two schemas are kept
structurally identical on purpose).

**Auth is real, and deliberately not Supabase Auth.** Passwords are
bcrypt-hashed, sessions are a signed JWT in an httpOnly cookie (`jose`,
`AUTH_SECRET` env var — falls back to an insecure dev-only default with a
console warning if unset). This runs identically against either backend,
which is the whole point: exercising real signup/login/logout doesn't
require an actual Supabase project to exist. Route-scoping matters here —
`getCurrentUser()` is only called in `src/app/(app)/layout.tsx`, not the
root layout, because reading the session cookie opts a route into dynamic
rendering; scoping it to the `(app)` group keeps the homepage and all 24
lesson pages statically generated (`npm run build` output shows `○`/`●`
for those, `ƒ` only for the signed-in screens).

**Env vars** (see `.env.example`): `DATABASE_URL` (Supabase/Postgres,
optional), `SQLITE_PATH` (optional override), `AUTH_SECRET` (required for
any real deployment).

## What's deferred and why

A database now exists (see "Backend" above), but real progress-tracking
(wiring lesson completions/streaks/bookmarks/badges to actual per-user
rows instead of shared fixtures) and community/Discord integration still
need more work than this pass covered. Monorepo tooling (Turborepo/pnpm
workspaces) is premature for one app with no sibling packages. All of this
is designed to bolt on later
without a rewrite: the content layer is already file-based and
framework-agnostic, and the component system doesn't assume anything about
auth state.

## Known limitations

- Every screen from the static prototype is now built. `/signin` is real
  (see "Backend"): signup/signin/signout hit an actual `users` table,
  bcrypt-hashed passwords, a real signed session cookie. `/reset` (+
  `/reset/new-password`, `/reset/expired`), `/community`, and `/settings`
  are real, fully interactive frontends, but still deliberately fake
  underneath: no real email delivery, no real discussion persistence
  (posted threads reset on reload), and Settings changes save only for the
  current session — the Danger Zone buttons explicitly say so rather than
  silently no-op'ing. `/settings` also doesn't yet read or write the real
  signed-in user's `profiles` row (it's the same demo fixture data
  regardless of who's logged in) — wiring that up, plus real lesson-
  progress/streak/bookmark tracking, is the next real-backend milestone,
  not this one. See "What's deferred and why" below.
- The Shellforge capstone (`/projects/shellforge`) is the same kind of
  honest fake: there's no real auto-grader to clone, build, or test a
  submitted repo. `/projects/shellforge/submit` says so directly and asks
  you to pick which outcome to simulate; `/projects/shellforge/result`
  then renders that real passed/failed state (test breakdown, rewards,
  build output or a concrete fix) rather than pretending to have actually
  run anything.
- The Playground doesn't actually compile arbitrary C — there's no backend
  sandbox to run it in. It recognizes a small library of known snippets and
  shows their real, previously-verified compiled output; any other edit
  gets an honest message saying so, instead of faking a result.
- No dark mode (the static prototype doesn't have one either).
- Progress bars, streaks, and XP shown throughout are cosmetic — there's no
  backend to persist real progress yet. The dashboard's numbers are the
  same fixed demo data as the static prototype.
