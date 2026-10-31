import {
  pgTable,
  text,
  integer,
  boolean,
  doublePrecision,
  index,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  /** Sessions issued before this are no longer valid (set on a password change or reset). */
  passwordChangedAt: timestamp("password_changed_at", { mode: "date" }),
});

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  bio: text("bio").notNull().default(""),
  pace: text("pace").notNull().default("regular"),
  theme: text("theme").notNull().default("System"),
  accent: text("accent").notNull().default("#7B4DFF"),
  reminderTime: text("reminder_time").notNull().default("19:00"),
  notifStreakReminders: boolean("notif_streak_reminders").notNull().default(true),
  notifWeeklyRecap: boolean("notif_weekly_recap").notNull().default(true),
  notifPeerSolutions: boolean("notif_peer_solutions").notNull().default(false),
  notifProductUpdates: boolean("notif_product_updates").notNull().default(false),
});

export const streaks = pgTable("streaks", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  current: integer("current").notNull().default(0),
  longest: integer("longest").notNull().default(0),
  freezesAvailable: integer("freezes_available").notNull().default(2),
  lastActiveDate: text("last_active_date"),
});

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: text("level").notNull(),
    slug: text("slug").notNull(),
    completedAt: timestamp("completed_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("lesson_progress_user_lesson_idx").on(t.userId, t.level, t.slug)],
);

export const badgesEarned = pgTable(
  "badges_earned",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    badgeId: text("badge_id").notNull(),
    earnedAt: timestamp("earned_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("badges_earned_user_badge_idx").on(t.userId, t.badgeId)],
);

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    refId: text("ref_id").notNull(),
    /** The whole bookmark (title, href, reason, note, ...) as JSON, as the browser keeps it. */
    data: text("data").notNull().default("{}"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("bookmarks_user_ref_idx").on(t.userId, t.refId)],
);

/** Recent sign-in, sign-up and reset attempts, for rate limiting (old rows are pruned). */
export const authAttempts = pgTable(
  "auth_attempts",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [index("auth_attempts_key_time_idx").on(t.key, t.createdAt)],
);

/** Password-reset links: only a hash of the token is stored; each one expires and works once. */
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  usedAt: timestamp("used_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const shellforgeSubmissions = pgTable("shellforge_submissions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  repoUrl: text("repo_url").notNull(),
  outcome: text("outcome").notNull(),
  attempt: integer("attempt").notNull().default(1),
  submittedAt: timestamp("submitted_at", { mode: "date" }).notNull().defaultNow(),
});

export const practiceSessions = pgTable("practice_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  scopeType: text("scope_type").notNull(),
  scopeLabel: text("scope_label").notNull(),
  pathSlug: text("path_slug"),
  correct: integer("correct").notNull(),
  total: integer("total").notNull(),
  missIds: text("miss_ids").notNull().default("[]"),
  questionIds: text("question_ids").notNull().default("[]"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const practiceCards = pgTable(
  "practice_cards",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    questionId: text("question_id").notNull(),
    state: text("state").notNull(),
    reps: integer("reps").notNull().default(0),
    ease: doublePrecision("ease").notNull().default(2.5),
    intervalDays: integer("interval_days").notNull().default(0),
    dueAt: text("due_at").notNull(),
    lapses: integer("lapses").notNull().default(0),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [index("practice_cards_user_due_idx").on(t.userId, t.dueAt)],
);

export const practiceDecks = pgTable(
  "practice_decks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    lessonKeys: text("lesson_keys").notNull().default("[]"),
    filter: text("filter").notNull(),
    formats: text("formats").notNull().default("[]"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [index("practice_decks_user_idx").on(t.userId)],
);

export const practiceSettings = pgTable("practice_settings", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  dailyGoal: integer("daily_goal").notNull().default(20),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const profileSettings = pgTable("profile_settings", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  isPublic: boolean("is_public").notNull().default(false),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const profileLinks = pgTable(
  "profile_links",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    label: text("label"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [index("profile_links_user_idx").on(t.userId)],
);

export const projectLinks = pgTable(
  "project_links",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    projectId: text("project_id").notNull(),
    repoUrl: text("repo_url").notNull(),
    addedAt: timestamp("added_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("project_links_user_project_idx").on(t.userId, t.projectId)],
);

export const ownProjects = pgTable(
  "own_projects",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    url: text("url").notNull(),
    tags: text("tags").notNull().default("[]"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [index("own_projects_user_idx").on(t.userId)],
);
