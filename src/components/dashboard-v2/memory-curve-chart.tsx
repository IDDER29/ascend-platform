"use client";

import { useState } from "react";
import type { MemoryCurve } from "@/lib/practice/memory-curve";

const W = 320;
const H = 132;
const PAD = { top: 10, right: 40, bottom: 20, left: 30 };
const TICKS = [0, 0.5, 1];
const DAY_TICKS: { day: number; label: string }[] = [
  { day: 0, label: "Today" },
  { day: 7, label: "1 wk" },
  { day: 14, label: "2 wk" },
  { day: 30, label: "30 days" },
];

const pct = (r: number) => `${Math.round(r * 100)}%`;

/**
 * The learner's memory curve: estimated recall of their Practice cards over the next 30 days,
 * reviewing when cards come due (solid) or stopping now (dashed).
 */
export function MemoryCurveChart({ curve }: { curve: MemoryCurve }) {
  const [hover, setHover] = useState<number | null>(null);
  const last = curve.points.length - 1;
  const x = (day: number) => PAD.left + (day / last) * (W - PAD.left - PAD.right);
  const y = (r: number) => PAD.top + (1 - r) * (H - PAD.top - PAD.bottom);
  const line = (key: "kept" | "stopped") =>
    curve.points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.day).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  // Both lines start where you are now; reviewing what's due today jumps the solid one up.
  const today = curve.today;
  const afterToday = curve.points[0].kept;
  const reviewsToday = afterToday - today > 0.005;
  const keptPath = `M${x(0).toFixed(1)},${y(today).toFixed(1)} ${line("kept").replace(/^M/, "L")}`;
  const end = curve.points[last];
  const shown = hover === null ? null : curve.points[hover];

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - box.left) / box.width) * W;
    const day = Math.round(((sx - PAD.left) / (W - PAD.left - PAD.right)) * last);
    setHover(Math.min(last, Math.max(0, day)));
  }

  return (
    <figure className="m-0 flex flex-col gap-2">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-[13px] font-semibold text-[var(--coach-ink)]">Your memory</span>
        <span className="flex gap-3 text-[12px] text-[var(--coach-ink-secondary)]">
          <span className="flex items-center gap-1.5">
            <svg width="16" height="6" aria-hidden>
              <line
                x1="0"
                y1="3"
                x2="16"
                y2="3"
                stroke="var(--coach-chart-kept)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Reviewing when due
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
                strokeLinecap="round"
              />
            </svg>
            If you stop
          </span>
        </span>
      </figcaption>

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-none"
          role="img"
          aria-label={`Estimated recall of your ${curve.cards} cards: ${pct(today)} now${reviewsToday ? `, ${pct(afterToday)} after today's reviews` : ""}. Reviewing when due keeps it near ${pct(end.kept)}; if you stop, about ${pct(end.stopped)} in 30 days.`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {TICKS.map((t) => (
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
                className="fill-[var(--coach-ink-muted)] text-[9px] tabular-nums"
              >
                {pct(t)}
              </text>
            </g>
          ))}
          {DAY_TICKS.map((t) => (
            <text
              key={t.day}
              x={x(t.day)}
              y={H - 4}
              textAnchor={t.day === 0 ? "start" : t.day === last ? "end" : "middle"}
              className="fill-[var(--coach-ink-muted)] text-[9px]"
            >
              {t.label}
            </text>
          ))}

          <path
            d={line("stopped")}
            fill="none"
            stroke="var(--coach-chart-stopped)"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={keptPath}
            fill="none"
            stroke="var(--coach-chart-kept)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx={x(0)} cy={y(today)} r="4" fill="var(--coach-ink)" stroke="var(--coach-surface)" strokeWidth="2" />
          <text
            x={x(0) + 7}
            y={y(today)}
            dy="-0.7em"
            stroke="var(--coach-surface)"
            strokeWidth="3"
            paintOrder="stroke"
            className="fill-[var(--coach-ink)] text-[10px] font-semibold tabular-nums"
          >
            Now {pct(today)}
          </text>

          {/* Direct labels at the line ends. */}
          <text
            x={x(last) + 5}
            y={y(end.kept)}
            dy="0.32em"
            className="fill-[var(--coach-ink)] text-[10px] font-semibold tabular-nums"
          >
            {pct(end.kept)}
          </text>
          <text
            x={x(last) + 5}
            y={y(end.stopped)}
            dy="0.32em"
            className="fill-[var(--coach-ink)] text-[10px] font-semibold tabular-nums"
          >
            {pct(end.stopped)}
          </text>

          {shown && (
            <g pointerEvents="none">
              <line
                x1={x(shown.day)}
                x2={x(shown.day)}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="var(--coach-ink-muted)"
                strokeWidth="1"
              />
              <circle
                cx={x(shown.day)}
                cy={y(shown.kept)}
                r="4"
                fill="var(--coach-chart-kept)"
                stroke="var(--coach-surface)"
                strokeWidth="2"
              />
              <circle
                cx={x(shown.day)}
                cy={y(shown.stopped)}
                r="4"
                fill="var(--coach-chart-stopped)"
                stroke="var(--coach-surface)"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {shown && (
          <div
            className="pointer-events-none absolute top-0 rounded-lg border border-[var(--coach-border)] bg-[var(--coach-surface)] px-2.5 py-1.5 text-[12px] leading-snug text-[var(--coach-ink)] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.25)]"
            style={{
              left: `${(x(shown.day) / W) * 100}%`,
              transform: shown.day > last / 2 ? "translateX(calc(-100% - 8px))" : "translateX(8px)",
            }}
          >
            <div className="font-semibold">
              {shown.day === 0 ? "Today" : `In ${shown.day} ${shown.day === 1 ? "day" : "days"}`}
            </div>
            <div className="tabular-nums">
              Reviewing:{" "}
              {shown.day === 0 && reviewsToday
                ? `${pct(today)} now, ${pct(shown.kept)} after today's reviews`
                : pct(shown.kept)}
            </div>
            <div className="tabular-nums">If you stop: {pct(shown.stopped)}</div>
          </div>
        )}
      </div>

      <table className="sr-only">
        <caption>Estimated recall of your Practice cards</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Reviewing when due</th>
            <th scope="col">If you stop</th>
          </tr>
        </thead>
        <tbody>
          {curve.points
            .filter((p) => p.day % 7 === 0 || p.day === last)
            .map((p) => (
              <tr key={p.day}>
                <th scope="row">{p.day === 0 ? "Today" : `Day ${p.day}`}</th>
                <td>
                  {p.day === 0 && reviewsToday
                    ? `${pct(today)} now, ${pct(p.kept)} after today's reviews`
                    : pct(p.kept)}
                </td>
                <td>{pct(p.stopped)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </figure>
  );
}
