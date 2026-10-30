import { SettingsNav } from "@/components/settings-v2/settings-nav";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

/** Settings: one title, the sections, and the section you're on. */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={MAIN}>
      <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-6`}>
        <h1 className="m-0 font-display text-[30px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[36px]">
          Settings
        </h1>
        <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8">
          <SettingsNav />
          <div className="flex min-w-0 flex-col gap-5">{children}</div>
        </div>
      </div>
    </main>
  );
}
