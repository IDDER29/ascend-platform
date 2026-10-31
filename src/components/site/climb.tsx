import Link from "next/link";
import { CrestArt } from "@/components/achievements/emblems";
import { CREST_OF } from "@/lib/achievements/scrolls-model";
import type { ClimbStep } from "@/lib/site/site-data";

/** The bits of the letter A, the first thing the climb starts from. */
const BITS = "01000001";

/**
 * The climb, drawn as a staircase: the bits at the bottom, each topic a step
 * up, and the shell you write at the top. Each step opens that topic's first lesson.
 */
export function Climb({ steps }: { steps: ClimbStep[] }) {
  const top = [...steps].reverse();
  return (
    <figure className="m-0 flex w-full flex-col gap-2" aria-label="The climb, from a bit to a shell">
      <div
        className="animate-rise rounded-2xl border-2 border-[var(--coach-hero-track)] bg-black/30 px-4 py-3 font-mono text-[14px] text-[var(--coach-hero-ink)] sm:ml-[24%]"
        style={{ animationDelay: `${steps.length * 0.09 + 0.1}s` }}
      >
        <span className="text-[var(--coach-lime)]">$</span> ./shellforge
        <span
          aria-hidden
          className="site-caret ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[3px] bg-[var(--coach-lime)]"
        />
        <span className="mt-1 block font-sans text-[12.5px] text-[var(--coach-hero-muted)]">
          ShellForge: the shell you build at the top
        </span>
      </div>

      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {top.map((s) => {
          const fromBottom = steps.indexOf(s);
          return (
            <li
              key={s.levelId}
              className="animate-rise"
              style={{
                animationDelay: `${fromBottom * 0.09 + 0.05}s`,
                // Each step sits further right than the one below it, on wide screens.
                ["--step" as string]: `${fromBottom * 8}%`,
              }}
            >
              <Link
                href={s.firstLesson}
                className="flex items-center gap-3 rounded-2xl bg-[var(--coach-hero-card)] px-4 py-3 text-[var(--coach-hero-card-ink)] no-underline sm:ml-[var(--step)] sm:mr-[calc(24%-var(--step))]"
              >
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]"
                >
                  <svg
                    viewBox="0 0 48 48"
                    className="size-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <CrestArt crest={CREST_OF[s.levelId]} />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15.5px] font-bold leading-tight">{s.name}</span>
                  <span className="block text-[13px] tabular-nums text-[var(--coach-hero-card-muted)]">
                    {s.lessons} lessons · {s.minutes} min
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
