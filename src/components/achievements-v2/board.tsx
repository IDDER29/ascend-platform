"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { AchievementPart, AchievementsModel, BoardColumn } from "@/lib/achievements/achievements-model";

/** Badges already seen in their earned state, so a new one is marked once. Per browser. */
const SEEN_KEY = "ascend:achievements-seen";
const SEEN_EVENT = "ascend:achievements-seen";
const TRACE_STEP_MS = 180;

function subscribeSeen(onChange: () => void) {
  window.addEventListener(SEEN_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SEEN_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readSeen(): string | null {
  try {
    return window.localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
}

function writeSeen(ids: string[]) {
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(SEEN_EVENT));
  } catch {
    // Storage can be blocked; nothing is marked new then.
  }
}

function parseSeen(raw: string | null): Set<string> | null {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

const LINE = "bg-[var(--coach-hero-track)]";
const LIT = "bg-[var(--coach-lime)]";

type PartProps = {
  part: AchievementPart;
  selected: boolean;
  isNew: boolean;
  onSelect: (id: string) => void;
};

function partState(part: AchievementPart) {
  return part.earned ? "earned" : part.progress && part.progress.done > 0 ? "progress" : "empty";
}

/** Shared look: earned = placed and lit; in progress = blue outline; not yet = dashed footprint. */
function surface(part: AchievementPart, selected: boolean) {
  const state = partState(part);
  return [
    "relative flex items-center justify-center border-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coach-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--coach-hero-bg)]",
    state === "earned"
      ? "border-[var(--coach-lime)] bg-[color-mix(in_srgb,var(--coach-lime)_12%,var(--coach-hero-bg))] text-[var(--coach-hero-ink)]"
      : state === "progress"
        ? "border-[var(--coach-blue)] bg-[var(--coach-hero-bg)] text-[var(--coach-hero-ink)]"
        : "border-dashed border-[var(--coach-hero-track)] bg-[var(--coach-hero-bg)] text-[var(--coach-hero-muted)] hover:border-[var(--coach-hero-muted)]",
    selected ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--coach-hero-bg)]" : "",
  ].join(" ");
}

