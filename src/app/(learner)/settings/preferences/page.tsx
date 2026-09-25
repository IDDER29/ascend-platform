import { getCurrentUser } from "@/lib/auth/auth";
import { getProfileSettings } from "@/lib/progress/queries";
import { SettingsSectionHeader } from "@/components/settings/settings-shell";
import { PreferencesSettingsForm } from "@/components/settings/preferences-settings-form";

export const metadata = {
  title: "Preferences — Settings — Ascend",
};

export default async function SettingsPreferencesPage() {
  const user = await getCurrentUser();
  const profile = user ? await getProfileSettings(user.id).catch(() => null) : null;

  return (
    <>
      <SettingsSectionHeader
        title="Preferences"
        description="Pace and alerts — delivery comes later; we save what you want."
      />
      <PreferencesSettingsForm
        initialPace={profile?.pace ?? "regular"}
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
