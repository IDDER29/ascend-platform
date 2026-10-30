import type { BadgeView } from "@/lib/achievements/achievements-model";
import type { MissionRank } from "@/lib/achievements/catalog";
import { CrestPatch, Headband } from "./emblems";
import { Ribbon } from "./ribbon";

const RANK_STYLE: Record<MissionRank, string> = {
  S: "bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]",
  A: "bg-[var(--coach-blue)] text-[var(--coach-on-blue)]",
  B: "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]",
  C: "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]",
  D: "bg-[var(--coach-chip)] text-[var(--coach-ink-secondary)]",
};

/** How hard the mission was: "B-rank". Grades the task, not the person. */
export function RankChip({ rank }: { rank: MissionRank }) {
  return (
    <span
      title={`${rank}-rank mission`}
      className={`inline-flex h-5 shrink-0 items-center rounded-md px-1.5 font-mono text-[11px] font-bold ${RANK_STYLE[rank]}`}
    >
      {rank}-rank
    </span>
  );
}

/** The small mark for a badge in lists: its emblem for insignia, its ribbon otherwise. */
export function BadgeMark({ badge }: { badge: BadgeView }) {
  if (badge.insignia?.kind === "crest") {
    return (
      <span className="flex w-10 justify-center">
        <CrestPatch crest={badge.insignia.crest} earned={badge.earned} size="sm" onDark={false} />
      </span>
    );
  }
  if (badge.insignia?.kind === "headband") {
    return (
      <span className="flex w-10 justify-center rounded-md bg-[var(--coach-hero-bg)] py-1.5">
        <Headband earned={badge.earned} size="xs" />
      </span>
    );
  }
  return <Ribbon id={badge.id} group={badge.group} glyph={badge.glyph} size="small" muted={!badge.earned} />;
}
