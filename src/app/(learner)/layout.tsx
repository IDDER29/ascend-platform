import { getCurrentUser } from "@/lib/auth/auth";
import { AuthProvider } from "@/lib/auth/context";
import { AppShell } from "@/components/ui/app-shell";
import { getStreak } from "@/lib/progress/queries";

/**
 * Single learner chrome for every signed-in/app route:
 * Continue, Curriculum, lessons, Practice, Playground, Progress, Profile, etc.
 *
 * Keeping AppShell here (not per-segment) means the sidebar stays mounted
 * across soft navigations — collapse state doesn't remount/flicker.
 */
export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  let streakDays: number | null = null;
  if (user) {
    try {
      const streak = await getStreak(user.id);
      const current = streak?.current ?? 0;
      streakDays = current > 0 ? current : null;
    } catch {
      streakDays = null;
    }
  }
  return (
    <AuthProvider user={user}>
      <AppShell streakDays={streakDays}>{children}</AppShell>
    </AuthProvider>
  );
}
