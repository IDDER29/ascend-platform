import type { AchievementGroup } from "@/lib/achievements/catalog";
import { ribbonBackground, ribbonStripes } from "@/lib/achievements/ribbons";

const SIZE = {
  // Three to a row must fit half a uniform: narrower where the chest sits beside the citation.
  rack: "h-[22px] w-[72px] sm:h-[30px] sm:w-[96px] lg:h-[23px] lg:w-[70px]",
  card: "h-[16px] w-[52px]",
  small: "h-[12px] w-[40px]",
} as const;

/** A ribbon bar: the badge's stripes with a little sheen; combinations carry a device. */
export function Ribbon({
  id,
  group,
  glyph,
  size = "rack",
  muted = false,
}: {
  id: string;
  group: AchievementGroup;
  glyph: string;
  size?: keyof typeof SIZE;
  muted?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ background: ribbonBackground(ribbonStripes(id, group)) }}
      className={`relative block shrink-0 overflow-hidden rounded-[3px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.35)] ${SIZE[size]} ${
        muted ? "opacity-50 saturate-50" : ""
      }`}
    >
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_45%,rgba(0,0,0,0.2))]" />
      {group === "combination" && size === "rack" ? (
        <span className="absolute left-1/2 top-1/2 flex size-[15px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--coach-hero-bg)] text-[9px] leading-none text-[var(--coach-lime)] sm:size-[20px] sm:text-[11px] lg:size-[16px] lg:text-[9px]">
          {glyph}
        </span>
      ) : null}
    </span>
  );
}