function Led({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute right-1.5 top-1.5 size-1.5 rounded-full ${on ? "bg-[var(--coach-lime)] shadow-[0_0_6px_var(--coach-lime)]" : "bg-[var(--coach-hero-track)]"}`}
    />
  );
}

function NewTag({ show }: { show: boolean }) {
  return show ? (
    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[var(--coach-lime)] px-1.5 text-[10px] font-bold text-[var(--coach-lime-ink)]">
      new
    </span>
  ) : null;
}

function Silk({ part }: { part: AchievementPart }) {
  const text = part.earned
    ? part.earnedLabel
    : part.progress && part.progress.total > 1
      ? `${part.progress.done}/${part.progress.total}`
      : null;
  return text ? <span className="font-mono text-[10.5px] text-[var(--coach-hero-muted)]">{text}</span> : null;
}

function accessibleName(part: AchievementPart): string {
  return part.earned ? `${part.label}, earned ${part.earnedLabel}` : `${part.label}, not earned yet: ${part.how}`;
}

/** Level badges are chips: a wide body with pin marks along the top and bottom edges. */
function ChipPart({ part, selected, isNew, onSelect }: PartProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-pressed={selected}
        aria-label={accessibleName(part)}
        onClick={() => onSelect(part.id)}
        className={`${surface(part, selected)} h-14 w-[120px] gap-1.5 rounded-md px-2 text-[12.5px] font-semibold md:w-full md:max-w-[150px]`}
      >
        <span aria-hidden="true" className="absolute inset-x-3 -top-[5px] h-[3px] bg-[repeating-linear-gradient(90deg,currentColor_0_3px,transparent_3px_9px)] opacity-60" />
        <span aria-hidden="true" className="absolute inset-x-3 -bottom-[5px] h-[3px] bg-[repeating-linear-gradient(90deg,currentColor_0_3px,transparent_3px_9px)] opacity-60" />
        <span aria-hidden="true" className={part.earned ? "text-[var(--coach-lime)]" : ""}>
          {part.glyph}
        </span>
        <span className="truncate">{part.label}</span>
        <Led on={part.earned} />
        <NewTag show={isNew} />
      </button>
      <Silk part={part} />
    </div>
  );
}

/** Project badges are larger square modules. */
function ModulePart({ part, selected, isNew, onSelect }: PartProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-pressed={selected}
        aria-label={accessibleName(part)}
        onClick={() => onSelect(part.id)}
        className={`${surface(part, selected)} h-[72px] w-[104px] flex-col gap-1 rounded-lg px-2 text-[12px] font-semibold`}
      >
        <span aria-hidden="true" className={`text-[18px] leading-none ${part.earned ? "text-[var(--coach-lime)]" : ""}`}>
          {part.glyph}
        </span>
        <span className="leading-tight">{part.label}</span>
        <Led on={part.earned} />
        <NewTag show={isNew} />
      </button>
      <Silk part={part} />
    </div>
  );
}

/** Memory badges are small round parts. */
function RoundPart({ part, selected, isNew, onSelect }: PartProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-pressed={selected}
        aria-label={accessibleName(part)}
        onClick={() => onSelect(part.id)}
        className={`${surface(part, selected)} size-11 rounded-full text-[15px]`}
      >
        <span aria-hidden="true" className={part.earned ? "text-[var(--coach-lime)]" : ""}>
          {part.glyph}
        </span>
        <NewTag show={isNew} />
      </button>
      <span className="max-w-[96px] text-center text-[11px] leading-tight text-[var(--coach-hero-muted)]">{part.label}</span>
    </div>
  );
}

/** Habit badges are pills on a side rail, not wired into the path. */
function PillPart({ part, selected, isNew, onSelect }: PartProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={accessibleName(part)}
      onClick={() => onSelect(part.id)}
      className={`${surface(part, selected)} h-9 gap-2 rounded-full px-3.5 text-[12.5px] font-semibold`}
    >
      <span aria-hidden="true" className={part.earned ? "text-[var(--coach-lime)]" : ""}>
        {part.glyph}
      </span>
      {part.label}
      {part.earned ? <span className="font-mono text-[10.5px] font-normal text-[var(--coach-hero-muted)]">{part.earnedLabel}</span> : null}
      <NewTag show={isNew} />
    </button>
  );
}

/** A stub joining a part to the main line: vertical on wide screens, horizontal when the board stands upright. */
function Stub({ lit }: { lit: boolean }) {
  return <span aria-hidden="true" className={`shrink-0 grow self-center max-md:h-[3px] max-md:min-w-4 md:min-h-4 md:w-[3px] ${lit ? LIT : LINE}`} />;
}

function Details({ part }: { part: AchievementPart }) {
  return (
    <div aria-live="polite" className="flex flex-col gap-3 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden="true"
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-[20px] ${
            part.earned ? "bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]" : "border-2 border-dashed border-[var(--coach-border-strong)] text-[var(--coach-ink-muted)]"
          }`}
        >
          {part.glyph}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="m-0 text-[17px] font-semibold">{part.label}</h3>
          <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">
            {part.earned ? `${part.means}. Earned ${part.earnedLabel}.` : `${part.how}.`}
            {!part.earned && part.distance ? ` You're ${part.distance}.` : ""}
          </p>
          {part.group === "memory" && part.earned ? (
            <p className="m-0 text-[13px] text-[var(--coach-ink-muted)]">
              It stays while those cards stay solid. A card that slips back to learning puts it on hold until you review it.
            </p>
          ) : null}
          {part.repoUrl ? (
            <a
              href={part.repoUrl}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
              className="flex min-w-0 items-center gap-1.5 text-[13px] text-[var(--coach-blue)] no-underline hover:underline"
            >
              <ExternalLink size={13} aria-hidden="true" className="shrink-0" />
              <span className="truncate font-mono">{part.repoLabel}</span>
            </a>
          ) : null}
        </div>
      </div>
      {part.action ? (
        <Link
          href={part.action.href}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-solid-btn-bg)] px-4 text-[13.5px] font-bold text-[var(--coach-solid-btn-ink)] no-underline shadow-[0_3px_0_var(--coach-solid-btn-shadow)]"
        >
          {part.action.label}
        </Link>
      ) : null}
    </div>
  );
}

