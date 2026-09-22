/**
 * One-off smoke check for progress queries. Run: npx tsx scripts/smoke-progress.ts
 */
import { db, schema } from "../src/lib/db/client";
import {
  markLessonComplete,
  getContinueLesson,
  listCompletedLessons,
  updateProfileSettings,
  getProfileSettings,
} from "../src/lib/progress/queries";

async function main() {
  if (!db) throw new Error("no db");
  let user = await db.query.users.findFirst();
  if (!user) {
    const id = crypto.randomUUID();
    const now = new Date();
    await db.insert(schema.users).values({
      id,
      email: "spine-smoke@test.local",
      passwordHash: "x",
      createdAt: now,
    });
    await db.insert(schema.profiles).values({
      userId: id,
      name: "Spine Smoke",
      username: "spinesmoke",
      bio: "",
    });
    await db.insert(schema.streaks).values({ userId: id });
    user = await db.query.users.findFirst();
  }
  if (!user) throw new Error("failed to create user");

  const r1 = await markLessonComplete(user.id, "level-00-bits-logic", "what-is-a-bit");
  const list = await listCompletedLessons(user.id);
  const cont = await getContinueLesson(user.id);
  console.log(JSON.stringify({ mark: r1, completedCount: list.length, continue: cont }, null, 2));

  const before = await getProfileSettings(user.id);
  if (!before) throw new Error("no profile");
  await updateProfileSettings(user.id, {
    name: before.name,
    username: before.username,
    bio: before.bio || "smoke",
    pace: before.pace,
    theme: before.theme,
    accent: before.accent,
    reminderTime: before.reminderTime,
    notifStreakReminders: before.notifStreakReminders,
    notifWeeklyRecap: before.notifWeeklyRecap,
    notifPeerSolutions: before.notifPeerSolutions,
    notifProductUpdates: before.notifProductUpdates,
  });
  console.log("profile round-trip OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
