import type { AchievementGroup } from "@/lib/achievements/catalog";
import { ribbonBackground, ribbonStripes } from "@/lib/achievements/ribbons";

/** The full medal for a citation: the ribbon as a drape, with the medal hanging from it. */
export function Medal({ id, group, glyph, earned }: { id: string; group: AchievementGroup; glyph: string; earned: boolean }) {
  return (
    <div aria-hidden="true" className={`flex flex-col items-center ${earned ? "" : "opacity-50 grayscale"}`}>
      <span
        style={{
          background: ribbonBackground(ribbonStripes(id, group)),
          clipPath: "polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%)",
        }}
        className="relative block h-[78px] w-[84px]"
      >
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_40%,rgba(0,0,0,0.22))]" />
      </span>
      <span
        className={`-mt-3 flex size-[92px] items-center justify-center rounded-full text-[36px] leading-none ${
          earned
            ? "border-[5px] border-[var(--coach-lime-shadow)] bg-[var(--coach-lime)] text-[var(--coach-lime-ink)] shadow-[0_6px_14px_rgba(0,0,0,0.25),inset_0_-4px_0_rgba(0,0,0,0.12)]"
            : "border-[3px] border-dashed border-[var(--coach-border-strong)] bg-[var(--coach-surface)] text-[var(--coach-ink-muted)]"
        }`}
      >
        {glyph}
      </span>
    </div>
  );
}