/** The learner's badges as parts on a circuit board, wired in curriculum order. */
export function AchievementsBoard({ model }: { model: AchievementsModel }) {
  const initial = model.earnedNewestFirst[0] ?? model.upNext[0]?.id ?? model.parts[0].id;
  const [selectedId, setSelectedId] = useState(initial);
  const rawSeen = useSyncExternalStore(subscribeSeen, readSeen, () => null);
  const seen = parseSeen(rawSeen);
  const earnedIds = model.parts.filter((p) => p.earned).map((p) => p.id);

  // First visit: everything already earned counts as seen, so nothing is "new" yet.
  useEffect(() => {
    if (readSeen() === null) writeSeen(earnedIds);
  }, [earnedIds]);

  function select(id: string) {
    setSelectedId(id);
    if (seen && !seen.has(id)) writeSeen([...seen, id]);
  }

  const isNew = (part: AchievementPart) => Boolean(seen && part.earned && !seen.has(part.id));
  const common = (part: AchievementPart): PartProps => ({ part, selected: part.id === selectedId, isNew: isNew(part), onSelect: select });
  const selected = model.parts.find((p) => p.id === selectedId) ?? model.parts[0];
  const lastIndex = model.columns.length - 1;

  return (
    <section aria-labelledby="board-title" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="board-title" className="m-0 font-display text-[22px] font-extrabold tracking-[-0.02em]">
          The board
        </h2>
        <p className="m-0 max-w-[600px] text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">
          Every badge has a spot on the board from day one. Earning it places the part and lights the path. Select a
          part to see what it means.
        </p>
      </div>

      <div className="rounded-[24px] bg-[var(--coach-hero-bg)] px-4 py-6 text-[var(--coach-hero-ink)] sm:px-6 md:py-8">
        <div className="flex flex-col-reverse md:flex-row md:items-stretch">
          {/* Upright on phones: Level 00 at the bottom, like the profile's stack. */}
          <ol aria-label="Levels" className="m-0 flex min-w-0 flex-1 list-none flex-col-reverse p-0 md:grid md:grid-cols-4">
            {model.columns.map((column, i) => (
              <ColumnWithParts
                key={column.levelNumber}
                column={column}
                index={i}
                lit={i <= model.litThrough}
                first={i === 0}
                common={common}
              />
            ))}
          </ol>
          {/* Core Complete closes the main line: at the end on wide screens, on top when upright. */}
          <div className="relative flex items-center justify-center py-3 md:w-[120px] md:py-0">
            <span aria-hidden="true" className={`absolute max-md:inset-x-auto max-md:bottom-0 max-md:left-1/2 max-md:top-1/2 max-md:w-[3px] max-md:-translate-x-1/2 md:left-0 md:right-1/2 md:top-1/2 md:h-[3px] md:-translate-y-1/2 ${model.litThrough === lastIndex ? LIT : LINE}`} />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <button
                type="button"
                aria-pressed={selectedId === model.core.id}
                aria-label={accessibleName(model.core)}
                onClick={() => select(model.core.id)}
                className={`${surface(model.core, selectedId === model.core.id)} size-16 rounded-full text-[24px]`}
              >
                <span aria-hidden="true" className={model.core.earned ? "text-[var(--coach-lime)]" : ""}>
                  {model.core.glyph}
                </span>
                <NewTag show={isNew(model.core)} />
              </button>
              <span className="bg-[var(--coach-hero-bg)] px-1 text-[11.5px] font-semibold text-[var(--coach-hero-muted)]">{model.core.label}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
          <span className="font-mono text-[11px] text-[var(--coach-hero-muted)]">habits</span>
          {model.habits.map((part) => (
            <PillPart key={part.id} {...common(part)} />
          ))}
        </div>
      </div>

      <Details part={selected} />
    </section>
  );
}

function ColumnWithParts({
  column,
  index,
  lit,
  first,
  common,
}: {
  column: BoardColumn;
  index: number;
  lit: boolean;
  first: boolean;
  common: (part: AchievementPart) => PartProps;
}) {
  return (
    <li className="relative flex min-w-0 flex-row items-center py-3 md:flex-col md:items-stretch md:px-1 md:py-0">
      <span className="absolute left-0 top-1 font-mono text-[10.5px] text-[var(--coach-hero-muted)] max-md:hidden md:left-1/2 md:top-0 md:-translate-x-1/2 md:whitespace-nowrap">
        L{column.levelNumber} {column.levelName}
      </span>
      <span aria-hidden="true" className={`absolute max-md:inset-y-0 max-md:left-1/2 max-md:w-[3px] max-md:-translate-x-1/2 md:inset-x-0 md:top-1/2 md:h-[3px] md:-translate-y-1/2 ${LINE}`} />
      {lit ? (
        <span
          aria-hidden="true"
          style={{ ["--trace-delay" as string]: `${index * TRACE_STEP_MS}ms` }}
          className={`achv-trace-lit absolute max-md:inset-y-0 max-md:left-1/2 max-md:w-[3px] max-md:-translate-x-1/2 md:inset-x-0 md:top-1/2 md:h-[3px] md:-translate-y-1/2 ${LIT}`}
        />
      ) : null}
      {first ? (
        <span
          aria-hidden="true"
          className="absolute z-10 size-3 rounded-full bg-[var(--coach-lime)] max-md:-bottom-1.5 max-md:left-1/2 max-md:-translate-x-1/2 md:-left-1.5 md:top-1/2 md:-translate-y-1/2"
        />
      ) : null}

      <div className="relative z-10 flex flex-1 basis-0 flex-row items-center justify-end md:h-[132px] md:flex-none md:flex-col md:justify-end md:pt-6">
        <RoundPart {...common(column.memory)} />
        <Stub lit={column.memory.earned} />
      </div>

      <div className="relative z-10 flex shrink-0 justify-center px-2 md:h-[96px] md:items-center md:px-0">
        <ChipPart {...common(column.level)} />
      </div>

      <div className="relative z-10 flex flex-1 basis-0 flex-row items-center justify-start md:h-[132px] md:flex-none md:flex-col md:justify-start">
        {column.project ? (
          <>
            <Stub lit={column.project.earned} />
            <ModulePart {...common(column.project)} />
          </>
        ) : null}
      </div>
    </li>
  );
}
