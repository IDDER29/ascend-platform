import Link from "next/link";
import { Check } from "lucide-react";

export type TopicLesson = { key: string; title: string; href: string; done: boolean; current: boolean };

/** The topic's lessons in order, this one marked: the way to move around a topic. */
export function TopicLessons({
  topic,
  pathHref,
  lessons,
}: {
  topic: string;
  pathHref: string | null;
  lessons: TopicLesson[];
}) {
  const done = lessons.filter((l) => l.done).length;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="m-0 text-[13px] font-semibold text-[var(--coach-ink-muted)]">In {topic}</p>
        <span className="text-[12px] tabular-nums text-[var(--coach-ink-muted)]">
          {done} of {lessons.length} done
        </span>
      </div>
      <ol className="m-0 flex list-none flex-col gap-0.5 p-0">
        {lessons.map((l, i) => (
          <li key={l.key}>
            <Link
              href={l.href}
              aria-current={l.current ? "page" : undefined}
              className={`-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] leading-snug no-underline ${
                l.current
                  ? "bg-[var(--coach-tint-neutral-bg)] font-semibold text-[var(--coach-ink)]"
                  : "text-[var(--coach-ink-secondary)] hover:text-[var(--coach-ink)]"
              }`}
            >
              <span
                aria-hidden
                className={`flex size-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold tabular-nums ${
                  l.done
                    ? "bg-[var(--coach-ink)] text-[var(--coach-surface)]"
                    : "border-2 border-[var(--coach-border)] text-[var(--coach-ink-muted)]"
                }`}
              >
                {l.done ? <Check size={11} strokeWidth={3.5} /> : i + 1}
              </span>
              <span className="min-w-0">{l.title}</span>
              {l.done && <span className="sr-only"> (done)</span>}
            </Link>
          </li>
        ))}
      </ol>
      {pathHref && (
        <Link
          href={pathHref}
          className="text-[12.5px] text-[var(--coach-ink-muted)] underline-offset-2 hover:underline"
        >
          See the whole path
        </Link>
      )}
    </div>
  );
}
