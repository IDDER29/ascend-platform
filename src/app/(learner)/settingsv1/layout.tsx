import { getCurrentUser } from "@/lib/auth/auth";
import { SettingsShell } from "@/components/settings/settings-shell";

/**
 * Shared Settings chrome — nav stays mounted across section soft-navigations
 * (same idea as learner AppShell). Child pages only render the section pane.
 */
export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <SettingsShell signedIn={Boolean(user)}>{children}</SettingsShell>
  );
}
