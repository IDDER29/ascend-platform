import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
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

export const bookmarks = pgTable("bookmarks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  refId: text("ref_id").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const communityThreads = pgTable("community_threads", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const communityReplies = pgTable("community_replies", {
  id: text("id").primaryKey(),
  threadId: text("thread_id").notNull().references(() => communityThreads.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
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
