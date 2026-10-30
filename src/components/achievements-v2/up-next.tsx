import Link from "next/link";
import type { AchievementPart } from "@/lib/achievements/achievements-model";

function Progress({ part }: { part: AchievementPart }) {
  const p = part.progress;
  if (!p || p.total <= 1) return null;
  // Pips for small counts (lessons, days); a bar for big ones (cards).
  if (p.total <= 10) {
    return (
      <span role="img" aria-label={`${p.done} of ${p.total}`} className="flex gap-1">
        {Array.from({ length: p.total }, (_, i) => (
          <span key={i} className={`h-2 w-5 rounded-full ${i < p.done ? "bg-[var(--coach-blue)]" : "bg-[var(--coach-scale-empty)]"}`} />
        ))}
      </span>
    );
  }
  return (
    <span role="img" aria-label={`${p.done} of ${p.total}`} className="block h-2 w-full overflow-hidden rounded-full bg-[var(--coach-scale-empty)]">
      <span className="block h-full rounded-full bg-[var(--coach-blue)]" style={{ width: `${Math.round((p.done / p.total) * 100)}%` }} />
    </span>
  );
}

const GRID_COLUMNS: Record<number, string> = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 xl:grid-cols-3" };

export function UpNext({ parts }: { parts: AchievementPart[] }) {
  if (parts.length === 0) return null;
  return (
    <section aria-labelledby="up-next-title" className="flex min-w-0 flex-col gap-3">
      <h2 id="up-next-title" className="m-0 font-display text-[22px] font-extrabold tracking-[-0.02em]">
        Up next
      </h2>
      <ul className={`m-0 grid list-none grid-cols-1 gap-4 p-0 ${GRID_COLUMNS[parts.length] ?? ""}`}>
        {parts.map((part, i) => (
          <li
            key={part.id}
            className="flex min-w-0 flex-col gap-3 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-[var(--coach-border-strong)] text-[18px] text-[var(--coach-ink-muted)]"
              >
                {part.glyph}
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <h3 className="m-0 text-[16px] font-semibold">{part.label}</h3>
                <p className="m-0 text-[13.5px] leading-snug text-[var(--coach-ink-secondary)]">{part.how}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Progress part={part} />
              <span className="text-[12.5px] font-semibold text-[var(--coach-blue)]">
                {part.distance ? part.distance.charAt(0).toUpperCase() + part.distance.slice(1) : null}
              </span>
            </div>
            {part.action ? (
              <Link
                href={part.action.href}
                className={`mt-auto inline-flex min-h-10 w-full items-center justify-center rounded-xl px-4 py-2 text-center text-[13.5px] font-bold leading-snug no-underline ${
                  i === 0
                    ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)]"
                    : "bg-[var(--coach-solid-btn-bg)] text-[var(--coach-solid-btn-ink)] shadow-[0_3px_0_var(--coach-solid-btn-shadow)]"
                }`}
              >
                {part.action.label}
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
