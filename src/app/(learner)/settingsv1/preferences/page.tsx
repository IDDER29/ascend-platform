import { getCurrentUser } from "@/lib/auth/auth";
import { getProfileSettings } from "@/lib/progress/queries";
import { getPracticeDailyGoal } from "@/lib/practice/queries";
import { DEFAULT_DAILY_GOAL, goalForPace } from "@/lib/practice/daily-goal";
import { SettingsSectionHeader } from "@/components/settings/settings-shell";
import { PreferencesSettingsForm } from "@/components/settings/preferences-settings-form";

export const metadata = {
  title: "Preferences — Settings — Ascend",
};

export default async function SettingsPreferencesPage() {
  const user = await getCurrentUser();
  const [profile, practiceGoal] = user
    ? await Promise.all([getProfileSettings(user.id).catch(() => null), getPracticeDailyGoal(user.id)])
    : [null, null];

  return (
    <>
      <SettingsSectionHeader
        title="Preferences"
        description="Your daily goal and reminders."
      />
      <PreferencesSettingsForm
        initialGoal={practiceGoal ?? goalForPace(profile?.pace) ?? DEFAULT_DAILY_GOAL}
        initialReminderTime={profile?.reminderTime ?? "19:00"}
        initialNotifStreakReminders={profile?.notifStreakReminders ?? true}
        initialNotifWeeklyRecap={profile?.notifWeeklyRecap ?? true}
        initialNotifPeerSolutions={profile?.notifPeerSolutions ?? false}
        initialNotifProductUpdates={profile?.notifProductUpdates ?? false}
        signedIn={Boolean(user)}
      />
    </>
  );
}
