import "server-only";
import { getCurrentUser } from "@/lib/auth/auth";
import { listPracticeCardsForUser, listPracticeSessionsForUser } from "@/lib/practice/queries";
import { loadProfileRecords } from "@/lib/profile/queries";
import { SHOW_SAMPLE_PROFILE_TO_GUESTS, sampleAchievementsInput } from "@/lib/profile/sample-profile";
import { ALL_SESSIONS, profileLessons } from "@/lib/profile/server-page-data";
import { buildAchievementsModel, type AchievementsModel } from "./achievements-model";

/** The signed-in learner's badges; guests get the development sample (or null when that's off). */
export async function loadAchievementsModel(): Promise<{ model: AchievementsModel; sample: boolean } | null> {
  const user = await getCurrentUser();
  const lessons = profileLessons();
  const now = new Date();
  if (!user) {
    return SHOW_SAMPLE_PROFILE_TO_GUESTS
      ? { model: buildAchievementsModel(sampleAchievementsInput(lessons, now)), sample: true }
      : null;
  }
  const [records, cards, history] = await Promise.all([
    loadProfileRecords(user.id),
    listPracticeCardsForUser(user.id),
    listPracticeSessionsForUser(user.id, ALL_SESSIONS),
  ]);
  return {
    model: buildAchievementsModel({
      lessons,
      completions: records.completions,
      projectLinks: records.projectLinks,
      cards,
      history,
      now,
    }),
    sample: false,
  };
}
