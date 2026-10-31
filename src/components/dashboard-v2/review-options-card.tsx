"use client";

import Link from "next/link";
import { Activity, Bookmark, Layers, RotateCcw, Route, type LucideIcon } from "lucide-react";
import { PATH_ICONS } from "@/components/paths/path-catalog";
import type { ReviewIcon, ReviewOption } from "@/lib/dashboard/review-options";
import { setMemory, type DeckMemory } from "@/lib/practice/deck-memory";
import type { PracticeSessionRecord } from "@/lib/practice/history";

const CARD = "flex flex-col gap-3 rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5";
const ICONS: Record<Exclude<ReviewIcon, "path">, LucideIcon> = {
  misses: RotateCcw,
  shaky: Activity,
  deck: Layers,
  flagged: Bookmark,
};
/** About half a minute a card in a review. */
const SECONDS_PER_CARD = 30;
const SPARK_DAYS = 14;
const DAY_MS = 86_400_000;

const pct = (r: number) => `${Math.round(r * 100)}%`;

function ago(iso: string, now: number): string {
  const days = Math.floor((now - Date.parse(iso)) / DAY_MS);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

/** The set's memory since its last review (at least two weeks), ending on a dot at today. */
function Spark({ memory }: { memory: DeckMemory }) {
  const W = 120;
  const H = 30;
  // Back to the set's last review (the jump it gave), at least two weeks.
  const from = Math.min(-SPARK_DAYS, Math.floor(memory.lastReview?.day ?? -SPARK_DAYS) - 1, 0);
  const shownFrom = Math.max(memory.from, from);
  const points = memory.past.filter((p) => p.day >= shownFrom);
  // The right edge keeps room for the dashed rise a review today would give.
  const x = (day: number) => 2 + ((day - shownFrom) / (0 - shownFrom || 1)) * (W - 16);
  const y = (r: number) => 3 + (1 - r) * (H - 6);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.day).toFixed(1)},${y(p.recall).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[30px] w-[120px] shrink-0" aria-hidden>
      <line x1="0" x2={W} y1={y(0.9)} y2={y(0.9)} stroke="var(--coach-divider)" strokeWidth="1" strokeDasharray="2 2" />
      <path d={d} fill="none" stroke="var(--coach-chart-kept)" strokeWidth="2" strokeLinejoin="round" />
      {memory.reviewToday && memory.afterReview - memory.now > 0.005 && (
        <>
          <line
            x1={x(0)}
            x2={x(0) + 8}
            y1={y(memory.now)}
            y2={y(memory.afterReview)}
            stroke="var(--coach-chart-kept)"
            strokeWidth="2"
            strokeDasharray="2 2"
          />
          <circle
            cx={x(0) + 8}
            cy={y(memory.afterReview)}
            r="2.5"
            fill="var(--coach-surface)"
            stroke="var(--coach-chart-kept)"
            strokeWidth="1.5"
          />
        </>
      )}
      <circle
        cx={x(0)}
        cy={y(memory.now)}
        r="3"
        fill="var(--coach-ink)"
        stroke="var(--coach-surface)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function OptionIcon({ option }: { option: ReviewOption }) {
  const Icon = option.icon === "path" ? (PATH_ICONS[option.pathSlug ?? ""] ?? Route) : ICONS[option.icon];
  return (
    <span
      aria-hidden
      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]"
    >
      <Icon size={18} strokeWidth={2.2} />
    </span>
  );
}

function Row({
  option,
  history,
  now,
  latestAt,
}: {
  option: ReviewOption;
  history: PracticeSessionRecord[];
  now: Date;
  /** Your latest review session of all. */
  latestAt: number | null;
}) {
  const memory = setMemory(history, option.cardIds, now);
  const minutes = Math.max(1, Math.round((option.toDo * SECONDS_PER_CARD) / 60));
  const lift = memory && memory.reviewToday && memory.afterReview - memory.now > 0.005;

  // The date only when this set wasn't reviewed with everything else.
  const lastAt = memory?.lastReview ? Date.parse(memory.lastReview.at) : null;
  const differs = lastAt !== null && latestAt !== null && Math.abs(latestAt - lastAt) > DAY_MS;
  const facts = [
    option.toDo > 0 ? `${minutes} min` : null,
    differs && memory?.lastReview ? `last reviewed ${ago(memory.lastReview.at, now.getTime())}` : null,
  ].filter(Boolean);

  return (
    <li>
      <Link
        href={option.href}
        className="flex gap-3 rounded-2xl border-2 border-[var(--coach-border)] px-4 py-3 text-[var(--coach-ink)] no-underline transition-colors hover:border-[var(--coach-border-strong)]"
      >
        <OptionIcon option={option} />
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex items-start justify-between gap-3">
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold leading-snug">{option.title}</span>
              <span className="block text-[13px] leading-snug text-[var(--coach-ink-muted)]">{option.detail}</span>
            </span>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-semibold tabular-nums ${
                option.waiting
                  ? "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]"
                  : "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-muted)]"
              }`}
            >
              {option.badge}
            </span>
          </span>

          {(memory || facts.length > 0) && (
            <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] leading-snug text-[var(--coach-ink-secondary)]">
              {memory && (
                <>
                  <Spark memory={memory} />
                  <span>
                    <span className="font-semibold text-[var(--coach-ink)]">{pct(memory.now)}</span>
                    {lift ? (
                      <>
                        {" "}
                        → <span className="font-semibold text-[var(--coach-ink)]">{pct(memory.afterReview)}</span>
                      </>
                    ) : (
                      " · holding"
                    )}
                  </span>
                </>
              )}
              {facts.length > 0 && <span className="text-[var(--coach-ink-muted)]">{facts.join(" · ")}</span>}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}

/** The review options worth doing now: each with its icon, its own memory curve, and how much is waiting. */
export function ReviewOptionsCard({
  options,
  history,
}: {
  options: ReviewOption[] | null;
  history: PracticeSessionRecord[] | null;
}) {
  if (!options || !history) return <div className={`${CARD} min-h-[148px]`} aria-busy="true" />;
  const now = new Date();
  const times = history.map((s) => Date.parse(s.at)).filter((t) => !Number.isNaN(t));
  const latestAt = times.length > 0 ? Math.max(...times) : null;
  return (
    <section aria-labelledby="ways-title" className={CARD}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="ways-title" className="m-0 text-[16px] font-bold">
          Ways to review
        </h2>
        <span className="hidden text-[12.5px] text-[var(--coach-ink-muted)] sm:inline">
          Every one counts toward your goal
        </span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {options.map((o) => (
          <Row key={o.id} option={o} history={history} now={now} latestAt={latestAt} />
        ))}
      </ul>
    </section>
  );
}
