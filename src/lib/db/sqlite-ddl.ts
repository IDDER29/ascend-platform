/**
 * Raw DDL for the local SQLite fallback, run once at process start via
 * `CREATE TABLE IF NOT EXISTS`. This is only ever used when DATABASE_URL
 * isn't set (no real Supabase/Postgres configured) -- for a real Postgres
 * target, schema changes go through drizzle-kit migrations instead
 * (see drizzle.config.pg.ts), never auto-applied against a shared database.
 */
export const SQLITE_DDL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  bio TEXT NOT NULL DEFAULT '',
  pace TEXT NOT NULL DEFAULT 'regular',
  theme TEXT NOT NULL DEFAULT 'System',
  accent TEXT NOT NULL DEFAULT '#7B4DFF',
  reminder_time TEXT NOT NULL DEFAULT '19:00',
  notif_streak_reminders INTEGER NOT NULL DEFAULT 1,
  notif_weekly_recap INTEGER NOT NULL DEFAULT 1,
  notif_peer_solutions INTEGER NOT NULL DEFAULT 0,
  notif_product_updates INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS streaks (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current INTEGER NOT NULL DEFAULT 0,
  longest INTEGER NOT NULL DEFAULT 0,
  freezes_available INTEGER NOT NULL DEFAULT 2,
  last_active_date TEXT
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level TEXT NOT NULL,
  slug TEXT NOT NULL,
  completed_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS lesson_progress_user_lesson_idx ON lesson_progress(user_id, level, slug);

CREATE TABLE IF NOT EXISTS badges_earned (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS badges_earned_user_badge_idx ON badges_earned(user_id, badge_id);

CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  ref_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS community_threads (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS community_replies (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL REFERENCES community_threads(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS shellforge_submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repo_url TEXT NOT NULL,
  outcome TEXT NOT NULL,
  attempt INTEGER NOT NULL DEFAULT 1,
  submitted_at INTEGER NOT NULL
);
`;
