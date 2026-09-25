import Link from "next/link";
import { LEVELS, type LevelId } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

interface LessonRow {
  slug: string;
  title: string;
  order: number;
  href?: string;
}

/** Lesson map body — used inside the on-demand drawer (not a permanent rail). */
export function LessonListPanel({
  level,
  currentOrder,
  lessons,
  nextLevelName,
  className,
}: {
  level: LevelId;
  currentOrder: number;
  lessons: LessonRow[];
  nextLevelName: string | null;
  className?: string;
}) {
  const info = LEVELS[level];
  const doneCount = Math.max(0, currentOrder - 1);
  const percent = Math.round((doneCount / info.totalConcepts) * 100);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
        Level {level.slice(6, 8)}
      </div>
      <div className="mb-3 font-display text-[18px] font-extrabold leading-tight tracking-tight text-ink">
        {info.name}
      </div>
      <div className="mb-5 flex items-center gap-2.5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-card-border">
          <div
            className="h-full rounded-full bg-brand-gradient"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="font-mono text-[11px] font-semibold tabular-nums text-ink-muted">
          {doneCount}/{info.totalConcepts}
        </span>
      </div>

      <nav className="flex flex-col gap-0.5" aria-label="Lessons in this level">
        {lessons.map((l) => {
          const state =
            l.order < currentOrder ? "done" : l.order === currentOrder ? "current" : "upcoming";
          return (
            <Link
              key={l.slug}
              href={l.href ?? `/curriculum/${level}/${l.slug}`}
              className={cn(
                "group flex items-start gap-2.5 rounded-xl px-2.5 py-2.5 no-underline transition-colors duration-150",
                state === "current" && "bg-xp-bg ring-1 ring-xp-border",
                state === "done" &&
                  "hover:bg-elevated focus-visible:bg-elevated",
                state === "upcoming" &&
                  "hover:bg-elevated focus-visible:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-1",
              )}
            >
              {state === "done" && (
                <span className="mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-brand-gradient opacity-90">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              )}
              {state === "current" && (
                <span className="mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border-2 border-brand-violet bg-paper shadow-[0_0_0_3px_rgba(13,159,110,0.16)]">
                  <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-brand-violet" />
                </span>
              )}
              {state === "upcoming" && (
                <span className="mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border border-card-border bg-elevated transition-colors group-hover:border-xp-border group-hover:bg-xp-bg/50 group-focus-visible:border-xp-border group-focus-visible:bg-xp-bg/50">
                  <span className="font-mono text-[10px] font-bold tabular-nums text-ink-faint transition-colors group-hover:text-ink group-focus-visible:text-ink">
                    {l.order}
                  </span>
                </span>
              )}
              <span
                className={cn(
                  "min-w-0 flex-1 text-[13.5px] leading-snug transition-colors duration-150",
                  state === "current" && "font-bold text-xp-text",
                  state === "done" &&
                    "font-medium text-ink-secondary group-hover:text-ink group-focus-visible:text-ink",
                  state === "upcoming" &&
                    "font-medium text-ink-muted group-hover:text-ink group-focus-visible:text-ink",
                )}
              >
                {l.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {nextLevelName ? (
        <div className="mt-5 border-t border-divider pt-4 text-[12.5px] leading-relaxed text-ink-muted">
          Recommended after these {info.totalConcepts}:{" "}
          <b className="text-xp-text">{nextLevelName}</b>. All lessons stay open.
        </div>
      ) : (
        <div className="mt-5 border-t border-divider pt-4 text-[12.5px] leading-relaxed text-ink-muted">
          After this level:{" "}
          <Link href="/projects/shellforge" className="font-bold text-xp-text">
            Shellforge
          </Link>{" "}
          (demo project flow).
        </div>
      )}
    </div>
  );
}
