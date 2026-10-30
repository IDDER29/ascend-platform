import "server-only";
import { getAllLessons } from "@/lib/content/lessons";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { completionKey } from "@/lib/practice/session";
import { buildProfileModel, type ProfileModel, type ProfileViewer } from "./profile-model";
import { awardBadges, loadProfileRecords, type ProfileOwner } from "./queries";

/** Build the profile for `owner` as seen by `viewer`; the owner's view stores newly earned badges. */
export async function loadProfileModel(owner: ProfileOwner, viewer: ProfileViewer): Promise<ProfileModel> {
  const records = await loadProfileRecords(owner.userId);
  const lessons = getAllLessons().map(({ meta }) => ({
    key: completionKey(meta.level, meta.slug),
    level: meta.level,
    slug: meta.slug,
    title: meta.title,
    href: lessonHref(meta.level, meta.slug),
  }));
  const model = buildProfileModel({
    viewer,
    profile: { name: owner.name, username: owner.username, bio: owner.bio, joinedAt: owner.joinedAt },
    lessons,
    ...records,
  });
  if (viewer === "owner") await awardBadges(owner.userId, model.eligibleBadges);
  return model;
}
