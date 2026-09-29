import Link from "next/link";
import type { CoachHomeModel } from "@/lib/practice/coach-home-model";

const MIX = "choices, flashcards, cloze and short answers, shuffled";

function heroCopy(hero: CoachHomeModel["hero"]): {
  title: string;
  subtitle: string;
} {
  if (hero.action.mode === "due") {
    const word = hero.sessionSize === 1 ? "card" : "cards";
    return {
      title: "Due review",
      subtitle: `${hero.sessionSize} ${word} · ${MIX}`,
    };
  }
  if (hero.action.mode === "all") {
    return {
      title: "All caught up",
      subtitle: "Nothing due right now. Free study shuffles every card you've unlocked.",
    };
  }
  return {
    title: "Nothing to review yet",
    subtitle: "Finish a lesson to unlock practice cards.",
  };
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <span>
      {label}{" "}
      <strong className="font-semibold text-[var(--coach-hero-ink)]">{value}</strong>
    </span>
  );
}

export function DueHero({ hero }: { hero: CoachHomeModel["hero"] }) {
  const { title, subtitle } = heroCopy(hero);
  const stillDue = hero.dueNow - hero.sessionSize;

  return (
    <section
      aria-labelledby="up-next"
      className="flex min-w-0 flex-col items-stretch gap-6 overflow-hidden rounded-[20px] bg-[var(--coach-hero-bg)] px-6 py-6 text-[var(--coach-hero-ink)] sm:px-8 sm:py-7 lg:flex-row lg:items-center"
    >
      <div className="flex min-w-0 grow flex-col gap-3.5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--coach-lime)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--coach-lime-ink)]">
            Recommended
          </span>
          <span className="font-mono text-xs text-[var(--coach-hero-muted)]">
            Up next
          </span>
        </div>
        <h2
          id="up-next"
          className="m-0 font-display text-[28px] font-extrabold leading-none tracking-[-0.02em] sm:text-[30px]"
        >
          {title}
        </h2>
        <p className="m-0 text-[14.5px] leading-relaxed text-[var(--coach-hero-muted)]">
          {subtitle}
        </p>
        {hero.sessionSize > 0 ? (
          <div
            role="img"
            aria-label={`Next session: ${hero.sessionSize} cards`}
            className="flex gap-1.5"
          >
            {Array.from({ length: hero.sessionSize }, (_, i) => (
              <span
                key={i}
                className="h-2 grow rounded-full bg-[var(--coach-hero-track)]"
              />
            ))}
          </div>
        ) : null}
        <div className="mt-1 flex w-full flex-wrap items-center gap-5">
          <Link
            href={hero.action.href}
            className="flex h-11 w-full max-w-full items-center justify-center gap-3 rounded-xl bg-[var(--coach-lime)] px-5 text-[14.5px] font-bold uppercase tracking-[0.02em] text-[var(--coach-lime-ink)] no-underline shadow-[0_4px_0_var(--coach-lime-shadow)] sm:w-auto"
          >
            {hero.action.label}
            <kbd className="hidden h-[22px] items-center rounded-md border border-b-2 border-[var(--coach-lime-shadow)] bg-[var(--coach-lime-soft)] px-1.5 font-mono text-[11px] font-medium normal-case tracking-normal text-[var(--coach-lime-ink)] sm:inline-flex">
              Enter
            </kbd>
          </Link>
          {hero.lastScore || hero.nextReviewLabel || stillDue > 0 ? (
            <div className="flex flex-col gap-0.5 text-[13px] leading-normal text-[var(--coach-hero-muted)]">
              {hero.lastScore ? (
                <MetaLine
                  label="Last time"
                  value={`${hero.lastScore.correct}/${hero.lastScore.total}`}
                />
              ) : null}
              {stillDue > 0 ? (
                <MetaLine label="Still due after this" value={String(stillDue)} />
              ) : null}
              {hero.nextReviewLabel ? (
                <MetaLine label="Next review" value={hero.nextReviewLabel} />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="relative mx-auto hidden h-[160px] w-[196px] max-w-full shrink-0 sm:block lg:mx-0"
      >
        <div className="absolute left-4 top-4 h-[120px] w-[164px] -rotate-9 rounded-[14px] bg-[var(--coach-blue)]" />
        <div className="absolute left-5 top-3 h-[120px] w-[164px] rotate-5 rounded-[14px] bg-[var(--coach-hero-track)]" />
        <div className="absolute left-4 top-5 flex h-[120px] w-[164px] flex-col justify-between rounded-[14px] bg-[var(--coach-hero-card)] p-3.5 text-[var(--coach-hero-card-ink)]">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--coach-hero-card-muted)]">
            Cloze
          </span>
          <span className="font-display text-base font-bold leading-[1.2]">
            A bit holds one of{" "}
            <span className="inline-block h-[1.1em] w-10 border-b-[3px] border-[var(--coach-blue)] align-baseline" />{" "}
            values.
          </span>
        </div>
      </div>
    </section>
  );
}
