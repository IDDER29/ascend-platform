import Link from "next/link";
import type { SlippingLesson } from "@/lib/progress/progress-v2-model";

export function SlippingCard({ slipping, started }: { slipping: SlippingLesson[]; started: boolean }) {
  return (
    <section
      aria-labelledby="slipping-title"
      className="flex min-w-0 flex-col gap-3 rounded-[20px] bg-[var(--coach-hero-bg)] p-6 text-[var(--coach-hero-ink)]"
    >
      <h2 id="slipping-title" className="m-0 text-base font-semibold text-[var(--coach-lime)]">
        Slipping
      </h2>
      {slipping.length === 0 ? (
        <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-hero-muted)]">
          {started
            ? "Nothing slipping right now. Your reviews are on schedule."
            : "Once you practice, lessons you're starting to forget show up here."}
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {slipping.map((lesson) => (
            <li
              key={lesson.key}
              className="flex items-center justify-between gap-3 border-b border-[var(--coach-hero-track)] py-2.5 last:border-b-0"
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="line-clamp-2 text-[15px] font-semibold leading-snug">{lesson.title}</span>
                <span className="font-mono text-xs text-[var(--coach-orange)]">{lesson.reason}</span>
              </span>
              <Link
                href={lesson.href}
                className="flex h-11 shrink-0 items-center px-1 text-sm font-semibold text-[var(--coach-hero-ink)] underline"
              >
                Review
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
