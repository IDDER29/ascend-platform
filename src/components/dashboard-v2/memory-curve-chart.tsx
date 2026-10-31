"use client";

import { useEffect, useRef, useState } from "react";
import type { DeckMemory, DeckPoint } from "@/lib/practice/deck-memory";

const H = 190;
const PAD = { top: 26, right: 40, bottom: 24, left: 36 };
const DAY_MS = 86_400_000;

const pct = (r: number) => `${Math.round(r * 100)}%`;

function valueAt(points: DeckPoint[], day: number): number | null {
  let best: DeckPoint | null = null;
  for (const p of points) if (p.day <= day + 1e-9) best = p;
  return best?.recall ?? null;
}

/**
 * Your whole deck's memory, like one card's page: what happened since your
 * reviews (solid), today, and what comes next if you review today (dashed blue,
 * jumping up) or skip (dashed orange).
 */
export function MemoryCurveChart({ memory }: { memory: DeckMemory }) {
  const [hover, setHover] = useState<number | null>(null);
  const [W, setW] = useState(420);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(260, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { from, to } = memory;
  const x = (day: number) => PAD.left + ((day - from) / (to - from)) * (W - PAD.left - PAD.right);
  const y = (r: number) => PAD.top + (1 - r) * (H - PAD.top - PAD.bottom);
  const path = (points: DeckPoint[]) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.day).toFixed(1)},${y(p.recall).toFixed(1)}`).join(" ");
  const dateOf = (day: number) =>
    new Date(Date.parse(memory.at) + day * DAY_MS).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // Date labels, dropping any that would crowd its neighbour on a narrow chart.
  const ticks = [
    ...(from < 0 ? [{ day: from, label: dateOf(from) }] : []),
    { day: 0, label: "Today" },
    { day: 7, label: "+1 wk" },
    { day: 14, label: "+2 wk" },
    { day: to, label: "+3 wk" },
  ]
    .filter((t, i, all) => i === all.length - 1 || x(all[all.length - 1].day) - x(t.day) >= 44)
    .filter((t, i, all) => i === 0 || x(t.day) - x(all[i - 1].day) >= 44);
  const endReview = memory.ifReview[memory.ifReview.length - 1];
  const endSkip = memory.ifSkip[memory.ifSkip.length - 1];

  const hoverPast = hover !== null && hover < 0 ? valueAt(memory.past, hover) : null;
  const hoverReview = hover !== null && hover >= 0 ? valueAt(memory.ifReview, hover) : null;
  const hoverSkip = hover !== null && hover >= 0 ? valueAt(memory.ifSkip, hover) : null;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - r.left) / r.width) * W;
    const day = from + ((sx - PAD.left) / (W - PAD.left - PAD.right)) * (to - from);
    setHover(Math.min(to, Math.max(from, Math.round(day * 4) / 4)));
  }

  return (
    <figure className="m-0 flex flex-col gap-2">
      <figcaption className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[var(--coach-ink-secondary)]">
        <span className="flex items-center gap-1.5">
          <svg width="16" height="6" aria-hidden>
            <line x1="0" y1="3" x2="16" y2="3" stroke="var(--coach-chart-kept)" strokeWidth="2" />
          </svg>
          So far
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="16" height="6" aria-hidden>
            <line x1="1" y1="3" x2="15" y2="3" stroke="var(--coach-chart-kept)" strokeWidth="2" strokeDasharray="4 3" />
          </svg>
          If you review today
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="16" height="6" aria-hidden>
            <line
              x1="1"
              y1="3"
              x2="15"
              y2="3"
              stroke="var(--coach-chart-stopped)"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          </svg>
          If you skip
        </span>
      </figcaption>

      <div ref={box} className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-none"
          role="img"
          aria-label={`Your memory of ${memory.cards} cards: about ${pct(memory.now)} now. ${
            memory.reviewToday
              ? `Reviewing today brings it to about ${pct(memory.afterReview)}; skipping, about ${pct(endSkip.recall)} in three weeks.`
              : "No review needed today."
          }`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--coach-divider)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 6}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className="fill-[var(--coach-ink-muted)] text-[10px] tabular-nums"
              >
                {pct(t)}
              </text>
            </g>
          ))}
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(0.9)}
            y2={y(0.9)}
            stroke="var(--coach-ink-muted)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <text
            x={W - PAD.right}
            y={y(0.9) + 12}
            textAnchor="end"
            className="fill-[var(--coach-ink-muted)] text-[10px]"
          >
            90% · time to review
          </text>
          {ticks.map((t, i) => (
            <text
              key={t.label}
              x={x(t.day)}
              y={H - 6}
              textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"}
              className={`text-[10px] ${t.day === 0 ? "fill-[var(--coach-ink)] font-semibold" : "fill-[var(--coach-ink-muted)]"}`}
            >
              {t.label}
            </text>
          ))}

          {/* Today */}
          <line
            x1={x(0)}
            x2={x(0)}
            y1={PAD.top - 8}
            y2={H - PAD.bottom}
            stroke="var(--coach-ink)"
            strokeWidth="1"
            strokeOpacity="0.5"
          />

          <path
            d={path(memory.ifSkip)}
            fill="none"
            stroke="var(--coach-chart-stopped)"
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <path
            d={path(memory.ifReview)}
            fill="none"
            stroke="var(--coach-chart-kept)"
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <path
            d={path(memory.past)}
            fill="none"
            stroke="var(--coach-chart-kept)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Last review */}
          {memory.lastReview && memory.lastReview.day >= from && (
            <g>
              <line
                x1={x(memory.lastReview.day)}
                x2={x(memory.lastReview.day)}
                y1={PAD.top - 8}
                y2={y(valueAt(memory.past, memory.lastReview.day + 0.25) ?? 1)}
                stroke="var(--coach-ink-muted)"
                strokeWidth="1"
                strokeDasharray="1 2"
              />
              <circle
                cx={x(memory.lastReview.day)}
                cy={y(valueAt(memory.past, memory.lastReview.day + 0.25) ?? 1)}
                r="4"
                fill="var(--coach-chart-kept)"
                stroke="var(--coach-surface)"
                strokeWidth="2"
              />
              <text
                x={x(memory.lastReview.day)}
                y={PAD.top - 12}
                textAnchor={memory.lastReview.day - from < (to - from) * 0.12 ? "start" : "middle"}
                className="fill-[var(--coach-ink-secondary)] text-[10px]"
              >
                Last review {dateOf(memory.lastReview.day)}
              </text>
            </g>
          )}

          {/* Now */}
          <circle
            cx={x(0)}
            cy={y(memory.now)}
            r="4.5"
            fill="var(--coach-ink)"
            stroke="var(--coach-surface)"
            strokeWidth="2"
          />
          <text
            x={x(0) - 7}
            y={y(memory.now)}
            dy="0.32em"
            textAnchor="end"
            stroke="var(--coach-surface)"
            strokeWidth="3"
            paintOrder="stroke"
            className="fill-[var(--coach-ink)] text-[11px] font-bold tabular-nums"
          >
            Now {pct(memory.now)}
          </text>

          <text
            x={W - PAD.right + 5}
            y={y(endReview.recall)}
            dy="0.32em"
            className="fill-[var(--coach-ink)] text-[10px] font-semibold tabular-nums"
          >
            {pct(endReview.recall)}
          </text>
          <text
            x={W - PAD.right + 5}
            y={y(endSkip.recall)}
            dy="0.32em"
            className="fill-[var(--coach-ink)] text-[10px] font-semibold tabular-nums"
          >
            {pct(endSkip.recall)}
          </text>

          {hover !== null && (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="var(--coach-ink-muted)"
              strokeWidth="1"
              pointerEvents="none"
            />
          )}
        </svg>

        {hover !== null && (
          <div
            className="pointer-events-none absolute top-6 rounded-lg border border-[var(--coach-border)] bg-[var(--coach-surface)] px-2.5 py-1.5 text-[12px] leading-snug text-[var(--coach-ink)] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.25)]"
            style={{
              left: `${(x(hover) / W) * 100}%`,
              transform: hover > (from + to) / 2 ? "translateX(calc(-100% - 8px))" : "translateX(8px)",
            }}
          >
            <div className="font-semibold">{hover === 0 ? "Today" : dateOf(hover)}</div>
            {hoverPast !== null && <div className="tabular-nums">You remembered about {pct(hoverPast)}</div>}
            {hoverReview !== null && (
              <div className="tabular-nums">
                If you review today: {pct(hover === 0 ? memory.afterReview : hoverReview)}
              </div>
            )}
            {hoverSkip !== null && <div className="tabular-nums">If you skip: {pct(hoverSkip)}</div>}
          </div>
        )}
      </div>

      <table className="sr-only">
        <caption>Your memory of your Practice cards</caption>
        <tbody>
          <tr>
            <th scope="row">Now</th>
            <td>{pct(memory.now)}</td>
          </tr>
          <tr>
            <th scope="row">Right after reviewing today</th>
            <td>{pct(memory.afterReview)}</td>
          </tr>
          <tr>
            <th scope="row">In three weeks if you review when due</th>
            <td>{pct(endReview.recall)}</td>
          </tr>
          <tr>
            <th scope="row">In three weeks if you skip</th>
            <td>{pct(endSkip.recall)}</td>
          </tr>
        </tbody>
      </table>
    </figure>
  );
}
