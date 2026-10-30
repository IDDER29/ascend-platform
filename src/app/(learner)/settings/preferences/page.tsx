import type { Metadata } from "next";
import { GoalForm } from "@/components/settings-v2/goal-form";
import { SettingsCard } from "@/components/settings-v2/settings-card";
import { getCurrentUser } from "@/lib/auth/auth";
import { DEFAULT_DAILY_GOAL, goalForPace } from "@/lib/practice/daily-goal";
import { getPracticeDailyGoal } from "@/lib/practice/queries";
import { getProfileSettings } from "@/lib/progress/queries";

export const metadata: Metadata = { title: "Daily goal — Settings — Ascend" };

export default async function SettingsGoalPage() {
  const user = await getCurrentUser();
  const [profile, goal] = user
    ? await Promise.all([
        getProfileSettings(user.id).catch(() => null),
        getPracticeDailyGoal(user.id).catch(() => null),
      ])
    : [null, null];
  return (
    <SettingsCard
      title="Daily goal"
      description={
        user
          ? "How much you want to do each day. Your Today page turns it into a short checklist."
          : "How much you want to do each day. Without an account it's kept in this browser."
      }
    >
      <GoalForm userId={user?.id ?? null} initial={goal ?? goalForPace(profile?.pace) ?? DEFAULT_DAILY_GOAL} />
    </SettingsCard>
  );
}
