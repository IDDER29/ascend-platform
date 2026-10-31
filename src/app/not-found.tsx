import Link from "next/link";
import { SearchButton } from "@/components/site/search-button";
import { SiteShell } from "@/components/site/site-shell";
import { LEAD, LIME_BTN, WRAP } from "@/components/site/site-ui";
import { FIRST_LESSON_HREF } from "@/lib/routes";
import { CATALOG_HREF, FAQ_HREF, HOW_IT_WORKS_HREF } from "@/lib/site/site-nav";

const LINKS = [
  { href: CATALOG_HREF, label: "All paths" },
  { href: FIRST_LESSON_HREF, label: "The first lesson" },
  { href: HOW_IT_WORKS_HREF, label: "How it works" },
  { href: "/dashboard", label: "Today" },
  { href: FAQ_HREF, label: "FAQ" },
];

export default function NotFound() {
  return (
    <SiteShell>
      <section className={`${WRAP} pb-20 pt-12 sm:pt-20`}>
        <pre className="m-0 inline-block max-w-full overflow-x-auto rounded-2xl bg-[var(--coach-code-bg)] px-5 py-4 font-mono text-[14px] leading-relaxed text-[var(--coach-code-ink)]">
          <span className="text-[var(--coach-lime)]">$</span> ./ascend --goto this-page{"\n"}
          <span className="text-[var(--coach-orange)]">Segmentation fault</span> (core dumped)
        </pre>
        <h1 className="m-0 mt-8 max-w-[16ch] font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.04em] [text-wrap:balance] sm:text-[60px]">
          This address points to nothing.
        </h1>
        <p className={`${LEAD} mt-5 max-w-[52ch]`}>
          The page moved, never existed, or the link was a bad pointer. Search for a lesson, or pick up from one of
          these.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={LIME_BTN}>
            Go to the home page
          </Link>
          <SearchButton />
        </div>
        <nav aria-label="Popular pages" className="mt-10">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-10 items-center rounded-full bg-[var(--coach-tint-neutral-bg)] px-4 text-[14.5px] font-semibold text-[var(--coach-ink)] no-underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </SiteShell>
  );
}
