import "server-only";
import { getCurrentUser } from "@/lib/auth/auth";
import { listPracticeCardsForUser, listPracticeSessionsForUser } from "@/lib/practice/queries";
import { loadProfileRecords } from "@/lib/profile/queries";
import { SAMPLE_NAME, SHOW_SAMPLE_PROFILE_TO_GUESTS, sampleAchievementsInput } from "@/lib/profile/sample-profile";
import { ALL_SESSIONS, profileLessons } from "@/lib/profile/server-page-data";
import { buildAchievementsModel, type AchievementsInput, type AchievementsModel } from "./achievements-model";
import { buildScrolls } from "./scrolls-model";
import { buildTopicComplete, type TopicComplete } from "./topic-complete-model";
import type { LevelId } from "@/lib/content/schema";

export type AchievementsPageData = {
  model: AchievementsModel;
  scrolls: ReturnType<typeof buildScrolls>;
  sample: boolean;
  name: string;
};

function build(input: AchievementsInput, sample: boolean, name: string): AchievementsPageData {
  const model = buildAchievementsModel(input);
  return { model, scrolls: buildScrolls(input, model), sample, name };
}

/**
 * The records achievements are worked out from. Guests get the development sample
 * (or null when that's off, or when `sampleForGuests` is false).
 */
export async function loadAchievementsInput({ sampleForGuests = true } = {}): Promise<{
  input: AchievementsInput;
  sample: boolean;
  name: string;
} | null> {
  const user = await getCurrentUser();
  const lessons = profileLessons();
  const now = new Date();
  if (!user) {
    return sampleForGuests && SHOW_SAMPLE_PROFILE_TO_GUESTS
      ? { input: sampleAchievementsInput(lessons, now), sample: true, name: SAMPLE_NAME }
      : null;
  }
  const [records, cards, history] = await Promise.all([
    loadProfileRecords(user.id),
    listPracticeCardsForUser(user.id),
    listPracticeSessionsForUser(user.id, ALL_SESSIONS),
  ]);
  return {
    input: { lessons, completions: records.completions, projectLinks: records.projectLinks, cards, history, now },
    sample: false,
    name: user.name,
  };
}

/** The signed-in learner's badges and scrolls; guests get the development sample (or null when that's off). */
export async function loadAchievementsModel(): Promise<AchievementsPageData | null> {
  const loaded = await loadAchievementsInput();
  return loaded ? build(loaded.input, loaded.sample, loaded.name) : null;
}

/** One topic's finish line for the topic-complete page. */
export async function loadTopicComplete(topic: LevelId): Promise<{ topic: TopicComplete; sample: boolean } | null> {
  const loaded = await loadAchievementsInput();
  if (!loaded) return null;
  return {
    topic: buildTopicComplete(loaded.input, buildAchievementsModel(loaded.input), topic),
    sample: loaded.sample,
  };
}
