import { getCurrentUser } from "@/lib/auth/auth";
import { SettingsSectionHeader } from "@/components/settings/settings-shell";
import { AppearanceSettingsForm } from "@/components/settings/appearance-settings-form";

export const metadata = {
  title: "Appearance — Settings — Ascend",
};

export default async function SettingsAppearancePage() {
  const user = await getCurrentUser();

  return (
    <>
      <SettingsSectionHeader
        title="Appearance"
        description="Same Phosphor theme as the sidebar — applies instantly."
      />
      <AppearanceSettingsForm signedIn={Boolean(user)} />
    </>
  );
}
