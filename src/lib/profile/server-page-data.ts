import "server-only";
import { buildAchievementsModel, type AchievementsModel } from "@/lib/achievements/achievements-model";
import { CREST_IDS, TITLES } from "@/lib/achievements/catalog";
import { getAllLessons } from "@/lib/content/lessons";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { listPracticeCardsForUser, listPracticeSessionsForUser } from "@/lib/practice/queries";
import { completionKey } from "@/lib/practice/session";
import { buildProfileModel, type ProfileLesson, type ProfileModel, type ProfileViewer } from "./profile-model";
import { awardBadges, loadProfileRecords, type ProfileOwner } from "./queries";

/** Habit badges look at the whole practice history, not just the recent sessions Practice shows. */
export const ALL_SESSIONS = 5000;

export function profileLessons(): ProfileLesson[] {
  return getAllLessons().map(({ meta }) => ({
    key: completionKey(meta.level, meta.slug),
    level: meta.level,
    slug: meta.slug,
    title: meta.title,
    href: lessonHref(meta.level, meta.slug),
  }));
}

/**
 * The profile wears what /achievements works out — one source for both pages: ribbons (newest first), and
 * the insignia worn as emblems (headband, title, clan crests).
 */
function withEarnedBadges(model: ProfileModel, achievements: AchievementsModel): ProfileModel {
  const byId = new Map(achievements.parts.map((p) => [p.id, p]));
  const title = achievements.title ? TITLES.find((t) => t.id === achievements.title!.id)! : null;
  return {
    ...model,
    achievements: achievements.earnedNewestFirst
      .map((id) => byId.get(id)!)
      .filter((part) => !part.insignia)
      .map((part) => ({
        id: part.id,
        group: part.group,
        label: part.label,
        glyph: part.glyph,
        description: part.means,
        earnedLabel: part.earnedLabel ?? "",
      })),
    insignia: {
      headband: achievements.insignia.some((p) => p.insignia?.kind === "headband" && p.earned),
      title: title ? { label: title.label, kanji: title.kanji, gloss: title.gloss } : null,
      crests: CREST_IDS.map((id) => achievements.insignia.find((p) => p.id === id)!).map((p) => ({
        crest: p.insignia?.kind === "crest" ? p.insignia.crest : "gate",
        label: p.label,
        earned: p.earned,
      })),
    },
  };
}

/** Build the profile for `owner` as seen by `viewer`; the owner's view stores newly earned project badges. */
export async function loadProfileModel(owner: ProfileOwner, viewer: ProfileViewer): Promise<ProfileModel> {
  const lessons = profileLessons();
  // Practice data is read by the profile owner's id, so a visitor sees the owner's badges, not their own.
  const [records, cards, history] = await Promise.all([
    loadProfileRecords(owner.userId),
    listPracticeCardsForUser(owner.userId),
    listPracticeSessionsForUser(owner.userId, ALL_SESSIONS),
  ]);
  const model = buildProfileModel({
    viewer,
    profile: { name: owner.name, username: owner.username, bio: owner.bio, joinedAt: owner.joinedAt },
    lessons,
    ...records,
  });
  if (viewer === "owner") await awardBadges(owner.userId, model.eligibleBadges);
  const achievements = buildAchievementsModel({
    lessons,
    completions: records.completions,
    projectLinks: records.projectLinks,
    cards,
    history,
    now: new Date(),
  });
  return withEarnedBadges(model, achievements);
}

