"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  ProgressError,
  markLessonComplete as markCompleteInDb,
  updateProfileSettings as updateProfileInDb,
  patchProfileSettings as patchProfileInDb,
} from "./queries";
import type { ProfileSettingsPatch, ProfileSettingsUpdate } from "./types";
import { lessonHref } from "@/lib/paths/lesson-urls";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function markLessonCompleteAction(
  level: string,
  slug: string,
): Promise<ActionResult & { alreadyComplete?: boolean }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, error: "Sign in to save lesson progress." };
    const result = await markCompleteInDb(user.id, level, slug);
    revalidatePath("/dashboard");
    revalidatePath("/curriculum");
    revalidatePath(`/curriculum/${level}/${slug}`);
    revalidatePath(lessonHref(level, slug));
    revalidatePath("/lessons");
    revalidatePath("/progress");
    revalidatePath("/paths");
    return { ok: true, alreadyComplete: result.alreadyComplete };
  } catch (err) {
    const message = err instanceof ProgressError ? err.message : "Could not save progress.";
    return { ok: false, error: message };
  }
}

export async function updateProfileSettingsAction(
  input: ProfileSettingsUpdate,
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, error: "Sign in to update settings." };
    await updateProfileInDb(user.id, input);
    revalidatePath("/settings");
    revalidatePath("/settings", "layout");
    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (err) {
    const message = err instanceof ProgressError ? err.message : "Could not save settings.";
    return { ok: false, error: message };
  }
}

/** Save only the fields from one Settings section. */
export async function patchProfileSettingsAction(
  patch: ProfileSettingsPatch,
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, error: "Sign in to update settings." };
    await patchProfileInDb(user.id, patch);
    revalidatePath("/settings");
    revalidatePath("/settings", "layout");
    revalidatePath("/profile");
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof ProgressError ? err.message : "Could not save settings.";
    return { ok: false, error: message };
  }
}
