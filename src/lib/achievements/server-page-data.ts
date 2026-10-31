import "server-only";
import { getCurrentUser } from "@/lib/auth/auth";
import { listPracticeCardsForUser, listPracticeSessionsForUser } from "@/lib/practice/queries";
import { loadProfileRecords } from "@/lib/profile/queries";
import { ALL_SESSIONS, profileLessons } from "@/lib/profile/server-page-data";
import { buildAchievementsModel, type AchievementsInput, type AchievementsModel } from "./achievements-model";
import { buildScrolls } from "./scrolls-model";
import { buildTopicComplete, type TopicComplete } from "./topic-complete-model";
import type { LevelId } from "@/lib/content/schema";

export type AchievementsPageData = {
  model: AchievementsModel;
  scrolls: ReturnType<typeof buildScrolls>;
  name: string;
};

function build(input: AchievementsInput, name: string): AchievementsPageData {
  const model = buildAchievementsModel(input);
  return { model, scrolls: buildScrolls(input, model), name };
}

/** The records achievements are worked out from, or null for a guest. */
export async function loadAchievementsInput(): Promise<{
  input: AchievementsInput;
  name: string;
} | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const lessons = profileLessons();
  const now = new Date();
  const [records, cards, history] = await Promise.all([
    loadProfileRecords(user.id),
    listPracticeCardsForUser(user.id),
    listPracticeSessionsForUser(user.id, ALL_SESSIONS),
  ]);
  return {
    input: { lessons, completions: records.completions, projectLinks: records.projectLinks, cards, history, now },
    name: user.name,
  };
}

/** The signed-in learner's badges and scrolls, or null for a guest. */
export async function loadAchievementsModel(): Promise<AchievementsPageData | null> {
  const loaded = await loadAchievementsInput();
  return loaded ? build(loaded.input, loaded.name) : null;
}

/** One topic's finish line for the topic-complete page. */
export async function loadTopicComplete(topic: LevelId): Promise<TopicComplete | null> {
  const loaded = await loadAchievementsInput();
  if (!loaded) return null;
  return buildTopicComplete(loaded.input, buildAchievementsModel(loaded.input), topic);
}
