import { getCurrentUser } from "@/lib/auth/auth";
import { getProfileSettings } from "@/lib/progress/queries";
import { SettingsSectionHeader } from "@/components/settings/settings-shell";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";

export const metadata = {
  title: "Public profile — Settings — Ascend",
};

export default async function SettingsProfilePage() {
  const user = await getCurrentUser();
  const profile = user ? await getProfileSettings(user.id).catch(() => null) : null;

  return (
    <>
      <SettingsSectionHeader
        title="Public profile"
        description="How you appear on Ascend."
      />
      <ProfileSettingsForm
        initialName={profile?.name ?? ""}
        initialUsername={profile?.username ?? ""}
        initialBio={profile?.bio ?? ""}
        signedIn={Boolean(user)}
      />
    </>
  );
}
