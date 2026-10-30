"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CriterionRow } from "@/components/achievements/badge-card";
import { Medallion } from "@/components/achievements/medallion";
import type { AchievementsModel, BadgeView } from "@/lib/achievements/achievements-model";
import { placeOnTrack } from "@/lib/achievements/track-layout";

const LANE_DELAY_MS = 90;

function percent(badge: BadgeView): number {
  return Math.round(badge.ratio * 100);
}

function ariaFor(badge: BadgeView): string {
  return badge.earned ? `${badge.label}, earned ${badge.earnedLabel}` : `${badge.label}, ${percent(badge)}% of the way there`;
}

type Common = {
  selectedId: string;
  /** Badges the selected combination asks for, ringed on the track. */
  partIds: ReadonlySet<string>;
  onSelect: (id: string) => void;
};

function Labelled({ badge, common, alwaysLabel = false }: { badge: BadgeView; common: Common; alwaysLabel?: boolean }) {
  return (
    <span className="flex w-[76px] flex-col items-center gap-1">
      <TrackButton badge={badge} common={common} size="sm" />
      <span
        className={`max-w-full truncate text-center text-[11px] leading-tight ${alwaysLabel ? "block" : "hidden sm:block"} ${
          badge.earned ? "font-semibold text-[var(--coach-hero-ink)]" : "text-[var(--coach-hero-muted)]"
        }`}
      >
        {badge.label}
      </span>
    </span>
  );
}

function TrackButton({ badge, common, size }: { badge: BadgeView; common: Common; size: "sm" | "md" }) {
  const selected = common.selectedId === badge.id;
  const isPart = common.partIds.has(badge.id);
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={ariaFor(badge)}
      title={badge.label}
      onClick={() => common.onSelect(badge.id)}
      className={`rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coach-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--coach-hero-bg)] ${
        selected
          ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[var(--coach-hero-bg)]"
          : isPart
            ? "ring-2 ring-[var(--coach-blue)] ring-offset-2 ring-offset-[var(--coach-hero-bg)]"
            : "hover:scale-105"
      }`}
    >
      <Medallion glyph={badge.glyph} earned={badge.earned} size={size} onDark />
    </button>
  );
}

