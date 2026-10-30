# /profilev2 — design (2026-10-30)

## Goal
Dashboard answers "what next?", Practice "what's due?", Progress "am I
getting better?". Profile answers **"who am I as a learner here, and what
have I built?"** — a proof-of-work page the learner is glad to share.
Private numbers (retention, accuracy, due cards) stay on Progress.

Built at `/profilev2` (owner) beside the existing `/profile`, plus a
public view at `/u/<username>`. **Cutover (2026-10-30):** the owner page
now lives at `/profile`; the old page is deleted (its Sign out moved into
the new page) and `/profilev2` redirects there. Practice "Coach" look
(`.practice-coach-v2` tokens), same main column + 280px aside.

## Decisions (from the user)
- Profiles can be public.
- **Curriculum projects** are the curriculum's project work. The learner
  adds their own repo link; finishing the project's lessons **and** adding
  the link earns that project's badge.
- Learners can add **own projects** (title, one line, link, tags), shown
  separately and never linked to curriculum badges.
- Learners can add public links (GitHub, LinkedIn, website, anything).

## My calls
- Profiles start **private**; one click in the owner bar makes them public.
  A visitor gets a 404 for a private or unknown username.
- Curriculum project catalog (`src/lib/profile/projects.ts`):
  Half adder (lesson `project-half-adder`, new badge "Gate Builder") and
  ShellForge (capstone: every Level 03 lesson, existing badge "Ship It").
  A test fails if a `project-*` lesson is missing from the catalog. The
  ShellForge demo submission table is not used (its outcome is self-picked).
- Badges are written to `badges_earned` when the link is saved and the
  lessons are done (or when the last lesson is finished later and the
  profile is next viewed). Removing a link keeps an earned badge.
- Path isn't shown: followed paths live in a browser cookie, not the account.
- Limits: 6 links, 12 own projects; links must be http(s).
- Editing name / username / bio stays in Settings ("Edit profile").

## Layout
1. **Owner bar** (owner only): public/private in a sentence, Copy link,
   View as visitor, Make public / Make private.
2. **Hero (dark, full width)**: placeholder avatar, name, @username, bio,
   link chips (mark by host), Edit profile, and one plain sentence of
   facts ("6 of 25 lessons finished, 1 curriculum project shipped… On
   Ascend since Oct 2026") instead of stat tiles.
3. **The stack** — the signature element. The learner's climb drawn as
   the abstraction stack, Level 00 at the bottom: one slab per level with
   its skill sentence and lesson pips. Done = dark slab, lime pips;
   current = white with a blue edge and (owner) "Continue with <lesson>";
   ahead = dashed. Each curriculum project is pinned to its layer:
   shipped (repo, badge, date) · ready (owner: "Ship X: add your repo"
   opens the form inline) · next (owner). Pips light up bottom-up once on
   load; skipped with reduced motion.
4. **Own projects** grid + owner "Add something you've built" tile.
   **Aside:** Achievements (earned only) and Journey (dated real events).

Phone: one column in reading order; project pills sit under the layer
text. New learner: hero complete, the stack with Level 00 as "about to
start" and the first project as next, "Joined" journey line.

## Development preview (temporary)
While the app is in development, signed-out visitors to `/profile` see a
sample learner (made-up data, owner view, under a "Development preview"
banner) instead of the sign-in prompt, so the page can be reviewed without
an account. Edits fail with "Sign in to edit your profile.".
**Before launch:** set `SHOW_SAMPLE_PROFILE_TO_GUESTS` to false in
`src/lib/profile/sample-profile.ts` and delete that file.

## Data
New tables (Postgres + SQLite DDL): `profile_settings` (is_public),
`profile_links`, `project_links` (user, project, repo_url, added_at),
`own_projects`. Read: profile, lesson_progress, badges_earned,
practice_sessions (count + first date).

## Architecture
- Pure `src/lib/profile/profile-model.ts` + tests; `links.ts` (validation,
  host → kind) + tests; `projects.ts` catalog.
- `src/lib/profile/queries.ts`, `actions.ts` (server actions).
- Components in `src/components/profile-v2/`.
- Routes `src/app/(learner)/profile/page.tsx` (was `profilev2/`),
  `src/app/(learner)/u/[username]/page.tsx`.

## Not in scope
Avatar upload, follower/social features, the
`/achievements` page (it keeps its catalog view).
