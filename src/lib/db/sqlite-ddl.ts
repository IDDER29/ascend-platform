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

CREATE TABLE IF NOT EXISTS practice_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scope_type TEXT NOT NULL,
  scope_label TEXT NOT NULL,
  path_slug TEXT,
  correct INTEGER NOT NULL,
  total INTEGER NOT NULL,
  miss_ids TEXT NOT NULL DEFAULT '[]',
  question_ids TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS practice_sessions_user_created_idx ON practice_sessions(user_id, created_at);

CREATE TABLE IF NOT EXISTS practice_cards (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  state TEXT NOT NULL,
  reps INTEGER NOT NULL DEFAULT 0,
  ease REAL NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  due_at TEXT NOT NULL,
  lapses INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS practice_cards_user_due_idx ON practice_cards(user_id, due_at);

CREATE TABLE IF NOT EXISTS practice_decks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lesson_keys TEXT NOT NULL DEFAULT '[]',
  filter TEXT NOT NULL,
  formats TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS practice_decks_user_idx ON practice_decks(user_id);

CREATE TABLE IF NOT EXISTS practice_settings (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_goal INTEGER NOT NULL DEFAULT 20,
  updated_at INTEGER NOT NULL
);
`;
