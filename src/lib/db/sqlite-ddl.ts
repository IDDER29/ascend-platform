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
  created_at INTEGER NOT NULL,
  password_changed_at INTEGER
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
  data TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_user_ref_idx ON bookmarks(user_id, ref_id);

CREATE TABLE IF NOT EXISTS auth_attempts (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS auth_attempts_key_time_idx ON auth_attempts(key, created_at);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
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

CREATE TABLE IF NOT EXISTS profile_settings (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  is_public INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS profile_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  label TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS profile_links_user_idx ON profile_links(user_id);

CREATE TABLE IF NOT EXISTS project_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  added_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS project_links_user_project_idx ON project_links(user_id, project_id);

CREATE TABLE IF NOT EXISTS own_projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS own_projects_user_idx ON own_projects(user_id);
`;

/**
 * Columns added after a table first shipped. CREATE TABLE IF NOT EXISTS won't add them to an
 * existing local.db, so each is added once if missing (see client.ts).
 */
export const SQLITE_ADDED_COLUMNS: { table: string; column: string; ddl: string }[] = [
  { table: "users", column: "password_changed_at", ddl: "ALTER TABLE users ADD COLUMN password_changed_at INTEGER" },
  { table: "bookmarks", column: "data", ddl: "ALTER TABLE bookmarks ADD COLUMN data TEXT NOT NULL DEFAULT '{}'" },
];
