import { SettingsNav } from "@/components/settings-v2/settings-nav";
import { PageHeader } from "@/components/ui/page-header";
import { PageShell } from "@/components/ui/page-shell";

/** Settings: one title, the sections, and the section you're on. */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell className="flex flex-col gap-6">
      <PageHeader title="Settings" />
      <div className="grid gap-6 md:grid-cols-[180px_minmax(0,720px)] md:gap-8">
        <SettingsNav />
        <div className="flex min-w-0 flex-col gap-5">{children}</div>
      </div>
    </PageShell>
  );
}
