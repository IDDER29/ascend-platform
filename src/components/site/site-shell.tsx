import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Every public page: the Coach look, the site header and footer. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="practice-coach-v2 flex min-h-dvh min-w-0 flex-col overflow-x-clip bg-[var(--coach-bg)] font-sans text-[var(--coach-ink)] antialiased">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-[var(--coach-surface)] px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="min-w-0 flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
