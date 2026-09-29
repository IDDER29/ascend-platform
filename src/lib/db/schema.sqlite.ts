import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
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

export const bookmarks = sqliteTable("bookmarks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  refId: text("ref_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const communityThreads = sqliteTable("community_threads", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const communityReplies = sqliteTable("community_replies", {
  id: text("id").primaryKey(),
  threadId: text("thread_id").notNull().references(() => communityThreads.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
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
