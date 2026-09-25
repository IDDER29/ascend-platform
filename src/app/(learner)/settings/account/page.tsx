import { getCurrentUser } from "@/lib/auth/auth";
import { getProfileSettings } from "@/lib/progress/queries";
import { SettingsSectionHeader } from "@/components/settings/settings-shell";
import { AccountSettingsPanel } from "@/components/settings/account-settings-panel";

export const metadata = {
  title: "Account — Settings — Ascend",
};

export default async function SettingsAccountPage() {
  const user = await getCurrentUser();
  const profile = user ? await getProfileSettings(user.id).catch(() => null) : null;

  return (
    <>
      <SettingsSectionHeader
        title="Account"
        description="Sign-in identity and irreversible actions."
      />
      <AccountSettingsPanel
        email={profile?.email ?? user?.email ?? ""}
        signedIn={Boolean(user)}
      />
    </>
  );
}
