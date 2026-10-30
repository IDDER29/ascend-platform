"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { AchievementsModel, BadgeView } from "@/lib/achievements/achievements-model";
import {
  CREST_IDS,
  GROUP_TITLES,
  MISSION_RANKS,
  TASK_RANKS,
  TITLES,
  type MissionRank,
  type Title,
} from "@/lib/achievements/catalog";
import { byPrecedence, groupSwatch, PRECEDENCE, rackRows } from "@/lib/achievements/ribbons";
import { CriterionRow } from "./criterion-row";
import { CrestPatch, Headband } from "./emblems";
import { BadgeMark, RankChip } from "./marks";
import { Medal } from "./medal";
import { MissionLog } from "./mission-log";
import { useSeenDecorations } from "./use-seen-decorations";
import { Ribbon } from "./ribbon";

const PIN_STEP_MS = 90;

const TITLE_META: Record<string, Title> = Object.fromEntries(TITLES.map((t) => [t.id, t]));

/** Rank seals share the selection with badges: "rank:D" … "rank:S". */
function rankKey(rank: MissionRank): string {
  return `rank:${rank}`;
}

const MISSIONS_SHOWN = 6;

/** Missions as a dated list with their ranks: the work behind a badge, or every mission of a rank. */
function MissionList({ missions }: { missions: AchievementsModel["missions"] }) {
  const [all, setAll] = useState(false);
  const shown = all ? missions : missions.slice(0, MISSIONS_SHOWN);
  return (
    <>
      <ol className="m-0 flex list-none flex-col p-0">
        {shown.map((m, i) => (
          <li
            key={`${m.ref}-${i}`}
            className="flex min-w-0 items-start gap-2.5 border-b border-[var(--coach-divider)] py-2 last:border-b-0"
          >
            <span className="w-11 shrink-0 pt-0.5 font-mono text-[11.5px] text-[var(--coach-ink-muted)]">
              {m.dateLabel}
            </span>
            <RankChip rank={m.rank} />
            <span className="min-w-0 flex-1 text-[13.5px] leading-snug">{m.label}</span>
          </li>
        ))}
      </ol>
      {missions.length > MISSIONS_SHOWN ? (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          className="w-fit text-[13px] font-semibold text-[var(--coach-ink)] underline underline-offset-2"
        >
          {all ? "Show fewer" : `Show all ${missions.length}`}
        </button>
      ) : null}
    </>
  );
}

