"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/auth";
import { ProgressError, markLessonComplete as markCompleteInDb, patchProfileSettings as patchProfileInDb } from "./queries";
import type { ProfileSettingsPatch } from "./types";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { getLesson } from "@/lib/content/lessons";
import { cleanSettingsPatch } from "./settings-rules";

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
    // Only real lessons count: progress, streaks and badges are all worked out from these rows.
    if (typeof level !== "string" || typeof slug !== "string" || level.length > 64 || slug.length > 128 || !getLesson(level, slug)) {
      return { ok: false, error: "There's no such lesson." };
    }
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

/** Save only the fields from one Settings section. */
export async function patchProfileSettingsAction(
  patch: ProfileSettingsPatch,
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, error: "Sign in to update settings." };
    await patchProfileInDb(user.id, cleanSettingsPatch(patch));
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
