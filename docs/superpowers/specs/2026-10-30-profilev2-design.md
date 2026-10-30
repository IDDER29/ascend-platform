# /profilev2 — design (2026-10-30)

## Goal
Dashboard answers "what next?", Practice "what's due?", Progress "am I
getting better?". Profile answers **"who am I as a learner here, and what
have I built?"** — a proof-of-work page the learner is glad to share.
Private numbers (retention, accuracy, due cards) stay on Progress.

Built at `/profilev2` (owner) beside the existing `/profile` (untouched),
plus a public view at `/u/<username>`. Practice "Coach" look
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
1. **Owner bar** (owner only): Public/Private state, public URL, Copy link,
   View as visitor, Make public / Make private.
2. **Hero (dark)**: placeholder avatar, name, @username, bio, link chips
   (icon by host), current level, Edit profile. **Aside: Snapshot** —
   lessons done, projects shipped, own projects, member since.
3. **Curriculum projects**: one card per catalog project. States:
   shipped (link, date, badge) · ready (lessons done, owner sees "Add your
   repo" — hidden from visitors) · next (first project not yet reached,
   owner only) · hidden (not reached).
4. **Own projects** + owner "Add a project" tile. **Aside: Achievements**
   (earned only) and **Journey** (dated real events).
5. **What I can do**: one skill sentence per level, done / in progress /
   next. **Aside (owner): Continue** — next lesson.

Phone: one column in reading order. New learner: hero complete, one
"Your first project" card, "Joined" journey line — never zeros or locked
walls.

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
- Routes `src/app/(learner)/profilev2/page.tsx`,
  `src/app/(learner)/u/[username]/page.tsx`.

## Not in scope
Replacing `/profile`, avatars upload, follower/social features, the
`/achievements` page (it keeps its catalog view).
