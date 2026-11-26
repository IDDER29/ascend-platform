import Link from "next/link";
import { stairOffset, type ClimbStage } from "@/lib/site/climb-model";

/** The bits of the letter A, the first thing the climb starts from. */
const BITS = "01000001";
/** How far right the top step sits, on wide screens (percent). */
const STAIR_WIDTH = 24;

/**
 * The climb, drawn as a staircase: the bits at the bottom and one step up for each path. The bottom step
 * starts the first lesson; the others open their path.
 */
export function Climb({ stages }: { stages: ClimbStage[] }) {
  return (
    <figure className="m-0 flex w-full flex-col gap-3" aria-label="The climb, from a bit upwards">
      {/* Listed from the first step; drawn with it at the bottom. */}
      <ol className="m-0 flex list-none flex-col-reverse gap-3 p-0">
        {stages.map((s, i) => {
          const offset = stairOffset(i, stages.length, STAIR_WIDTH);
          return (
            <li
              key={s.slug}
              className="animate-rise sm:ml-[var(--step)] sm:mr-[var(--rest)]"
              style={{
                animationDelay: `${i * 0.12 + 0.05}s`,
                ["--step" as string]: `${offset}%`,
                ["--rest" as string]: `${STAIR_WIDTH - offset}%`,
              }}
            >
              <Link
                href={s.href}
                className="flex items-start gap-3.5 rounded-2xl bg-[var(--coach-hero-card)] p-4 text-[var(--coach-hero-card-ink)] no-underline"
              >
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-hero-bg)] font-display text-[18px] font-extrabold text-[var(--coach-lime)]"
                >
                  {s.stage}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <span className="text-[16.5px] font-bold leading-tight">{s.title}</span>
                    {i === 0 && (
                      <span className="rounded-full bg-[var(--coach-lime)] px-2.5 py-0.5 text-[11.5px] font-bold text-[var(--coach-lime-ink)]">
                        Start here
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[14.5px] leading-snug">{s.goal}</span>
                  <span className="mt-0.5 block text-[13px] tabular-nums text-[var(--coach-hero-card-muted)]">
                    {s.size}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <figcaption
        className="animate-rise flex items-center gap-3 px-1 pt-1 font-mono text-[13px] text-[var(--coach-hero-muted)]"
        aria-label="The bits 01000001, which spell the letter A"
      >
        <span aria-hidden className="flex gap-1">
          {BITS.split("").map((b, i) => (
            <span
              key={i}
              className={`flex h-7 w-5 items-center justify-center rounded-md text-[13px] font-semibold ${
                b === "1"
                  ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]"
                  : "border-2 border-[var(--coach-hero-track)] text-[var(--coach-hero-muted)]"
              }`}
            >
              {b}
            </span>
          ))}
        </span>
        <span aria-hidden>= A</span>
      </figcaption>
    </figure>
  );
}
