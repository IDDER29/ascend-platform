import "server-only";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { getAllLessons } from "@/lib/content/lessons";
import { lessonHref } from "@/lib/paths/lesson-urls";
import type {
  ContinueLesson,
  LessonCompletion,
  ProfileSettings,
  ProfileSettingsUpdate,
  StreakInfo,
} from "./types";

export type {
  ContinueLesson,
  LessonCompletion,
  ProfileSettings,
  ProfileSettingsUpdate,
  StreakInfo,
} from "./types";

export class ProgressError extends Error {}

function requireDb() {
  if (!db) {
    throw new ProgressError(
      "Progress isn't available right now (the database isn't reachable). Try again shortly.",
    );
  }
  return db;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export async function listCompletedLessons(userId: string): Promise<LessonCompletion[]> {
  const conn = requireDb();
  const rows = await conn.query.lessonProgress.findMany({
    where: eq(schema.lessonProgress.userId, userId),
  });
  return rows.map((r) => ({
    level: r.level,
    slug: r.slug,
    completedAt: r.completedAt instanceof Date ? r.completedAt : new Date(r.completedAt),
  }));
}

export async function isLessonComplete(
  userId: string,
  level: string,
  slug: string,
): Promise<boolean> {
  const conn = requireDb();
  const row = await conn.query.lessonProgress.findFirst({
    where: and(
      eq(schema.lessonProgress.userId, userId),
      eq(schema.lessonProgress.level, level),
      eq(schema.lessonProgress.slug, slug),
    ),
  });
  return Boolean(row);
}

/** First incomplete lesson in curriculum order; if all done, last lesson. */
export async function getContinueLesson(userId: string): Promise<ContinueLesson> {
  const completed = await listCompletedLessons(userId);
  const done = new Set(completed.map((c) => `${c.level}/${c.slug}`));
  const all = getAllLessons();
  const next = all.find((l) => !done.has(`${l.meta.level}/${l.meta.slug}`)) ?? all[all.length - 1];
  if (!next) {
    throw new ProgressError("No lessons found in the curriculum.");
  }
  return {
    level: next.meta.level,
    slug: next.meta.slug,
    title: next.meta.title,
    href: lessonHref(next.meta.level, next.meta.slug),
    order: next.meta.order,
  };
}

export async function countCompletedInLevel(userId: string, level: string): Promise<number> {
  const completed = await listCompletedLessons(userId);
  return completed.filter((c) => c.level === level).length;
}

export async function getStreak(userId: string): Promise<StreakInfo | null> {
  if (!db) return null;
  const row = await db.query.streaks.findFirst({
    where: eq(schema.streaks.userId, userId),
  });
  if (!row) return null;
  return {
    current: row.current,
    longest: row.longest,
    freezesAvailable: row.freezesAvailable,
    lastActiveDate: row.lastActiveDate,
  };
}

export async function markLessonComplete(
  userId: string,
  level: string,
  slug: string,
): Promise<{ alreadyComplete: boolean; streak: StreakInfo | null }> {
  const conn = requireDb();
  const existing = await conn.query.lessonProgress.findFirst({
    where: and(
      eq(schema.lessonProgress.userId, userId),
      eq(schema.lessonProgress.level, level),
      eq(schema.lessonProgress.slug, slug),
    ),
  });

  if (!existing) {
    await conn.insert(schema.lessonProgress).values({
      id: crypto.randomUUID(),
      userId,
      level,
      slug,
      completedAt: new Date(),
    });
  }

  const streak = await bumpStreak(userId);
  return { alreadyComplete: Boolean(existing), streak };
}

async function bumpStreak(userId: string): Promise<StreakInfo | null> {
  const conn = requireDb();
  const row = await conn.query.streaks.findFirst({
    where: eq(schema.streaks.userId, userId),
  });
  if (!row) return null;

  const today = todayISO();
  let current = row.current;
  let longest = row.longest;

  if (row.lastActiveDate === today) {
    // already counted today
  } else if (row.lastActiveDate === yesterdayISO()) {
    current = row.current + 1;
    longest = Math.max(longest, current);
  } else {
    current = 1;
    longest = Math.max(longest, current);
  }

  await conn
    .update(schema.streaks)
    .set({ current, longest, lastActiveDate: today })
    .where(eq(schema.streaks.userId, userId));

  return {
    current,
    longest,
    freezesAvailable: row.freezesAvailable,
    lastActiveDate: today,
  };
}

export async function getProfileSettings(userId: string): Promise<ProfileSettings | null> {
  if (!db) return null;
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, userId) });
  if (!user) return null;
  const profile = await db.query.profiles.findFirst({
    where: eq(schema.profiles.userId, userId),
  });
  if (!profile) return null;

  return {
    userId,
    email: user.email,
    name: profile.name,
    username: profile.username,
    bio: profile.bio,
    pace: profile.pace,
    theme: profile.theme,
    accent: profile.accent,
    reminderTime: profile.reminderTime,
    notifStreakReminders: profile.notifStreakReminders,
    notifWeeklyRecap: profile.notifWeeklyRecap,
    notifPeerSolutions: profile.notifPeerSolutions,
    notifProductUpdates: profile.notifProductUpdates,
  };
}

export async function updateProfileSettings(
  userId: string,
  input: ProfileSettingsUpdate,
): Promise<ProfileSettings> {
  const conn = requireDb();
  const name = input.name.trim();
  const username = input.username.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "").slice(0, 32);
  if (!name) throw new ProgressError("Enter your name.");
  if (!username) throw new ProgressError("Enter a username.");

  const taken = await conn.query.profiles.findFirst({
    where: eq(schema.profiles.username, username),
  });
  if (taken && taken.userId !== userId) {
    throw new ProgressError("That username is already taken.");
  }

  await conn
    .update(schema.profiles)
    .set({
      name,
      username,
      bio: input.bio.trim(),
      pace: input.pace,
      theme: input.theme,
      accent: input.accent,
      reminderTime: input.reminderTime,
      notifStreakReminders: input.notifStreakReminders,
      notifWeeklyRecap: input.notifWeeklyRecap,
      notifPeerSolutions: input.notifPeerSolutions,
      notifProductUpdates: input.notifProductUpdates,
    })
    .where(eq(schema.profiles.userId, userId));

  const updated = await getProfileSettings(userId);
  if (!updated) throw new ProgressError("Could not reload profile after save.");
  return updated;
}

/** Merge a patch onto current settings, then save (sectioned Settings). */
export async function patchProfileSettings(
  userId: string,
  patch: import("./types").ProfileSettingsPatch,
): Promise<ProfileSettings> {
  const current = await getProfileSettings(userId);
  if (!current) throw new ProgressError("Could not load your profile.");
  return updateProfileSettings(userId, {
    name: patch.name ?? current.name,
    username: patch.username ?? current.username,
    bio: patch.bio ?? current.bio,
    pace: patch.pace ?? current.pace,
    theme: patch.theme ?? current.theme,
    accent: patch.accent ?? current.accent,
    reminderTime: patch.reminderTime ?? current.reminderTime,
    notifStreakReminders:
      patch.notifStreakReminders ?? current.notifStreakReminders,
    notifWeeklyRecap: patch.notifWeeklyRecap ?? current.notifWeeklyRecap,
    notifPeerSolutions: patch.notifPeerSolutions ?? current.notifPeerSolutions,
    notifProductUpdates:
      patch.notifProductUpdates ?? current.notifProductUpdates,
  });
}
