import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getContinueLesson,
  countCompletedInLevel,
  getStreak,
  listCompletedLessons,
} from "@/lib/progress/queries";
import { IntroStrip } from "@/components/curriculum2/intro-strip";
import { PathBoard } from "@/components/curriculum2/path-board";
import type { Curriculum2LevelRegion } from "@/components/curriculum2/types";

export const metadata = {
  title: "Curriculum map (experiment) — Ascend",
  description: "Experimental spatial map of the Ascend curriculum.",
};

const FALLBACK_LEVEL: LevelId = "level-00-bits-logic";
const FALLBACK_ORDER = 1;

const LEVEL_ACCENT: Record<string, string> = {
  "level-00-bits-logic": "bg-level-00",
  "level-01-machine-memory": "bg-level-01",
  "level-02-the-c-language": "bg-level-02",
  "level-03-systems-software": "bg-level-03",
};

export default async function Curriculum2Page() {
  const user = await getCurrentUser();
  const lessons = getAllLessons();

  let currentLevel: LevelId = FALLBACK_LEVEL;
  let currentOrder = FALLBACK_ORDER;
  let continueHref = lessons[0]
    ? `/curriculum/${lessons[0].meta.level}/${lessons[0].meta.slug}`
    : "/curriculum";
  let continueTitle = lessons[0]?.meta.title ?? "Start the path";
  let levelDone: Record<string, number> = Object.fromEntries(
    levelIds.map((id) => [id, 0]),
  );
  let totalCompleted = 0;
  let streakCurrent = 0;

  if (user) {
    try {
      const cont = await getContinueLesson(user.id);
      currentLevel = cont.level as LevelId;
      currentOrder = cont.order;
      continueHref = cont.href;
      continueTitle = cont.title;
      const [doneCounts, completed, streak] = await Promise.all([
        Promise.all(
          levelIds.map(
            async (id) => [id, await countCompletedInLevel(user.id, id)] as const,
          ),
        ),
        listCompletedLessons(user.id),
        getStreak(user.id),
      ]);
      levelDone = Object.fromEntries(doneCounts);
      totalCompleted = completed.length;
      streakCurrent = streak?.current ?? 0;
    } catch {
      // db unavailable — open-path defaults
    }
  }

  const pathPct = lessons.length
    ? Math.round((totalCompleted / lessons.length) * 100)
    : 0;

  const levelMeta = LEVELS[currentLevel];
  const contextLine = user
    ? `${levelMeta.name} · concept ${currentOrder} of ${levelMeta.totalConcepts}`
    : "The full path is open. Sign in to save completed lessons and pick up where you left off.";

  const regions: Curriculum2LevelRegion[] = levelIds.map((id) => ({
    id,
    name: LEVELS[id].name,
    short: LEVELS[id].short,
    timeLabel: LEVELS[id].timeLabel,
    totalConcepts: LEVELS[id].totalConcepts,
    done: levelDone[id] ?? 0,
    accentClass: LEVEL_ACCENT[id],
    lessons: lessons
      .filter((l) => l.meta.level === id)
      .map((l) => ({
        level: l.meta.level,
        slug: l.meta.slug,
        title: l.meta.title,
        order: l.meta.order,
        timeMin: l.meta.timeMin,
      })),
  }));

  return (
    <>
      <IntroStrip
        continueHref={continueHref}
        continueTitle={continueTitle}
        contextLine={contextLine}
        ctaLabel={user ? "Continue" : "Start"}
        pathPct={user ? pathPct : null}
        streakCurrent={user ? streakCurrent : null}
      />
      <PathBoard
        regions={regions}
        currentLevel={currentLevel}
        currentOrder={currentOrder}
      />
    </>
  );
}
