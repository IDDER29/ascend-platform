import { getLesson } from "@/lib/content/lessons";
import { LEVELS } from "@/lib/content/schema";
import { resolveLessonPublicSlug } from "@/lib/paths/lesson-urls";
import { SHARE_SIZE, shareImage } from "@/lib/brand/share-image";

export const alt = "An Ascend lesson";
export const size = SHARE_SIZE;
export const contentType = "image/png";

/** A shared lesson shows its title and topic (by name, never "level"). */
export default async function LessonImage({ params }: { params: Promise<{ publicSlug: string }> }) {
  const ref = resolveLessonPublicSlug((await params).publicSlug);
  const lesson = ref ? getLesson(ref.level, ref.slug) : null;
  if (!lesson) return shareImage({ title: "Learn how computers really work" });
  return shareImage({
    eyebrow: LEVELS[lesson.meta.level].name,
    title: lesson.meta.title,
    line: `${lesson.meta.timeMin} min lesson · free on Ascend`,
  });
}
