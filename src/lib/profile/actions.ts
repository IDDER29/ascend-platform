"use server";

import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/auth";
import { db, schema } from "@/lib/db/client";
import { MAX_OWN_PROJECTS, MAX_PROFILE_LINKS, normalizeUrl, parseTags } from "./links";
import { curriculumProject } from "./projects";
import { PROFILE_ROUTES } from "./routes";

export type ProfileActionResult = { ok: true } | { ok: false; error: string };

const MAX_LABEL = 40;
const MAX_TITLE = 60;
const MAX_DESCRIPTION = 140;
const BAD_URL = "Use a full web address, like github.com/you/project.";
const SAVE_FAILED = "Could not save. Try again in a moment.";

async function owner() {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to edit your profile." } as const;
  if (!db) return { ok: false, error: "Database unavailable." } as const;
  return { ok: true, user, conn: db } as const;
}

function refresh(username: string) {
  revalidatePath(PROFILE_ROUTES.owner);
  revalidatePath(PROFILE_ROUTES.public(username));
}

export async function setProfilePublicAction(isPublic: boolean): Promise<ProfileActionResult> {
  const me = await owner();
  if (!me.ok) return me;
  const updatedAt = new Date();
  try {
    await me.conn
      .insert(schema.profileSettings)
      .values({ userId: me.user.id, isPublic, updatedAt })
      .onConflictDoUpdate({ target: schema.profileSettings.userId, set: { isPublic, updatedAt } });
  } catch {
    return { ok: false, error: SAVE_FAILED };
  }
  refresh(me.user.username);
  return { ok: true };
}

export async function addProfileLinkAction(rawUrl: string, rawLabel: string): Promise<ProfileActionResult> {
  const me = await owner();
  if (!me.ok) return me;
  const url = normalizeUrl(rawUrl);
  if (!url) return { ok: false, error: BAD_URL };
  const label = rawLabel.trim().slice(0, MAX_LABEL) || null;
  try {
    const [{ n }] = await me.conn
      .select({ n: count() })
      .from(schema.profileLinks)
      .where(eq(schema.profileLinks.userId, me.user.id));
    if (n >= MAX_PROFILE_LINKS) return { ok: false, error: `Up to ${MAX_PROFILE_LINKS} links.` };
    await me.conn.insert(schema.profileLinks).values({
      id: crypto.randomUUID(),
      userId: me.user.id,
      url,
      label,
      createdAt: new Date(),
    });
  } catch {
    return { ok: false, error: SAVE_FAILED };
  }
  refresh(me.user.username);
  return { ok: true };
}

export async function removeProfileLinkAction(id: string): Promise<ProfileActionResult> {
  const me = await owner();
  if (!me.ok) return me;
  try {
    await me.conn
      .delete(schema.profileLinks)
      .where(and(eq(schema.profileLinks.id, id), eq(schema.profileLinks.userId, me.user.id)));
  } catch {
    return { ok: false, error: SAVE_FAILED };
  }
  refresh(me.user.username);
  return { ok: true };
}

/** Attach the learner's repo to a curriculum project; the badge follows once its lessons are done. */
export async function saveProjectLinkAction(projectId: string, rawUrl: string): Promise<ProfileActionResult> {
  const me = await owner();
  if (!me.ok) return me;
  if (!curriculumProject(projectId)) return { ok: false, error: "Unknown project." };
  const repoUrl = normalizeUrl(rawUrl);
  if (!repoUrl) return { ok: false, error: BAD_URL };
  const addedAt = new Date();
  try {
    await me.conn
      .insert(schema.projectLinks)
      .values({ id: crypto.randomUUID(), userId: me.user.id, projectId, repoUrl, addedAt })
      .onConflictDoUpdate({
        target: [schema.projectLinks.userId, schema.projectLinks.projectId],
        set: { repoUrl, addedAt },
      });
  } catch {
    return { ok: false, error: SAVE_FAILED };
  }
  refresh(me.user.username);
  return { ok: true };
}

export async function addOwnProjectAction(input: {
  title: string;
  description: string;
  url: string;
  tags: string;
}): Promise<ProfileActionResult> {
  const me = await owner();
  if (!me.ok) return me;
  const title = input.title.trim().slice(0, MAX_TITLE);
  if (!title) return { ok: false, error: "Give the project a name." };
  const url = normalizeUrl(input.url);
  if (!url) return { ok: false, error: BAD_URL };
  try {
    const [{ n }] = await me.conn
      .select({ n: count() })
      .from(schema.ownProjects)
      .where(eq(schema.ownProjects.userId, me.user.id));
    if (n >= MAX_OWN_PROJECTS) return { ok: false, error: `Up to ${MAX_OWN_PROJECTS} projects.` };
    await me.conn.insert(schema.ownProjects).values({
      id: crypto.randomUUID(),
      userId: me.user.id,
      title,
      description: input.description.trim().slice(0, MAX_DESCRIPTION),
      url,
      tags: JSON.stringify(parseTags(input.tags)),
      createdAt: new Date(),
    });
  } catch {
    return { ok: false, error: SAVE_FAILED };
  }
  refresh(me.user.username);
  return { ok: true };
}

export async function removeOwnProjectAction(id: string): Promise<ProfileActionResult> {
  const me = await owner();
  if (!me.ok) return me;
  try {
    await me.conn
      .delete(schema.ownProjects)
      .where(and(eq(schema.ownProjects.id, id), eq(schema.ownProjects.userId, me.user.id)));
  } catch {
    return { ok: false, error: SAVE_FAILED };
  }
  refresh(me.user.username);
  return { ok: true };
}
