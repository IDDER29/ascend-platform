import type { Metadata } from "next";
import { AccountPanel } from "@/components/settings-v2/account-panel";
import { SignInFirst } from "@/components/settings-v2/settings-card";
import { getCurrentUser } from "@/lib/auth/auth";

export const metadata: Metadata = { title: "Account — Settings — Ascend" };

export default async function SettingsAccountPage() {
  const user = await getCurrentUser();
  if (!user) return <SignInFirst what="Password, sign-out and deleting your data are for accounts." />;
  return <AccountPanel userId={user.id} email={user.email} username={user.username} />;
}
