import Link from "next/link";
import type { CoachPathFocus } from "@/lib/practice/coach-path-model";

function joinTitles(raw: string[]): string {
  const titles = raw.map((title) => `“${title}”`);
  if (titles.length <= 1) return titles[0] ?? "";
  return `${titles.slice(0, -1).join(", ")} and ${titles[titles.length - 1]}`;
}

export function PathFocus({ focus }: { focus: CoachPathFocus }) {
  return (
    <section
      aria-labelledby="path-focus-title"
      className="flex flex-col gap-2.5 rounded-[20px] bg-[var(--coach-hero-bg)] p-6 text-[var(--coach-hero-ink)]"
    >
      <h2 id="path-focus-title" className="m-0 text-base font-semibold text-[var(--coach-lime)]">
        Where to focus
      </h2>
      <p className="m-0 text-[15px] leading-relaxed text-[var(--coach-hero-muted)]">
        Most of your misses are in the {focus.sectionTitle} branch. A short deck of{" "}
        {joinTitles(focus.lessonTitles)} will do more than another full review.
      </p>
      <Link
        href={focus.href}
        className="flex h-11 items-center text-sm font-semibold text-[var(--coach-hero-ink)] underline"
      >
        Build that deck
      </Link>
    </section>
  );
}
