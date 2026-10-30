import Link from "next/link";
import type { ProgressV2Model } from "@/lib/progress/progress-v2-model";

function heroCopy(model: ProgressV2Model): { eyebrow: string; title: string; subtitle: string } {
  const { hero } = model;
  if (hero.allDone) {
    return {
      eyebrow: "Every topic done",
      title: "You finished the curriculum",
      subtitle: `${hero.total} of ${hero.total} lessons. Keep your cards solid in Practice.`,
    };
  }
  if (hero.done === 0) {
    return {
      eyebrow: "You are here",
      title: "You're at the start",
      subtitle: `${hero.total} lessons across four topics, from a single bit to a working shell.`,
    };
  }
  return {
    eyebrow: "You are here",
    title: hero.levelName,
    subtitle: `${hero.done} of ${hero.total} lessons done.`,
  };
}

export function HereHero({ model }: { model: ProgressV2Model }) {
  const { eyebrow, title, subtitle } = heroCopy(model);
  const { hero } = model;
  return (
    <section
      aria-labelledby="here-title"
      className="flex min-w-0 flex-col gap-5 rounded-[20px] bg-[var(--coach-hero-bg)] px-6 py-6 text-[var(--coach-hero-ink)] sm:px-8 sm:py-7"
    >
      <div className="flex flex-col gap-3">
        <span className="text-[14px] font-semibold text-[var(--coach-hero-muted)]">
          {eyebrow}
        </span>
        <h2
          id="here-title"
          className="m-0 font-display text-[28px] font-extrabold leading-none tracking-[-0.02em] sm:text-[30px]"
        >
          {title}
        </h2>
        <p className="m-0 text-[14.5px] leading-relaxed text-[var(--coach-hero-muted)]">{subtitle}</p>
      </div>

      <ol aria-label="Curriculum levels" className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
        {hero.track.map((level) => {
          const done = level.lessons.filter((l) => l.done).length;
          return (
            <li key={level.id} className="flex min-w-0 flex-col gap-2">
              <span className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-mono text-[var(--coach-hero-muted)]">
                  {done}/{level.lessons.length}
                </span>
              </span>
              <span
                role="img"
                aria-label={`${level.name}: ${done} of ${level.lessons.length} lessons done`}
                className="flex gap-1"
              >
                {level.lessons.map((lesson) => (
                  <span
                    key={lesson.key}
                    title={lesson.title}
                    className={`h-2 grow rounded-full ${
                      lesson.done ? "bg-[var(--coach-lime)]" : "bg-[var(--coach-hero-track)]"
                    }`}
                  />
                ))}
              </span>
              <span className="truncate text-[13px] text-[var(--coach-hero-ink)]">{level.name}</span>
            </li>
          );
        })}
      </ol>

      {hero.next ? (
        <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href={hero.next.href}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--coach-lime)] px-5 text-[14.5px] font-bold tracking-[0.02em] text-[var(--coach-lime-ink)] no-underline shadow-[0_4px_0_var(--coach-lime-shadow)] sm:w-auto"
          >
            {hero.done === 0 ? "Start your first lesson" : "Continue lesson"}
          </Link>
          <span className="text-[13px] text-[var(--coach-hero-muted)]">
            Next{" "}
            <strong className="font-semibold text-[var(--coach-hero-ink)]">{hero.next.title}</strong>
          </span>
        </div>
      ) : null}
    </section>
  );
}
