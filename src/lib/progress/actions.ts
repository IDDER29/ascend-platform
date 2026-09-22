"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  ProgressError,
  markLessonComplete as markCompleteInDb,
  updateProfileSettings as updateProfileInDb,
} from "./queries";
import type { ProfileSettingsUpdate } from "./types";

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
    revalidatePath("/progress");
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
    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (err) {
    const message = err instanceof ProgressError ? err.message : "Could not save settings.";
    return { ok: false, error: message };
  }
}
