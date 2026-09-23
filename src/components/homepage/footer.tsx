import Link from "next/link";
import { CURRICULUM_HREF, FIRST_LESSON_HREF } from "@/lib/routes";

const LEARN = [
  { href: CURRICULUM_HREF, label: "All Paths" },
  { href: "/#why", label: "About" },
  { href: "/community", label: "Community" },
  { href: "/#open", label: "Support us" },
] as const;

const ACCOUNT = [
  { href: "/signin", label: "Sign in" },
  { href: FIRST_LESSON_HREF, label: "Get Started" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

function FooterNav({
  title,
  items,
}: {
  title: string;
  items: readonly { href: string; label: string }[];
}) {
  return (
    <nav aria-label={title} className="min-w-0">
      <div className="mb-3 font-mono text-[11px] font-extrabold uppercase tracking-[0.1em] text-ink-muted sm:mb-3.5 sm:text-xs">
        {title}
      </div>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              className="inline-flex min-h-9 items-center text-[13.5px] text-ink-secondary transition-colors hover:text-ink sm:min-h-0 sm:py-0.5 sm:text-sm"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="min-w-0 overflow-x-clip border-t border-card-border bg-bg/50">
      <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col gap-10 px-4 py-10 sm:gap-12 sm:px-8 sm:py-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:py-[52px]">
        {/* Brand */}
        <div className="min-w-0 max-w-md lg:max-w-sm lg:shrink-0">
          <div className="mb-3 flex items-center gap-2.5 sm:mb-3.5">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-brand-gradient shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.3)_0%,transparent_42%)]"
              />
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="relative">
                <path d="m6 15 6-6 6 6" />
                <path d="m6 9 6-6 6 6" opacity=".55" />
              </svg>
            </div>
            <span className="font-display text-[18px] font-extrabold text-ink sm:text-[19px]">
              Ascend
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-ink-secondary text-pretty">
            An independent, community-built platform for learning computer
            science from first principles — no prerequisites, no gatekeeping.
          </p>
        </div>

        {/* Link columns — always paired side-by-side */}
        <div className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-12 lg:gap-x-16 xl:gap-x-20">
          <FooterNav title="Learn" items={LEARN} />
          <FooterNav title="Account" items={ACCOUNT} />
        </div>
      </div>

      <div className="border-t border-card-border">
        <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-5">
          <span className="text-[12px] text-ink-faint sm:text-[12.5px]">
            © 2026 Ascend · Free &amp; open source
          </span>
          <span className="font-mono text-[11px] leading-snug text-ink-faint text-pretty sm:text-right sm:text-[12.5px]">
            Made for people who want to know how it really works.
          </span>
        </div>
      </div>
    </footer>
  );
}
