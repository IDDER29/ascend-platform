import { notFound } from "next/navigation";
import { LessonDocument } from "@/components/lesson/lesson-document";
import {
  getAllLessonPublicParams,
  resolveLessonPublicSlug,
} from "@/lib/paths/lesson-urls";
import { getLesson } from "@/lib/content/lessons";

export function generateStaticParams() {
  return getAllLessonPublicParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicSlug: string }>;
}) {
  const { publicSlug } = await params;
  const ref = resolveLessonPublicSlug(publicSlug);
  if (!ref) return { title: "Lesson — Ascend" };
  const lesson = getLesson(ref.level, ref.slug);
  if (!lesson) return { title: "Lesson — Ascend" };
  return {
    title: `${lesson.meta.title} — Ascend`,
    description: lesson.meta.whyThisMatters.slice(0, 160),
  };
}

export default async function PublicLessonPage({
  params,
}: {
  params: Promise<{ publicSlug: string }>;
}) {
  const { publicSlug } = await params;
  const ref = resolveLessonPublicSlug(publicSlug);
  if (!ref) notFound();
  return <LessonDocument level={ref.level} slug={ref.slug} />;
}
