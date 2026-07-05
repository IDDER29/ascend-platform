import { getAllLessons } from "@/lib/content/lessons";
import { StreakLostCard } from "@/components/streak-lost-card";

const CURRENT_LEVEL = "level-02-the-c-language" as const;
const CURRENT_ORDER = 3;

export default function StreakLostPage() {
  const lessons = getAllLessons();
  const currentIndex = lessons.findIndex((l) => l.meta.level === CURRENT_LEVEL && l.meta.order === CURRENT_ORDER);
  const nextLesson = lessons[currentIndex];
  return (
    <StreakLostCard
      nextHref={`/curriculum/${nextLesson.meta.level}/${nextLesson.meta.slug}`}
      nextTitle={nextLesson.meta.title}
      nextTime={nextLesson.meta.timeMin}
    />
  );
}
