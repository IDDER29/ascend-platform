import "server-only";
import { getCurrentUser } from "@/lib/auth/auth";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import { loadProfileRecords } from "@/lib/profile/queries";
import { SHOW_SAMPLE_PROFILE_TO_GUESTS, sampleAchievementsInput } from "@/lib/profile/sample-profile";
import { profileLessons } from "@/lib/profile/server-page-data";
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
  const [records, practice] = await Promise.all([loadProfileRecords(user.id), loadPracticePageData()]);
  return {
    model: buildAchievementsModel({
      lessons,
      completions: records.completions,
      projectLinks: records.projectLinks,
      cards: practice.initialCards,
      history: practice.initialHistory,
      now,
    }),
    sample: false,
  };
}
