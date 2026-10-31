"use client";

import { useState } from "react";
import type { AchievementsModel } from "@/lib/achievements/achievements-model";
import { MISSION_RANKS, type MissionRank } from "@/lib/achievements/catalog";
import { RankChip } from "./marks";

const SHOWN = 8;

/** Every completed task with its rank, newest first: the record behind the titles. */
export function MissionLog({ model }: { model: AchievementsModel }) {
  const [rank, setRank] = useState<MissionRank | null>(null);
  const [all, setAll] = useState(false);
  const missions = rank ? model.missions.filter((m) => m.rank === rank) : model.missions;
  const shown = all ? missions : missions.slice(0, SHOWN);

  return (
    <section aria-labelledby="mission-log-title" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="mission-log-title" className="m-0 font-display text-[22px] font-extrabold tracking-[-0.02em]">
            Mission log
          </h2>
          <p className="m-0 text-[14px] text-[var(--coach-ink-secondary)]">
            Every task you have completed, with its rank. Titles are earned from this record.
          </p>
        </div>
        <div role="group" aria-label="Filter by rank" className="flex flex-wrap gap-1.5">
          {[null, ...MISSION_RANKS].map((r) => (
            <button
              key={r ?? "all"}
              type="button"
              aria-pressed={rank === r}
              onClick={() => {
                setRank(r);
                setAll(false);
              }}
              className={`h-8 rounded-lg border-2 px-2.5 text-[12.5px] font-semibold ${
                rank === r
                  ? "border-[var(--coach-ink)] bg-[var(--coach-ink)] text-[var(--coach-surface)]"
                  : "border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink-secondary)] hover:border-[var(--coach-border-strong)]"
              }`}
            >
              {r ? `${r} · ${model.missionRecord[r]}` : `All · ${model.missions.length}`}
            </button>
          ))}
        </div>
      </div>

      {missions.length === 0 ? (
        <p className="m-0 rounded-2xl border-2 border-dashed border-[var(--coach-border-strong)] p-5 text-[14px] text-[var(--coach-ink-secondary)]">
          {rank
            ? `No ${rank}-rank missions yet.`
            : "No missions yet. Finishing a lesson or doing a review session is your first D-rank mission."}
        </p>
      ) : (
        <ol className="m-0 list-none rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-0 px-5 py-2 md:columns-2 md:gap-x-10">
          {shown.map((m, i) => (
            <li
              key={`${m.at}-${m.label}-${i}`}
              className="flex min-w-0 break-inside-avoid items-center gap-3 border-b border-[var(--coach-divider)] py-2.5 last:border-b-0"
            >
              <span className="w-12 shrink-0 font-mono text-[12px] text-[var(--coach-ink-muted)]">{m.dateLabel}</span>
              <RankChip rank={m.rank} />
              <span className="min-w-0 flex-1 text-[14px] leading-snug md:truncate">{m.label}</span>
            </li>
          ))}
        </ol>
      )}

      {missions.length > SHOWN ? (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          className="w-fit text-[13.5px] font-semibold text-[var(--coach-ink)] underline underline-offset-2"
        >
          {all ? "Show fewer" : `Show all ${missions.length} missions`}
        </button>
      ) : null}
    </section>
  );
}
