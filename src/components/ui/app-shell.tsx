import { SiteFooter } from "@/components/site/site-footer";
import { ShellFooter } from "@/components/ui/shell-footer";
import { AppSidebar } from "@/components/ui/sidebar";

/**
 * Universal learner chrome — sidebar + site footer (no topbar).
 * Mount once from route layouts; pages only render main content.
 * Sidebar collapse state is shared via localStorage across all shells.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        <ShellFooter>
          <div className="practice-coach-v2 font-sans text-[var(--coach-ink)]">
            <SiteFooter />
          </div>
        </ShellFooter>
      </div>
    </div>
  );
}
