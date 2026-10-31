# Deploying Ascend (Vercel + Neon)

Production runs on Vercel with Postgres on Neon. SQLite is for local development and tests only; a
Vercel deployment without `DATABASE_URL` has no accounts (content still works) rather than a
throwaway database that would lose data.

## One-time setup
1. **Neon:** create a project (region close to the Vercel functions, e.g. `us-east-1` for `iad1`).
   Copy two connection strings:
   - the **pooled** one (host contains `-pooler`), for the app: `DATABASE_URL`;
   - the **direct** one, for migrations.
   For preview deployments, create a Neon branch and use its pooled URL in Vercel's Preview environment.
2. **Migrations:** apply the schema to the new database with the direct URL:
   `DATABASE_URL="<direct URL>" npm run db:migrate`
   Re-run after any change to `src/lib/db/schema.pg.ts` (generate first with `npm run db:generate`;
   keep `schema.sqlite.ts` and `sqlite-ddl.ts` in step: `schema-parity.test.ts` checks).
3. **Vercel:** import the repo. Build command `npm run build` (the default). Environment variables
   (Production, and Preview with the branch database):
   - `DATABASE_URL`: Neon pooled URL (with `sslmode=require`).
   - `AUTH_SECRET`: `openssl rand -base64 48`. Required; at least 32 characters. Changing it signs
     everyone out.
   - `NEXT_PUBLIC_SITE_URL`: e.g. `https://ascend.example` (sitemap, link previews, reset emails).
   - `RESEND_API_KEY` and `EMAIL_FROM` (optional): password reset by email. Without them the reset pages
     say reset isn't available yet. `EMAIL_FROM` must be on a domain verified in Resend.
4. **Uptime:** point a monitor at `GET /api/health` (503 when the database is unreachable).

## Each deploy
- Tests, type-check, lint and build pass locally (see CLAUDE.md).
- If the schema changed: run the migration against the Neon branch, deploy a preview, smoke-test it,
  then migrate production and promote.
- Smoke test: sign up, finish a lesson, practise, bookmark, change the password (other sessions are
  signed out), request a reset email, delete the test account.

## What production enforces
- Postgres only (`src/lib/db/client.ts`), pooled with `prepare: false` for Neon's pooler, one retry on
  transient connection errors (`src/lib/db/retry.ts`).
- `AUTH_SECRET` of 32+ characters; sessions issued before a password change or reset are rejected.
- Rate limits on sign-in (per IP, and failed sign-ins per email), sign-up, password reset and
  current-password checks (`src/lib/auth/rate-limit-rules.ts`), recorded before counting so parallel
  requests can't slip past them.
- Everything the browser sends is checked on the server: lesson completions must name a real lesson,
  settings and Practice sessions are validated (`settings-rules.ts`, `session-rules.ts`), bookmarks
  are cleaned (`sync-rules.ts`).
- Password-reset requests do their work after the response, so the answer time doesn't reveal which
  emails have accounts.
- Lesson pages read `content/` at request time; `outputFileTracingIncludes` in `next.config.ts` ships
  the whole folder with them (the tracer would otherwise drop the `.c`, `.h` and `.txt` program files).
- Reset links: single-use, 30 minutes, only a hash stored, built from `NEXT_PUBLIC_SITE_URL` (never
  from the request's Host header).
- Security headers and a Content-Security-Policy on every response (`next.config.ts`).
