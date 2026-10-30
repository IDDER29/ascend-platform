import type { AchievementsModel } from "@/lib/achievements/achievements-model";
import { badgeAnchor, Medallion } from "./medallion";

/** The whole collection at a glance: every badge, earned or not, in a fixed order. */
export function CollectionHero({ model }: { model: AchievementsModel }) {
  return (
    <section
      aria-labelledby="collection-title"
      className="flex min-w-0 flex-col gap-5 rounded-[24px] bg-[var(--coach-hero-bg)] px-6 py-7 text-[var(--coach-hero-ink)] sm:px-9 sm:py-8"
    >
      <h2 id="collection-title" className="m-0 flex items-baseline gap-3">
        <span className="font-display text-[44px] font-extrabold leading-none tracking-[-0.04em] text-[var(--coach-lime)] sm:text-[56px]">
          {model.earnedCount}
        </span>
        <span className="text-[16px] text-[var(--coach-hero-muted)]">of {model.total} badges earned</span>
      </h2>
      <ul className="m-0 grid list-none grid-cols-4 gap-x-2 gap-y-4 p-0 sm:grid-cols-6 lg:grid-cols-9">
        {model.parts.map((badge) => (
          <li key={badge.id}>
            <a
              href={`#${badgeAnchor(badge.id)}`}
              aria-label={badge.earned ? `${badge.label}, earned ${badge.earnedLabel}` : `${badge.label}, not earned yet`}
              className="group flex flex-col items-center gap-1.5 rounded-xl py-1 text-center no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coach-lime)]"
            >
              <Medallion glyph={badge.glyph} earned={badge.earned} size="lg" onDark />
              <span
                className={`text-[11.5px] leading-tight group-hover:underline ${
                  badge.earned ? "font-semibold text-[var(--coach-hero-ink)]" : "text-[var(--coach-hero-muted)]"
                }`}
              >
                {badge.label}
              </span>
              {badge.earned ? <span className="text-[10.5px] text-[var(--coach-hero-muted)]">{badge.earnedLabel}</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
