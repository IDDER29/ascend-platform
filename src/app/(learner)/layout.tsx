import { getCurrentUser } from "@/lib/auth/auth";
import { AuthProvider } from "@/lib/auth/context";
import { AppShell } from "@/components/ui/app-shell";

/**
 * Single learner chrome for every signed-in/app route:
 * Continue, Curriculum, lessons, Practice, Playground, Progress, Profile, etc.
 *
 * Keeping AppShell here (not per-segment) means the sidebar stays mounted
 * across soft navigations — collapse state doesn't remount/flicker.
 */
export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <AuthProvider user={user}>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
