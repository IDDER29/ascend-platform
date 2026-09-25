"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  getPathBySlug,
  pathHref,
  pathSelectHref,
} from "@/lib/paths/catalog";
import {
  setSelectedPathSlug,
  unfollowPathSlug,
} from "@/lib/paths/selected-path";

/** Persist follow (Select), then open the path overview page. */
export async function selectPathAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const path = getPathBySlug(slug);
  if (!path || path.status !== "live") {
    redirect("/paths");
  }

  await setSelectedPathSlug(path.slug);
  redirect(pathHref(path.slug));
}

/** Persist follow, then open the first lesson (course-page Start). */
export async function startPathAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const path = getPathBySlug(slug);
  if (!path || path.status !== "live") {
    redirect("/paths");
  }

  await setSelectedPathSlug(path.slug);
  redirect(pathSelectHref(path) ?? pathHref(path.slug));
}

/** Remove path from following; stay on dashboard. */
export async function unselectPathAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const path = getPathBySlug(slug);
  if (path && path.status === "live") {
    await unfollowPathSlug(path.slug);
  }
  revalidatePath("/dashboard");
  revalidatePath("/paths");
  redirect("/dashboard");
}
