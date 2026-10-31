"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPathBySlug } from "@/lib/paths/catalog";
import { loadPublicPaths } from "@/lib/paths/paths-v2-data";
import { setSelectedPathSlug } from "@/lib/paths/selected-path";
import { savePracticeDailyGoalAction } from "@/lib/practice/actions";
import { isDailyGoal } from "@/lib/practice/daily-goal";
import { FIRST_LESSON_HREF } from "@/lib/routes";

/** Join the path you picked, keep your daily goal on your account, then open the path's first lesson. */
export async function finishOnboardingAction(formData: FormData) {
  const path = getPathBySlug(String(formData.get("path") ?? ""));
  const goal = Number(formData.get("goal"));

  // Guests keep the goal in this browser only (the page writes it there too).
  if (isDailyGoal(goal)) await savePracticeDailyGoalAction(goal);

  if (!path || path.status !== "live") redirect(FIRST_LESSON_HREF);
  await setSelectedPathSlug(path.slug);
  revalidatePath("/dashboard");
  revalidatePath("/paths");

  const view = loadPublicPaths("/paths").views.find((v) => v.slug === path.slug);
  const first = view?.courses.flatMap((c) => c.sections.flatMap((s) => s.items))[0];
  redirect(first?.href ?? FIRST_LESSON_HREF);
}
