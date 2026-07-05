import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

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
