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

/** /pathsv2: follow a path, then stay on its page. */
export async function joinPathV2Action(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const path = getPathBySlug(slug);
  if (!path || path.status !== "live") redirect("/pathsv2");
  await setSelectedPathSlug(path.slug);
  revalidatePath("/dashboard");
  revalidatePath("/pathsv2");
  redirect(`/pathsv2/${path.slug}`);
}

/** /pathsv2: stop following a path; your progress stays. */
export async function leavePathV2Action(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const path = getPathBySlug(slug);
  if (path) await unfollowPathSlug(path.slug);
  revalidatePath("/dashboard");
  revalidatePath("/pathsv2");
  redirect(`/pathsv2/${slug}`);
}