function Lane({
  title,
  badges,
  index,
  common,
}: {
  title: string;
  badges: BadgeView[];
  index: number;
  common: Common;
}) {
  const open = badges.filter((b) => !b.earned);
  const earned = badges.filter((b) => b.earned);
  const spots = placeOnTrack(open.map((b) => ({ id: b.id, ratio: b.ratio })), 15);
  const byId = new Map(badges.map((b) => [b.id, b]));
  const twoRows = spots.some((s) => s.row === 1);

  return (
    <li className="grid grid-cols-1 gap-x-5 gap-y-2 border-t border-white/10 py-4 first:border-t-0 md:grid-cols-[120px_minmax(0,1fr)_minmax(140px,200px)] md:items-center">
      <h3 className="m-0 text-[13.5px] font-semibold text-[var(--coach-hero-muted)]">{title}</h3>

      {/* The lane: 0% at the left, the finish line at the right. */}
      <div className={`relative ${twoRows ? "h-[100px] sm:h-[124px]" : "h-[48px] sm:h-[60px]"}`}>
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 h-px bg-[var(--coach-hero-track)] ${twoRows ? "top-1/2 -translate-y-1/2" : "top-4"}`}
        />
        <span aria-hidden="true" className="absolute right-0 top-0 h-full w-[3px] rounded-full bg-[var(--coach-lime)]" />
        <ul aria-label={`${title}: not earned yet`} className="m-0 list-none p-0">
          {spots.map((spot, i) => {
            const badge = byId.get(spot.id)!;
            return (
              <li
                key={spot.id}
                style={{
                  left: `${spot.pos}%`,
                  ["--track-delay" as string]: `${index * LANE_DELAY_MS + i * 40}ms`,
                }}
                className={`achv-track-in absolute -translate-x-1/2 ${
                  twoRows ? (spot.row === 0 ? "top-0" : "bottom-0") : "top-0"
                }`}
              >
                <Labelled badge={badge} common={common} />
              </li>
            );
          })}
        </ul>
        {open.length === 0 ? (
          <span className="absolute inset-y-0 left-0 flex items-center text-[12.5px] text-[var(--coach-hero-muted)]">
            Every badge here is earned
          </span>
        ) : null}
      </div>

      {/* Past the finish line: earned badges. */}
      <ul aria-label={`${title}: earned`} className="m-0 flex min-h-8 list-none flex-wrap items-start gap-1 p-0">
        {earned.length > 0 ? (
          <li aria-hidden="true" className="self-center pr-1 text-[12px] font-semibold text-[var(--coach-lime)] md:hidden">
            Earned
          </li>
        ) : null}
        {earned.map((badge) => (
          <li key={badge.id}>
            <Labelled badge={badge} common={common} alwaysLabel />
          </li>
        ))}
        {earned.length === 0 ? <li className="text-[12px] text-[var(--coach-hero-muted)]">None yet</li> : null}
      </ul>
    </li>
  );
}

function Spotlight({
  badge,
  glyphOf,
  onSelect,
}: {
  badge: BadgeView;
  glyphOf: (id: string) => string;
  onSelect: (id: string) => void;
}) {
  const done = badge.criteria.filter((c) => c.done).length;
  return (
    <section
      aria-live="polite"
      aria-labelledby="spotlight-title"
      className="grid grid-cols-1 gap-6 rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-6 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] md:p-8"
    >
      <div className="flex flex-col items-start gap-3">
        <Medallion glyph={badge.glyph} earned={badge.earned} size="lg" />
        <h2 id="spotlight-title" className="m-0 font-display text-[28px] font-extrabold leading-tight tracking-[-0.03em]">
          {badge.label}
        </h2>
        <p className={`m-0 text-[14px] ${badge.earned ? "font-semibold text-[var(--coach-tint-lime-ink)]" : "text-[var(--coach-ink-secondary)]"}`}>
          {badge.earned
            ? `Earned ${badge.earnedLabel}`
            : `${percent(badge)}% of the way there${badge.criteria.length > 1 ? `, ${done} of ${badge.criteria.length} conditions met` : ""}`}
        </p>
        {badge.earned ? <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">{badge.means}.</p> : null}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <h3 className="m-0 text-[13px] font-semibold text-[var(--coach-ink-muted)]">
          {badge.criteria.length > 1 ? "Earn it by meeting all of these" : "Earn it by"}
        </h3>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {badge.criteria.map((c) => (
            <CriterionRow key={c.text} c={c} partGlyph={c.badgeId ? glyphOf(c.badgeId) : null} onSelectPart={onSelect} />
          ))}
        </ul>
        {badge.repoUrl ? (
          <a
            href={badge.repoUrl}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            className="flex min-w-0 items-center gap-1.5 text-[13px] text-[var(--coach-blue)] no-underline hover:underline"
          >
            <ExternalLink size={13} aria-hidden="true" className="shrink-0" />
            <span className="truncate font-mono">{badge.repoLabel}</span>
          </a>
        ) : null}
        {badge.action ? (
          <Link
            href={badge.action.href}
            className="inline-flex min-h-11 w-fit items-center rounded-xl bg-[var(--coach-lime)] px-5 text-[14px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_3px_0_var(--coach-lime-shadow)]"
          >
            {badge.action.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

/** Every badge placed by how close you are; select one to see its exact rule. */
export function AchievementsTrack({ model }: { model: AchievementsModel }) {
  const [selectedId, setSelectedId] = useState(model.closest[0]?.id ?? model.earnedNewestFirst[0] ?? model.parts[0].id);
  const selected = model.parts.find((p) => p.id === selectedId) ?? model.parts[0];
  const partIds = new Set(selected.criteria.map((c) => c.badgeId).filter((id): id is string => Boolean(id)));
  const glyphOf = (id: string) => model.parts.find((p) => p.id === id)?.glyph ?? "•";
  const common: Common = {
    selectedId,
    partIds,
    onSelect: (id) => {
      setSelectedId(id);
      document.getElementById("spotlight-title")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },
  };

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <section
        aria-labelledby="track-title"
        className="flex min-w-0 flex-col gap-2 rounded-[24px] bg-[var(--coach-hero-bg)] px-5 py-6 text-[var(--coach-hero-ink)] sm:px-8 sm:py-7"
      >
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h2 id="track-title" className="m-0 flex items-baseline gap-3">
            <span className="font-display text-[44px] font-extrabold leading-none tracking-[-0.04em] text-[var(--coach-lime)]">
              {model.earnedCount}
            </span>
            <span className="text-[15px] text-[var(--coach-hero-muted)]">of {model.total} earned</span>
          </h2>
          <p className="m-0 text-[13px] text-[var(--coach-hero-muted)]">
            Further right means closer to earning it. Past the line: earned.
          </p>
        </div>
        <ol className="m-0 list-none p-0">
          {model.groups.map((group, i) => (
            <Lane key={group.id} title={group.title} badges={group.badges} index={i} common={common} />
          ))}
        </ol>
      </section>

      <Spotlight badge={selected} glyphOf={glyphOf} onSelect={setSelectedId} />
    </div>
  );
}
