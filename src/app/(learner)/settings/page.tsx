import { getCurrentUser } from "@/lib/auth/auth";
import { getProfileSettings } from "@/lib/progress/queries";
import { SettingsClient } from "./settings-client";

export const metadata = {
  title: "Settings — Ascend",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const profile = user ? await getProfileSettings(user.id) : null;
  return <SettingsClient initial={profile} signedIn={Boolean(user)} />;
}
