import { getCurrentUser } from "@/lib/auth/auth";
import { AuthProvider } from "@/lib/auth/context";
import { AppShell } from "@/components/ui/app-shell";
import { BookmarksSync } from "@/components/bookmarks/bookmarks-sync";

/**
 * Single learner chrome for every signed-in/app route:
 * Continue, Paths, lessons, Practice, Progress, Profile, etc.
 *
 * Keeping AppShell here (not per-segment) means the sidebar stays mounted
 * across soft navigations — collapse state doesn't remount/flicker.
 */
export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <AuthProvider user={user}>
      <BookmarksSync userId={user?.id ?? null} />
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
