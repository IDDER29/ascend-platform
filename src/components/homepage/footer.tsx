import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.06] bg-white/50">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-3 sm:px-8 sm:py-[52px]">
        <div className="sm:col-span-1">
          <div className="mb-3.5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand-gradient">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 15 6-6 6 6" />
                <path d="m6 9 6-6 6 6" opacity=".55" />
              </svg>
            </div>
            <span className="font-display text-[19px] font-extrabold">Ascend</span>
          </div>
          <p className="max-w-[290px] text-[13px] leading-relaxed text-ink-muted">
            An independent, community-built platform for learning computer
            science from first principles — no prerequisites, no
            gatekeeping.
          </p>
        </div>
        <div>
          <div className="mb-3.5 font-mono text-xs font-extrabold uppercase tracking-[0.08em] text-ink-fainter">
            Learn
          </div>
          <Link href="/curriculum" className="mb-2.5 block text-sm text-ink-secondary hover:text-ink">
            Curriculum
          </Link>
          <a href="#why" className="mb-2.5 block text-sm text-ink-secondary hover:text-ink">
            Why Ascend
          </a>
          <a href="#how" className="mb-2.5 block text-sm text-ink-secondary hover:text-ink">
            How it works
          </a>
        </div>
        <div>
          <div className="mb-3.5 font-mono text-xs font-extrabold uppercase tracking-[0.08em] text-ink-fainter">
            About
          </div>
          <span className="mb-2.5 block text-sm text-ink-fainter">
            Roadmap — coming soon
          </span>
          <span className="mb-2.5 block text-sm text-ink-fainter">
            GitHub — coming soon
          </span>
        </div>
      </div>
      <div className="border-t border-black/[0.06]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-8">
          <span className="text-[12.5px] text-ink-faint">© 2026 Ascend · Free &amp; open source</span>
          <span className="font-mono text-[12.5px] text-ink-faint">
            Made for people who want to know how it really works.
          </span>
        </div>
      </div>
    </footer>
  );
}
