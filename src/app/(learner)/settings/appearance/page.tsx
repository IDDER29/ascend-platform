import type { Metadata } from "next";
import { AppearanceForm } from "@/components/settings-v2/appearance-form";
import { SettingsCard } from "@/components/settings-v2/settings-card";
import { getCurrentUser } from "@/lib/auth/auth";

export const metadata: Metadata = { title: "Appearance · Settings" };

export default async function SettingsAppearancePage() {
  const user = await getCurrentUser();
  return (
    <SettingsCard title="Appearance" description="Changes the whole site straight away.">
      <AppearanceForm signedIn={Boolean(user)} />
    </SettingsCard>
  );
}
