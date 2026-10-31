import type { Metadata } from "next";
import { ProfileForm } from "@/components/settings-v2/profile-form";
import { SettingsCard, SignInFirst } from "@/components/settings-v2/settings-card";
import { getCurrentUser } from "@/lib/auth/auth";
import { getProfileSettings } from "@/lib/progress/queries";

export const metadata: Metadata = { title: "Profile · Settings" };

export default async function SettingsProfilePage() {
  const user = await getCurrentUser();
  if (!user) return <SignInFirst what="Your name, username and bio belong to your account." />;
  const profile = await getProfileSettings(user.id).catch(() => null);
  return (
    <SettingsCard title="Profile" description="How you appear on your public profile.">
      <ProfileForm
        name={profile?.name ?? user.name}
        username={profile?.username ?? user.username}
        bio={profile?.bio ?? ""}
      />
    </SettingsCard>
  );
}
