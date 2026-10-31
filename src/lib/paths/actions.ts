"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPathBySlug } from "@/lib/paths/catalog";
import {
  setSelectedPathSlug,
  unfollowPathSlug,
} from "@/lib/paths/selected-path";

/** /paths: follow a path, then stay on its page. */
export async function joinPathV2Action(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const path = getPathBySlug(slug);
  if (!path || path.status !== "live") redirect("/paths");
  await setSelectedPathSlug(path.slug);
  revalidatePath("/dashboard");
  revalidatePath("/paths");
  redirect(`/paths/${path.slug}`);
}

/** /paths: stop following a path; your progress stays. */
export async function leavePathV2Action(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const path = getPathBySlug(slug);
  if (path) await unfollowPathSlug(path.slug);
  revalidatePath("/dashboard");
  revalidatePath("/paths");
  redirect(`/paths/${slug}`);
}
