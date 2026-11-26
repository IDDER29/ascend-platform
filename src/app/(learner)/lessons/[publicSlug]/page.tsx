import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { LessonPageV2 } from "@/components/lesson-v2/lesson-page-v2";
import { getLesson } from "@/lib/content/lessons";
import { movedLessonHref, resolveLessonPublicSlug } from "@/lib/paths/lesson-urls";
import { PageShell } from "@/components/ui/page-shell";

export async function generateMetadata({ params }: { params: Promise<{ publicSlug: string }> }): Promise<Metadata> {
  const ref = resolveLessonPublicSlug((await params).publicSlug);
  const lesson = ref ? getLesson(ref.level, ref.slug) : null;
  return lesson
    ? { title: `${lesson.meta.title}`, description: lesson.meta.whyThisMatters.slice(0, 160) }
    : { title: "Lesson" };
}

export default async function LessonPage({ params }: { params: Promise<{ publicSlug: string }> }) {
  const { publicSlug } = await params;
  const ref = resolveLessonPublicSlug(publicSlug);
  if (!ref) {
    // A lesson that moved to another section keeps its old link.
    const moved = movedLessonHref(publicSlug);
    if (moved) permanentRedirect(moved);
    notFound();
  }
  return (
    <PageShell width="full">
      <LessonPageV2 level={ref.level} slug={ref.slug} />
    </PageShell>
  );
}
