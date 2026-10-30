import type { ShelfBadge } from "@/lib/achievements/changelog-model";
import { Medallion } from "./medallion";

/** Every badge in one row, earned or not, in a fixed order like an album. */
export function BadgeShelf({ shelf }: { shelf: ShelfBadge[] }) {
  const earned = shelf.filter((b) => b.earned).length;
  return (
    <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
      <h3 className="m-0 text-[14px] font-semibold">
        Your badges{" "}
        <span className="font-normal text-[var(--coach-hero-muted)]">
          {earned} of {shelf.length}
        </span>
      </h3>
      <ul className="m-0 grid list-none grid-cols-4 sm:grid-cols-7 gap-x-2 gap-y-4 p-0">
        {shelf.map((badge) => (
          <li key={badge.id}>
            <a
              href={badge.href}
              aria-label={badge.earned ? `${badge.label}, earned ${badge.dateLabel}` : `${badge.label}, not earned yet`}
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
              {badge.earned ? (
                <span className="text-[10.5px] text-[var(--coach-hero-muted)]">{badge.dateLabel}</span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
