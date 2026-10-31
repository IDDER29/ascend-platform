import Link from "next/link";
import { CONTENT_REPO_URL } from "@/lib/brand/repo";
import { FIRST_LESSON_HREF, SIGNIN_HREF, SIGNUP_HREF } from "@/lib/routes";
import { SITE_NAV } from "@/lib/site/site-nav";
import { BrandMark, WRAP } from "./site-ui";

const COLUMNS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  { title: "Ascend", links: [...SITE_NAV] },
  {
    title: "Learn",
    links: [
      { href: FIRST_LESSON_HREF, label: "The first lesson" },
      { href: "/practice", label: "Practice" },
      { href: "/projects/shellforge", label: "ShellForge" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: SIGNUP_HREF, label: "Create an account" },
      { href: SIGNIN_HREF, label: "Sign in" },
      { href: "/dashboard", label: "Today" },
    ],
  },
  {
    title: "More",
    links: [
      { href: CONTENT_REPO_URL, label: "GitHub", external: true },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-[var(--coach-border)] bg-[var(--coach-surface)]">
      <div className={`${WRAP} flex flex-col gap-10 py-12 lg:flex-row lg:justify-between`}>
        <div className="max-w-[300px]">
          <Link href="/" className="flex items-center gap-2.5 text-[var(--coach-ink)] no-underline">
            <BrandMark size={28} />
            <span className="font-display text-[18px] font-extrabold tracking-[-0.02em]">Ascend</span>
          </Link>
          <p className="m-0 mt-3 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">
            How computers really work, from a single bit to a shell you wrote yourself. Free, and built in the open.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="m-0 mb-3 text-[13px] font-bold text-[var(--coach-ink)]">{col.title}</h2>
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-8 items-center text-[14px] text-[var(--coach-ink-secondary)] no-underline hover:text-[var(--coach-ink)]"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="inline-flex min-h-8 items-center text-[14px] text-[var(--coach-ink-secondary)] no-underline hover:text-[var(--coach-ink)]"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t-2 border-[var(--coach-divider)]">
        <p className={`${WRAP} m-0 py-5 text-[13px] text-[var(--coach-ink-muted)]`}>
          © 2026 Ascend. Every lesson is a file on GitHub that anyone can fix.
        </p>
      </div>
    </footer>
  );
}
