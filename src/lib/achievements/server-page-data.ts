import "server-only";
import { getCurrentUser } from "@/lib/auth/auth";
import { listPracticeCardsForUser, listPracticeSessionsForUser } from "@/lib/practice/queries";
import { loadProfileRecords } from "@/lib/profile/queries";
import { SAMPLE_NAME, SHOW_SAMPLE_PROFILE_TO_GUESTS, sampleAchievementsInput } from "@/lib/profile/sample-profile";
import { ALL_SESSIONS, profileLessons } from "@/lib/profile/server-page-data";
import { buildAchievementsModel, type AchievementsInput, type AchievementsModel } from "./achievements-model";
import { buildScrolls } from "./scrolls-model";

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

/** The signed-in learner's badges and scrolls; guests get the development sample (or null when that's off). */
export async function loadAchievementsModel(): Promise<AchievementsPageData | null> {
  const user = await getCurrentUser();
  const lessons = profileLessons();
  const now = new Date();
  if (!user) {
    return SHOW_SAMPLE_PROFILE_TO_GUESTS ? build(sampleAchievementsInput(lessons, now), true, SAMPLE_NAME) : null;
  }
  const [records, cards, history] = await Promise.all([
    loadProfileRecords(user.id),
    listPracticeCardsForUser(user.id),
    listPracticeSessionsForUser(user.id, ALL_SESSIONS),
  ]);
  return build(
    { lessons, completions: records.completions, projectLinks: records.projectLinks, cards, history, now },
    false,
    user.name,
  );
}