/** A rank seal opened: what the rank means and every mission done at it. */
function RankDetail({ rank, model }: { rank: MissionRank; model: AchievementsModel }) {
  const missions = model.missions.filter((m) => m.rank === rank);
  return (
    <section
      aria-live="polite"
      aria-labelledby="citation-title"
      className="flex min-w-0 flex-col items-center gap-4 rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-6 text-center sm:p-7"
    >
      <span
        aria-hidden="true"
        className="flex size-24 items-center justify-center rounded-2xl bg-[var(--coach-hero-bg)] font-display text-[52px] font-extrabold text-[var(--coach-lime)] shadow-[inset_0_0_0_3px_var(--coach-hero-bg),inset_0_0_0_5px_rgba(255,255,255,0.15)]"
      >
        {rank}
      </span>
      <div className="flex flex-col gap-1">
        <h2
          id="citation-title"
          className="m-0 font-display text-[26px] font-extrabold leading-tight tracking-[-0.03em]"
        >
          {rank}-rank missions
        </h2>
        <span className="text-[13.5px] font-semibold text-[var(--coach-ink-muted)]">{missions.length} done</span>
      </div>
      <div className="flex w-full flex-col gap-2 border-t border-[var(--coach-divider)] pt-4 text-left">
        <h3 className="m-0 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">What counts</h3>
        <p className="m-0 text-[14.5px] leading-relaxed">{TASK_RANKS[rank]}.</p>
        <h3 className="m-0 mt-3 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">
          Your {rank}-rank missions
        </h3>
        {missions.length > 0 ? (
          <MissionList key={rank} missions={missions} />
        ) : (
          <p className="m-0 text-[14px] text-[var(--coach-ink-secondary)]">None yet.</p>
        )}
      </div>
    </section>
  );
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function joinAnd(parts: string[]): string {
  return parts.length <= 1 ? (parts[0] ?? "") : `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`;
}

/** Rule texts start with one of these verbs; the citation reads them as reasons. */
const GERUND: Record<string, string> = {
  Finish: "finishing",
  Link: "linking",
  Hold: "holding",
  Get: "getting",
  Practice: "practicing",
  Come: "coming",
  Earn: "earning",
  Become: "becoming",
  Complete: "completing",
};

/** "Awarded to … on … for …": the badge's own rule, read back as the reason. */
function citation(badge: BadgeView, name: string): string {
  const reasons = badge.criteria.map((c) => {
    // A citation names what happened, not where to click: drop "on your profile", say "the" for "your".
    const [verb, ...rest] = c.text
      .replace(/ on your profile$/, "")
      .replace(/\byour\b/g, "the")
      .split(" ");
    return GERUND[verb] ? `${GERUND[verb]} ${rest.join(" ")}` : lowerFirst(c.text);
  });
  return `Awarded to ${name} on ${badge.earnedLabel} for ${joinAnd(reasons)}.`;
}

function Citation({
  badge,
  name,
  isNew,
  glyphOf,
  onSelect,
}: {
  badge: BadgeView;
  name: string;
  isNew: boolean;
  glyphOf: (id: string) => string;
  onSelect: (id: string) => void;
}) {
  return (
    <section
      aria-live="polite"
      aria-labelledby="citation-title"
      className="flex min-w-0 flex-col items-center gap-4 rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-6 text-center sm:p-7"
    >
      {badge.insignia ? (
        <span className="flex items-center justify-center rounded-2xl bg-[var(--coach-hero-bg)] px-8 py-6">
          {badge.insignia.kind === "crest" ? (
            <CrestPatch crest={badge.insignia.crest} earned={badge.earned} size="lg" />
          ) : (
            <Headband earned={badge.earned} size="lg" />
          )}
        </span>
      ) : (
        <Medal id={badge.id} group={badge.group} glyph={badge.glyph} earned={badge.earned} />
      )}
      <div className="flex flex-col items-center gap-1">
        <h2
          id="citation-title"
          className="m-0 font-display text-[26px] font-extrabold leading-tight tracking-[-0.03em]"
        >
          {badge.label}
        </h2>
        <span
          className={`text-[13.5px] font-semibold ${badge.earned ? "text-[var(--coach-tint-lime-ink)]" : "text-[var(--coach-ink-muted)]"}`}
        >
          {badge.earned ? `Awarded ${badge.earnedLabel}` : "Not yet awarded"}
          {isNew ? (
            <span className="ml-2 rounded-full bg-[var(--coach-lime)] px-2 py-0.5 text-[11.5px] font-bold text-[var(--coach-lime-ink)]">
              Newly awarded
            </span>
          ) : null}
        </span>
      </div>

      {badge.earned ? (
        <div className="flex w-full flex-col gap-2 border-t border-[var(--coach-divider)] pt-4 text-left">
          <h3 className="m-0 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">Citation</h3>
          <p className="m-0 text-[14.5px] leading-relaxed [text-wrap:pretty]">{citation(badge, name)}</p>
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
          <Link
            href="/profile"
            className="w-fit text-[13px] font-semibold text-[var(--coach-ink)] underline underline-offset-2"
          >
            See it on your profile
          </Link>
          {badge.missions.length > 0 ? (
            <>
              <h3 className="m-0 mt-3 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">Missions behind it</h3>
              <MissionList key={badge.id} missions={badge.missions} />
            </>
          ) : null}
          {badge.missions.length === 0 || badge.criteria.some((c) => c.badgeId) ? (
            <>
              <h3 className="m-0 mt-3 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">How it was earned</h3>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {badge.criteria.map((c) => (
                  <CriterionRow
                    key={c.text}
                    c={c}
                    partGlyph={c.badgeId ? glyphOf(c.badgeId) : null}
                    onSelectPart={onSelect}
                  />
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3 border-t border-[var(--coach-divider)] pt-4 text-left">
          <h3 className="m-0 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">
            {badge.criteria.length > 1 ? "How to earn it: meet all of these" : "How to earn it"}
          </h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {badge.criteria.map((c) => (
              <CriterionRow
                key={c.text}
                c={c}
                partGlyph={c.badgeId ? glyphOf(c.badgeId) : null}
                onSelectPart={onSelect}
              />
            ))}
          </ul>
          {badge.missions.length > 0 ? (
            <>
              <h3 className="m-0 mt-3 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">Missions so far</h3>
              <MissionList key={badge.id} missions={badge.missions} />
            </>
          ) : null}
          {badge.action ? (
            <Link
              href={badge.action.href}
              className="mt-1 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--coach-lime)] px-5 text-[14px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_3px_0_var(--coach-lime-shadow)]"
            >
              {badge.action.label}
            </Link>
          ) : null}
        </div>
      )}
    </section>
  );
}

type Select = (id: string) => void;

/** Collar, centre seam and buttons: drawn lines only, so the decorations stay the subject. */
function UniformLines() {
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[110px] w-full sm:block"
      >
        <g fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
          <path d="M78 0 L100 52 L122 0" vectorEffect="non-scaling-stroke" />
          <path d="M58 0 L86 46" vectorEffect="non-scaling-stroke" />
          <path d="M142 0 L114 46" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 top-[94px] hidden w-px bg-white/[0.08] sm:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-1/2 top-[124px] hidden -translate-x-1/2 flex-col items-center justify-around sm:flex"
      >
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2.5 rounded-full bg-white/[0.14] ring-1 ring-white/10" />
        ))}
      </span>
    </>
  );
}

function PocketFlap() {
  return (
    <span
      aria-hidden="true"
      className="relative block h-10 rounded-b-[16px] border border-t-0 border-white/[0.08] bg-white/[0.02]"
    >
      <span className="absolute bottom-2 left-1/2 size-2 -translate-x-1/2 rounded-full bg-white/[0.14]" />
    </span>
  );
}

function Rack({
  worn,
  selectedId,
  isNew,
  onSelect,
}: {
  worn: BadgeView[];
  selectedId: string;
  isNew: (id: string) => boolean;
  onSelect: Select;
}) {
  let pin = 0;
  return (
    <ol
      aria-label="Decorations, highest first"
      className="relative m-0 flex list-none flex-col items-center gap-1.5 p-0"
    >
      {rackRows(worn).map((row, r) => (
        <li key={r}>
          <ol className="m-0 flex list-none justify-center gap-1.5 p-0">
            {row.map((badge) => (
              <li key={badge.id} className="achv-pin" style={{ ["--pin-delay" as string]: `${pin++ * PIN_STEP_MS}ms` }}>
                <button
                  type="button"
                  aria-pressed={selectedId === badge.id}
                  aria-label={`${badge.label}, awarded ${badge.earnedLabel}${isNew(badge.id) ? ", new" : ""}`}
                  title={`${badge.label}: ${badge.criteria.map((c) => c.text).join("; ")}`}
                  onClick={() => onSelect(badge.id)}
                  className={`relative block rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coach-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--coach-hero-bg)] ${
                    selectedId === badge.id
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--coach-hero-bg)]"
                      : isNew(badge.id)
                        ? "shadow-[0_0_0_2px_var(--coach-lime),0_0_14px_var(--coach-lime)]"
                        : ""
                  }`}
                >
                  <Ribbon id={badge.id} group={badge.group} glyph={badge.glyph} />
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}

/** The headband or a clan crest, selectable like a ribbon to read its citation. */
function InsigniaButton({
  badge,
  selected,
  isNew = false,
  onSelect,
  className = "",
  children,
}: {
  badge: BadgeView;
  selected: boolean;
  isNew?: boolean;
  onSelect: Select;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={badge.earned ? `${badge.label}, awarded ${badge.earnedLabel}` : `${badge.label}, not yet earned`}
      title={`${badge.label}: ${badge.criteria.map((c) => c.text).join("; ")}`}
      onClick={() => onSelect(badge.id)}
      className={`rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coach-lime)] ${
        selected
          ? "bg-white/10"
          : isNew
            ? "shadow-[0_0_0_2px_var(--coach-lime),0_0_16px_var(--coach-lime)]"
            : "hover:bg-white/5"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/** Missions done, one seal per rank: select a seal to see every mission of that rank. */
function RankSeals({
  model,
  selectedId,
  onSelect,
}: {
  model: AchievementsModel;
  selectedId: string;
  onSelect: Select;
}) {
  return (
    <div className="relative flex flex-col items-center gap-2.5 border-t border-white/[0.08] pt-4">
      <h3 className="m-0 text-[12.5px] font-semibold text-[var(--coach-hero-muted)]">Missions done</h3>
      <ul aria-label="Missions by rank" className="m-0 flex list-none gap-2 p-0 sm:gap-3">
        {MISSION_RANKS.map((rank) => {
          const count = model.missionRecord[rank];
          const selected = selectedId === rankKey(rank);
          return (
            <li key={rank}>
              <button
                type="button"
                aria-pressed={selected}
                aria-label={`${rank}-rank: ${count} ${count === 1 ? "mission" : "missions"}`}
                onClick={() => onSelect(rankKey(rank))}
                className={`flex w-[54px] flex-col items-center gap-0.5 rounded-xl border-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coach-lime)] sm:w-[64px] ${
                  selected ? "border-white bg-white/10" : "border-white/[0.12] hover:border-white/30"
                } ${count === 0 ? "opacity-45" : ""}`}
              >
                <span
                  className={`font-display text-[24px] font-extrabold leading-none sm:text-[28px] ${
                    rank === "S" ? "text-[var(--coach-lime)]" : "text-[var(--coach-hero-ink)]"
                  }`}
                >
                  {rank}
                </span>
                <span className="font-mono text-[12px] text-[var(--coach-hero-muted)]">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** A dress uniform: ribbons over the left breast pocket, the nameplate over the right. */
function Uniform({
  model,
  worn,
  firstToEarn,
  name,
  title,
  selectedId,
  isNew,
  onSelect,
}: {
  model: AchievementsModel;
  worn: BadgeView[];
  firstToEarn: BadgeView | undefined;
  name: string;
  title: string | null;
  selectedId: string;
  isNew: (id: string) => boolean;
  onSelect: Select;
}) {
  const headband = model.insignia.find((p) => p.insignia?.kind === "headband")!;
  const crests = CREST_IDS.map((id) => model.insignia.find((p) => p.id === id)!);
  return (
    <section
      aria-labelledby="chest-title"
      className="relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-[24px] bg-[var(--coach-hero-bg)] px-5 pb-5 text-[var(--coach-hero-ink)] sm:px-8"
    >
      <h2 id="chest-title" className="sr-only">
        Decorations worn
      </h2>

      <InsigniaButton
        badge={headband}
        selected={selectedId === headband.id}
        isNew={isNew(headband.id)}
        onSelect={onSelect}
        className="relative mx-auto mt-5"
      >
        <Headband earned={headband.earned} />
      </InsigniaButton>

      {/* The jacket: decorations high on the chest under the collar; the seam runs on down. */}
      <div className="relative flex flex-1 flex-col gap-3 pb-8 pt-8 sm:min-h-[340px] sm:pt-[112px]">
        <UniformLines />
        {/* Clan crests: two on each shoulder; a row under the headband on phones. */}
        <div className="relative flex justify-center gap-2 sm:absolute sm:inset-x-0 sm:top-3 sm:justify-between">
          {[crests.slice(0, 2), crests.slice(2)].map((pair, i) => (
            <div key={i} className="flex gap-2">
              {pair.map((crest) => (
                <InsigniaButton
                  key={crest.id}
                  badge={crest}
                  selected={selectedId === crest.id}
                  isNew={isNew(crest.id)}
                  onSelect={onSelect}
                >
                  <CrestPatch
                    crest={crest.insignia!.kind === "crest" ? crest.insignia!.crest : "gate"}
                    earned={crest.earned}
                  />
                </InsigniaButton>
              ))}
            </div>
          ))}
        </div>
        {/* Viewer's left: nameplate. Viewer's right: the rack, as worn on the wearer's left breast. */}
        <div className="relative grid grid-cols-1 items-end gap-6 sm:grid-cols-2 sm:gap-x-14">
          <div className="order-2 flex justify-center sm:order-1">
            <div className="rounded-[5px] bg-[linear-gradient(180deg,#f3f1ea,#cfccc2)] px-5 py-1.5 shadow-[0_2px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.7)]">
              <span className="whitespace-nowrap font-mono text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#1b1d22]">
                {title ? <span className="text-[#5a6b16]">{title} · </span> : null}
                {name}
              </span>
            </div>
          </div>
          <div className="order-1 flex justify-center sm:order-2">
            {worn.length > 0 ? (
              <Rack worn={worn} selectedId={selectedId} isNew={isNew} onSelect={onSelect} />
            ) : (
              <p className="m-0 max-w-[280px] rounded-xl border-2 border-dashed border-[var(--coach-hero-track)] px-5 py-4 text-center text-[14px] text-[var(--coach-hero-muted)]">
                No decorations yet. Your first is {firstToEarn?.label ?? "waiting"}:{" "}
                {lowerFirst(firstToEarn?.criteria[0]?.text ?? "")}.
              </p>
            )}
          </div>
        </div>
        <div aria-hidden="true" className="relative hidden grid-cols-2 gap-x-14 sm:grid">
          <span className="mx-auto w-full max-w-[240px]">
            <PocketFlap />
          </span>
          <span className="mx-auto w-full max-w-[240px]">
            <PocketFlap />
          </span>
        </div>
      </div>

      <RankSeals model={model} selectedId={selectedId} onSelect={onSelect} />
    </section>
  );
}

function NextUpCard({
  badge,
  selected,
  showAction,
  glyphOf,
  onSelect,
}: {
  badge: BadgeView;
  selected: boolean;
  /** False when an earlier card already offers the same next step. */
  showAction: boolean;
  glyphOf: (id: string) => string;
  onSelect: Select;
}) {
  const met = badge.criteria.filter((c) => c.done).length;
  return (
    <li
      className={`flex h-full min-w-0 flex-col gap-3 rounded-2xl border-2 bg-[var(--coach-surface)] p-4 ${
        selected ? "border-[var(--coach-blue)]" : "border-[var(--coach-border)]"
      }`}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(badge.id)}
        className="flex min-w-0 items-center gap-3 rounded-lg text-left hover:underline"
      >
        <BadgeMark badge={badge} />
        <span className="min-w-0 flex-1 text-[15px] font-semibold">{badge.label}</span>
        {badge.criteria.length > 1 ? (
          <span className="shrink-0 text-[12px] text-[var(--coach-ink-muted)]">
            {met} of {badge.criteria.length} met
          </span>
        ) : null}
      </button>
      <ul aria-label="How to earn it" className="m-0 flex list-none flex-col gap-2.5 p-0">
        {badge.criteria.map((c) => (
          <CriterionRow key={c.text} c={c} partGlyph={c.badgeId ? glyphOf(c.badgeId) : null} onSelectPart={onSelect} />
        ))}
      </ul>
      {badge.action && showAction ? (
        <Link
          href={badge.action.href}
          className="mt-auto inline-flex h-9 w-fit items-center rounded-lg bg-[var(--coach-solid-btn-bg)] px-3.5 text-[13px] font-bold text-[var(--coach-solid-btn-ink)] no-underline shadow-[0_2px_0_var(--coach-solid-btn-shadow)]"
        >
          {badge.action.label}
        </Link>
      ) : null}
    </li>
  );
}

/** A badge's whole rule as one sentence; a combination names its parts once: "Earn A, B and C". */
function ruleSentence(badge: BadgeView): string {
  const parts = badge.criteria.filter((c) => c.badgeId).map((c) => c.text.replace(/^Earn /, ""));
  const others = badge.criteria.filter((c) => !c.badgeId).map((c) => c.text);
  const clauses = [...others, ...(parts.length ? [`earn ${joinAnd(parts)}`] : [])];
  return joinAnd(clauses.map((c, i) => (i === 0 ? c.charAt(0).toUpperCase() + c.slice(1) : lowerFirst(c))));
}

/** One line per remaining decoration: its rule in a sentence and where you stand. */
function RestRow({ badge, selected, onSelect }: { badge: BadgeView; selected: boolean; onSelect: Select }) {
  const open = badge.criteria.filter((c) => !c.done);
  const counted = open.find((c) => c.progress);
  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(badge.id)}
        className={`grid w-full min-w-0 grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 rounded-xl border-2 px-3 py-2.5 text-left ${
          selected
            ? "border-[var(--coach-blue)] bg-[var(--coach-surface)]"
            : "border-transparent hover:bg-[var(--coach-surface)]"
        }`}
      >
        <BadgeMark badge={badge} />
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-[14.5px] font-semibold">{badge.label}</span>
          <span className="block text-[13px] leading-snug text-[var(--coach-ink-secondary)]">
            {ruleSentence(badge)}
          </span>
        </span>
        <span className="text-right text-[12.5px] text-[var(--coach-ink-muted)]">
          {counted?.progress
            ? `${counted.progress.done} of ${counted.progress.total}`
            : badge.criteria.length > 1
              ? `${badge.criteria.length - open.length} of ${badge.criteria.length} met`
              : "Not started"}
        </span>
      </button>
    </li>
  );
}

/** The closest few in full, the rest one line each, grouped by kind. */
function StillToEarn({
  toEarn,
  selectedId,
  glyphOf,
  onSelect,
}: {
  toEarn: BadgeView[];
  selectedId: string;
  glyphOf: (id: string) => string;
  onSelect: Select;
}) {
  const nextUp = toEarn.slice(0, NEXT_UP);
  const rest = toEarn.slice(NEXT_UP);
  return (
    <section aria-labelledby="to-earn-title" className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 id="to-earn-title" className="m-0 font-display text-[22px] font-extrabold tracking-[-0.02em]">
          Still to earn
        </h2>
        <p className="m-0 max-w-[640px] text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">
          Every decoration has its own rule. The closest ones first, with exactly what is left; select any other to see
          its full rule.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="m-0 text-[15px] font-semibold">Next up</h3>
        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3">
          {nextUp.map((badge, i) => (
            <NextUpCard
              key={badge.id}
              badge={badge}
              selected={selectedId === badge.id}
              showAction={!nextUp.slice(0, i).some((b) => b.action?.href === badge.action?.href)}
              glyphOf={glyphOf}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </div>

      {rest.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="m-0 text-[15px] font-semibold">Everything else</h3>
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            {PRECEDENCE.map((group) => {
              const badges = rest.filter((b) => b.group === group);
              if (badges.length === 0) return null;
              return (
                <div key={group} className="flex min-w-0 flex-col gap-1">
                  <h3 className="m-0 flex items-center gap-2 px-3 text-[13px] font-semibold text-[var(--coach-ink-muted)]">
                    <span
                      aria-hidden="true"
                      className="h-2 w-5 rounded-[2px]"
                      style={{ background: groupSwatch(group) }}
                    />
                    {GROUP_TITLES[group]}
                  </h3>
                  <ul className="m-0 flex list-none flex-col p-0">
                    {badges.map((badge) => (
                      <RestRow key={badge.id} badge={badge} selected={selectedId === badge.id} onSelect={onSelect} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

const NEXT_UP = 3;

/** Shown once when a new title is earned: the promotion moment. */
function Promotion({ title, onRead, onDone }: { title: BadgeView; onRead: () => void; onDone: () => void }) {
  const meta = TITLE_META[title.id];
  return (
    <section
      aria-labelledby="promotion-title"
      className="relative flex min-w-0 flex-col items-start gap-4 overflow-hidden rounded-[24px] bg-[var(--coach-hero-bg)] p-6 text-[var(--coach-hero-ink)] ring-2 ring-[var(--coach-lime)] sm:flex-row sm:items-center sm:p-7"
    >
      <span
        aria-hidden="true"
        className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--coach-lime)] font-display text-[40px] text-[var(--coach-lime-ink)]"
      >
        {meta.kanji.charAt(0)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[13px] font-semibold text-[var(--coach-lime)]">Promoted</span>
        <h2
          id="promotion-title"
          className="m-0 font-display text-[30px] font-extrabold leading-tight tracking-[-0.03em]"
        >
          You are now {title.label}
        </h2>
        <p className="m-0 text-[14.5px] text-[var(--coach-hero-muted)]">
          {meta.kanji}, {meta.gloss}. Earned {title.earnedLabel}.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRead}
          className="inline-flex h-10 items-center rounded-xl bg-[var(--coach-lime)] px-4 text-[13.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)]"
        >
          Read the citation
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex h-10 items-center rounded-xl bg-white/10 px-4 text-[13.5px] font-semibold text-[var(--coach-hero-ink)] hover:bg-white/15"
        >
          Done
        </button>
      </div>
    </section>
  );
}

/** Your title and the path of titles: each one earned by a combination of missions, never taken away. */
function TitleSection({
  model,
  glyphOf,
  onSelect,
}: {
  model: AchievementsModel;
  glyphOf: (id: string) => string;
  onSelect: Select;
}) {
  const { title, nextTitle, titles } = model;
  const current = title ? TITLE_META[title.id] : null;
  return (
    <section
      aria-labelledby="title-heading"
      className="grid min-w-0 grid-cols-1 gap-6 rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:p-8"
    >
      <div className="flex min-w-0 flex-col gap-4">
        <h2 id="title-heading" className="m-0 text-[13px] font-semibold text-[var(--coach-ink-muted)]">
          Your title
        </h2>
        {title && current ? (
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--coach-hero-bg)] text-[28px] text-[var(--coach-lime)]"
            >
              {current.kanji.charAt(0)}
            </span>
            <div className="flex flex-col">
              <span className="font-display text-[34px] font-extrabold leading-none tracking-[-0.03em]">
                {title.label}
              </span>
              <span className="text-[14px] text-[var(--coach-ink-secondary)]">
                {current.kanji}, {current.gloss}. Since {title.earnedLabel}.
              </span>
            </div>
          </div>
        ) : (
          <p className="m-0 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
            No title yet. Earn your headband to become <strong className="text-[var(--coach-ink)]">Genin</strong>.
          </p>
        )}
        <ol aria-label="Titles" className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
          {titles.map((t, i) => (
            <li key={t.id} className="flex items-center gap-1.5">
              {i > 0 ? (
                <span
                  aria-hidden="true"
                  className={`h-0.5 w-3 ${t.earned ? "bg-[var(--coach-lime-shadow)]" : "bg-[var(--coach-border)]"}`}
                />
              ) : null}
              <span
                className={`rounded-full px-2.5 py-1 text-[12.5px] font-semibold ${
                  t.earned
                    ? "bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]"
                    : t.id === nextTitle?.id
                      ? "border-2 border-[var(--coach-blue)] text-[var(--coach-ink)]"
                      : "border-2 border-dashed border-[var(--coach-border-strong)] text-[var(--coach-ink-muted)]"
                }`}
              >
                {t.label}
              </span>
            </li>
          ))}
        </ol>
        <p className="m-0 text-[13px] leading-relaxed text-[var(--coach-ink-muted)]">
          Titles are earned by completing ranked tasks, kept for good, and never lock anything.
        </p>
        <div className="flex flex-col gap-2 border-t border-[var(--coach-divider)] pt-4">
          <h3 className="m-0 text-[13px] font-semibold text-[var(--coach-ink-muted)]">What each task rank means</h3>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {[...MISSION_RANKS].reverse().map((rank) => (
              <li
                key={rank}
                className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--coach-ink-secondary)]"
              >
                <RankChip rank={rank} />
                <span className="min-w-0 flex-1">{TASK_RANKS[rank]}</span>
                <span className="shrink-0 font-mono text-[12px] text-[var(--coach-ink-muted)]">
                  {model.missionRecord[rank]} done
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {nextTitle ? (
        <div className="flex min-w-0 flex-col gap-3 md:border-l md:border-[var(--coach-divider)] md:pl-6">
          <h3 className="m-0 text-[13px] font-semibold text-[var(--coach-ink-muted)]">
            Next title: <span className="text-[var(--coach-ink)]">{nextTitle.label}</span> (
            {TITLE_META[nextTitle.id].gloss}).{" "}
            {nextTitle.criteria.length > 1 ? "Earn it by meeting all of these" : "Earn it by"}
          </h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {nextTitle.criteria.map((c) => (
              <CriterionRow
                key={c.text}
                c={c}
                partGlyph={c.badgeId ? glyphOf(c.badgeId) : null}
                onSelectPart={onSelect}
              />
            ))}
          </ul>
          {nextTitle.action ? (
            <Link
              href={nextTitle.action.href}
              className="mt-1 inline-flex h-10 w-fit items-center rounded-xl bg-[var(--coach-lime)] px-4 text-[13.5px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_3px_0_var(--coach-lime-shadow)]"
            >
              {nextTitle.action.label}
            </Link>
          ) : null}
        </div>
      ) : (
        <p className="m-0 self-center text-[15px] text-[var(--coach-ink-secondary)]">
          Every title earned. You are Ascended.
        </p>
      )}
    </section>
  );
}

/** The learner's decorations worn on a uniform, with a citation for each, and the ones still to earn. */
export function Chest({ model, name }: { model: AchievementsModel; name: string }) {
  const worn = byPrecedence(model.parts.filter((p) => p.earned));
  const everything = [...model.parts, ...model.insignia, ...model.titles];
  const toEarn = [...model.parts.filter((p) => !p.earned)].sort(
    (a, b) => b.ratio - a.ratio || model.parts.indexOf(a) - model.parts.indexOf(b),
  );
  const earnedInsignia = model.insignia.filter((p) => p.earned);
  const earnedTitles = model.titles.filter((t) => t.earned);
  const seen = useSeenDecorations([...worn, ...earnedInsignia, ...earnedTitles].map((b) => b.id));
  const firstNew = [...earnedInsignia, ...worn].find((b) => seen.isNew(b.id));
  const promoted = model.title && seen.isNew(model.title.id) ? model.title : null;
  const [chosenId, setChosenId] = useState<string | null>(null);
  // A newly awarded decoration opens first until the learner picks something else.
  const selectedId = chosenId ?? firstNew?.id ?? worn[0]?.id ?? toEarn[0]?.id ?? model.parts[0].id;
  const selected = everything.find((p) => p.id === selectedId) ?? model.parts[0];
  const glyphOf = (id: string) => everything.find((p) => p.id === id)?.glyph ?? "•";
  const select: Select = (id) => {
    setChosenId(id);
    seen.markSeen(id);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      document.getElementById("citation-title")?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-10">
      {promoted ? (
        <Promotion title={promoted} onRead={() => select(promoted.id)} onDone={() => seen.markSeen(promoted.id)} />
      ) : null}
      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <Uniform
          model={model}
          worn={worn}
          firstToEarn={toEarn[0]}
          name={name}
          title={model.title?.label ?? null}
          selectedId={selectedId}
          isNew={seen.isNew}
          onSelect={select}
        />
        {selectedId.startsWith("rank:") ? (
          <RankDetail rank={selectedId.slice(5) as MissionRank} model={model} />
        ) : (
          <Citation badge={selected} name={name} isNew={seen.isNew(selected.id)} glyphOf={glyphOf} onSelect={select} />
        )}
      </div>

      <TitleSection model={model} glyphOf={glyphOf} onSelect={select} />

      {toEarn.length > 0 ? (
        <StillToEarn toEarn={toEarn} selectedId={selectedId} glyphOf={glyphOf} onSelect={select} />
      ) : null}

      <MissionLog model={model} />
    </div>
  );
}
