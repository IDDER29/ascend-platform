import { AppSidebar } from "@/components/ui/sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";

/**
 * Universal learner chrome — sidebar + topbar.
 * Mount once from route layouts; pages only render main content.
 * Sidebar collapse state is shared via localStorage across all shells.
 */
export function AppShell({
  children,
  streakDays = null,
}: {
  children: React.ReactNode;
  streakDays?: number | null;
}) {
  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar streakDays={streakDays} />
        {children}
      </div>
    </div>
  );
}
