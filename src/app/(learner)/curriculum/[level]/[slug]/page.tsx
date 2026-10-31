import { notFound, redirect } from "next/navigation";
import { getLesson, getAllLessonParams } from "@/lib/content/lessons";
import { lessonHref } from "@/lib/paths/lesson-urls";
import type { LevelId } from "@/lib/content/schema";
import { levelIds } from "@/lib/content/schema";

export function generateStaticParams() {
  return getAllLessonParams();
}

/** Legacy curriculum URLs → Odin-style `/lessons/{path}-{course}-{slug}`. */
export default async function LegacyCurriculumLessonRedirect({
  params,
}: {
  params: Promise<{ level: string; slug: string }>;
}) {
  const { level, slug } = await params;
  if (!levelIds.includes(level as LevelId)) notFound();
  const lesson = getLesson(level, slug);
  if (!lesson) notFound();
  redirect(lessonHref(level, slug));
}
