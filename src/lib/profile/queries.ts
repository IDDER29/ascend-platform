import "server-only";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { completionKey } from "@/lib/practice/session";
import { listCompletedLessons } from "@/lib/progress/queries";
import type { ProfileInput } from "./profile-model";

export type ProfileOwner = {
  userId: string;
  name: string;
  username: string;
  bio: string;
  joinedAt: string;
};

function iso(value: Date | number | string): string {
  return (value instanceof Date ? value : new Date(value)).toISOString();
}

/** The profile behind a username, or null. Says nothing about visibility. */
export async function getProfileByUsername(username: string): Promise<ProfileOwner | null> {
  if (!db) return null;
  const profile = await db.query.profiles.findFirst({ where: eq(schema.profiles.username, username) });
  if (!profile) return null;
  return getProfileOwner(profile.userId);
}

export async function getProfileOwner(userId: string): Promise<ProfileOwner | null> {
  if (!db) return null;
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, userId) });
  const profile = await db.query.profiles.findFirst({ where: eq(schema.profiles.userId, userId) });
  if (!user || !profile) return null;
  return {
    userId,
    name: profile.name,
    username: profile.username,
    bio: profile.bio,
    joinedAt: iso(user.createdAt),
  };
}

export async function isProfilePublic(userId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const rows = await db
      .select({ isPublic: schema.profileSettings.isPublic })
      .from(schema.profileSettings)
      .where(eq(schema.profileSettings.userId, userId))
      .limit(1);
    return rows[0]?.isPublic ?? false;
  } catch {
    // Table may not exist yet on Postgres until migrated.
    return false;
  }
}

/** Run a read that may hit a not-yet-migrated table; empty on failure. */
async function orEmpty<T>(read: () => Promise<T[]>): Promise<T[]> {
  try {
    return await read();
  } catch {
    return [];
  }
}

/** Everything the profile model reads for one learner, except the lesson list. */
export async function loadProfileRecords(
  userId: string,
): Promise<Omit<ProfileInput, "viewer" | "profile" | "lessons">> {
  const conn = db;
  if (!conn) {
    return {
      isPublic: false,
      completions: [],
      projectLinks: [],
      ownProjects: [],
      links: [],
      badges: [],
      practice: { sessions: 0, firstAt: null, tenthAt: null },
    };
  }

  const [isPublic, completions, projectLinks, ownProjects, links, badges, sessions] = await Promise.all([
    isProfilePublic(userId),
    orEmpty(() => listCompletedLessons(userId)),
    orEmpty(() => conn.select().from(schema.projectLinks).where(eq(schema.projectLinks.userId, userId))),
    orEmpty(() =>
      conn
        .select()
        .from(schema.ownProjects)
        .where(eq(schema.ownProjects.userId, userId))
        .orderBy(asc(schema.ownProjects.createdAt)),
    ),
    orEmpty(() =>
      conn
        .select()
        .from(schema.profileLinks)
        .where(eq(schema.profileLinks.userId, userId))
        .orderBy(asc(schema.profileLinks.createdAt)),
    ),
    orEmpty(() => conn.select().from(schema.badgesEarned).where(eq(schema.badgesEarned.userId, userId))),
    orEmpty(() =>
      conn
        .select({ createdAt: schema.practiceSessions.createdAt })
        .from(schema.practiceSessions)
        .where(eq(schema.practiceSessions.userId, userId))
        .orderBy(asc(schema.practiceSessions.createdAt)),
    ),
  ]);

  return {
    isPublic,
    completions: completions.map((c) => ({
      key: completionKey(c.level, c.slug),
      completedAt: c.completedAt.toISOString(),
    })),
    projectLinks: projectLinks.map((p) => ({
      projectId: p.projectId,
      repoUrl: p.repoUrl,
      addedAt: iso(p.addedAt),
    })),
    ownProjects: ownProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      url: p.url,
      tags: parseStoredTags(p.tags),
      createdAt: iso(p.createdAt),
    })),
    links: links.map((l) => ({ id: l.id, url: l.url, label: l.label })),
    badges: badges.map((b) => ({ badgeId: b.badgeId, earnedAt: iso(b.earnedAt) })),
    practice: {
      sessions: sessions.length,
      firstAt: sessions[0] ? iso(sessions[0].createdAt) : null,
      tenthAt: sessions[9] ? iso(sessions[9].createdAt) : null,
    },
  };
}

function parseStoredTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === "string") : [];
  } catch {
    return [];
  }
}

/** Store badges the records have earned; already-stored ones are left alone. */
export async function awardBadges(
  userId: string,
  badges: { badgeId: string; earnedAt: string }[],
): Promise<void> {
  if (!db || badges.length === 0) return;
  try {
    await db
      .insert(schema.badgesEarned)
      .values(
        badges.map((b) => ({
          id: crypto.randomUUID(),
          userId,
          badgeId: b.badgeId,
          earnedAt: new Date(b.earnedAt),
        })),
      )
      .onConflictDoNothing();
  } catch {
    // Showing the badge doesn't depend on storing it; the next view retries.
  }
}
