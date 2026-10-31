import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  passwordChangedAt: integer("password_changed_at", { mode: "timestamp" }),
});

export const profiles = sqliteTable("profiles", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  bio: text("bio").notNull().default(""),
  pace: text("pace").notNull().default("regular"),
  theme: text("theme").notNull().default("System"),
  accent: text("accent").notNull().default("#7B4DFF"),
  reminderTime: text("reminder_time").notNull().default("19:00"),
  notifStreakReminders: integer("notif_streak_reminders", { mode: "boolean" }).notNull().default(true),
  notifWeeklyRecap: integer("notif_weekly_recap", { mode: "boolean" }).notNull().default(true),
  notifPeerSolutions: integer("notif_peer_solutions", { mode: "boolean" }).notNull().default(false),
  notifProductUpdates: integer("notif_product_updates", { mode: "boolean" }).notNull().default(false),
});

export const streaks = sqliteTable("streaks", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  current: integer("current").notNull().default(0),
  longest: integer("longest").notNull().default(0),
  freezesAvailable: integer("freezes_available").notNull().default(2),
  lastActiveDate: text("last_active_date"),
});

export const lessonProgress = sqliteTable(
  "lesson_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: text("level").notNull(),
    slug: text("slug").notNull(),
    completedAt: integer("completed_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [uniqueIndex("lesson_progress_user_lesson_idx").on(t.userId, t.level, t.slug)],
);

export const badgesEarned = sqliteTable(
  "badges_earned",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    badgeId: text("badge_id").notNull(),
    earnedAt: integer("earned_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [uniqueIndex("badges_earned_user_badge_idx").on(t.userId, t.badgeId)],
);

export const bookmarks = sqliteTable(
  "bookmarks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    refId: text("ref_id").notNull(),
    data: text("data").notNull().default("{}"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [uniqueIndex("bookmarks_user_ref_idx").on(t.userId, t.refId)],
);

export const authAttempts = sqliteTable(
  "auth_attempts",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [index("auth_attempts_key_time_idx").on(t.key, t.createdAt)],
);

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  usedAt: integer("used_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const shellforgeSubmissions = sqliteTable("shellforge_submissions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  repoUrl: text("repo_url").notNull(),
  outcome: text("outcome").notNull(),
  attempt: integer("attempt").notNull().default(1),
  submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
});

export const practiceSessions = sqliteTable("practice_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  scopeType: text("scope_type").notNull(),
  scopeLabel: text("scope_label").notNull(),
  pathSlug: text("path_slug"),
  correct: integer("correct").notNull(),
  total: integer("total").notNull(),
  missIds: text("miss_ids").notNull().default("[]"),
  questionIds: text("question_ids").notNull().default("[]"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const practiceCards = sqliteTable(
  "practice_cards",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    questionId: text("question_id").notNull(),
    state: text("state").notNull(),
    reps: integer("reps").notNull().default(0),
    ease: real("ease").notNull().default(2.5),
    intervalDays: integer("interval_days").notNull().default(0),
    dueAt: text("due_at").notNull(),
    lapses: integer("lapses").notNull().default(0),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [index("practice_cards_user_due_idx").on(t.userId, t.dueAt)],
);

export const practiceDecks = sqliteTable(
  "practice_decks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    lessonKeys: text("lesson_keys").notNull().default("[]"),
    filter: text("filter").notNull(),
    formats: text("formats").notNull().default("[]"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [index("practice_decks_user_idx").on(t.userId)],
);

export const practiceSettings = sqliteTable("practice_settings", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  dailyGoal: integer("daily_goal").notNull().default(20),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const profileSettings = sqliteTable("profile_settings", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(false),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const profileLinks = sqliteTable(
  "profile_links",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    label: text("label"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [index("profile_links_user_idx").on(t.userId)],
);

export const projectLinks = sqliteTable(
  "project_links",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    projectId: text("project_id").notNull(),
    repoUrl: text("repo_url").notNull(),
    addedAt: integer("added_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [uniqueIndex("project_links_user_project_idx").on(t.userId, t.projectId)],
);

export const ownProjects = sqliteTable(
  "own_projects",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    url: text("url").notNull(),
    tags: text("tags").notNull().default("[]"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [index("own_projects_user_idx").on(t.userId)],
);
