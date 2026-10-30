"use client";

import { useState } from "react";
import { recall } from "@/lib/practice/memory-curve";

const DAYS = 30;
const STEP = 0.25;
/** A new card's stability, in days, and how much each successful review multiplies it. */
const FIRST_STABILITY = 1;
const GROWTH = 2.5;

type Point = { day: number; once: number; practiced: number };

/** Two learners, same lesson: one reads it once, one reviews each time recall drops to 90%. */
function curves(): { points: Point[]; reviews: number[] } {
  const reviews: number[] = [];
  let last = 0;
  let stability = FIRST_STABILITY;
  const points: Point[] = [];
  for (let day = 0; day <= DAYS + 1e-9; day += STEP) {
    // Review the moment a card's recall would fall to 90%, which is `stability` days after the last review.
    if (day - last >= stability - 1e-9) {
      last = day;
      stability *= GROWTH;
      reviews.push(day);
    }
    points.push({ day, once: recall(day, FIRST_STABILITY), practiced: recall(day - last, stability) });
  }
  return { points, reviews };
}

const { points: POINTS, reviews: REVIEWS } = curves();
const W = 640;
const H = 260;
const PAD = { top: 18, right: 54, bottom: 30, left: 40 };
const x = (day: number) => PAD.left + (day / DAYS) * (W - PAD.left - PAD.right);
const y = (r: number) => PAD.top + (1 - r) * (H - PAD.top - PAD.bottom);
const line = (key: "once" | "practiced") =>
  POINTS.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.day).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
const pct = (r: number) => `${Math.round(r * 100)}%`;

export function ForgettingChart() {
  const [hover, setHover] = useState<Point | null>(null);
  const end = POINTS[POINTS.length - 1];

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - box.left) / box.width) * W;
    const day = Math.round((((sx - PAD.left) / (W - PAD.left - PAD.right)) * DAYS) / STEP) * STEP;
    setHover(POINTS[Math.min(POINTS.length - 1, Math.max(0, Math.round(day / STEP)))]);
  }

  return (
    <figure className="m-0 rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-4 sm:p-6">
      <figcaption className="flex flex-col gap-2">
        <span className="text-[16px] font-bold">How much of one lesson you&apos;d still recall</span>
        <span className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[var(--coach-ink-secondary)]">
          <span className="flex items-center gap-1.5">
            <svg width="18" height="6" aria-hidden>
              <line x1="0" y1="3" x2="18" y2="3" stroke="var(--coach-chart-kept)" strokeWidth="2.5" />
            </svg>
            With Practice
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="18" height="6" aria-hidden>
              <line
                x1="1"
                y1="3"
                x2="17"
                y2="3"
                stroke="var(--coach-chart-stopped)"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
            </svg>
            Read once
          </span>
        </span>
      </figcaption>

      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-none"
          role="img"
          aria-label={`Read once, recall falls to about ${pct(end.once)} after a month. With ${REVIEWS.length} short reviews, it stays above 90% and ends near ${pct(end.practiced)}.`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--coach-divider)" />
              <text
                x={PAD.left - 8}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className="fill-[var(--coach-ink-muted)] text-[11px] tabular-nums"
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
            strokeDasharray="2 3"
          />
          <text
            x={x(DAYS / 2)}
            y={y(0.9) + 15}
            textAnchor="middle"
            className="fill-[var(--coach-ink-muted)] text-[11px]"
          >
            90%: a review is due
          </text>
          {[0, 7, 14, 21, 28].map((d) => (
            <text
              key={d}
              x={x(d)}
              y={H - 8}
              textAnchor={d === 0 ? "start" : "middle"}
              className="fill-[var(--coach-ink-muted)] text-[11px]"
            >
              {d === 0 ? "Lesson" : `Day ${d}`}
            </text>
          ))}

          <path
            d={line("once")}
            fill="none"
            stroke="var(--coach-chart-stopped)"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          <path d={line("practiced")} fill="none" stroke="var(--coach-chart-kept)" strokeWidth="2.5" />
          {REVIEWS.map((d) => (
            <circle
              key={d}
              cx={x(d)}
              cy={y(1)}
              r="4.5"
              fill="var(--coach-chart-kept)"
              stroke="var(--coach-surface)"
              strokeWidth="2"
            />
          ))}
          <text
            x={W - PAD.right + 6}
            y={y(end.practiced)}
            dy="0.32em"
            className="fill-[var(--coach-ink)] text-[12px] font-semibold tabular-nums"
          >
            {pct(end.practiced)}
          </text>
          <text
            x={W - PAD.right + 6}
            y={y(end.once)}
            dy="0.32em"
            className="fill-[var(--coach-ink)] text-[12px] font-semibold tabular-nums"
          >
            {pct(end.once)}
          </text>
          {hover && (
            <line
              x1={x(hover.day)}
              x2={x(hover.day)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="var(--coach-ink-muted)"
              pointerEvents="none"
            />
          )}
        </svg>
        {hover && (
          <div
            className="pointer-events-none absolute top-2 rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2.5 py-1.5 text-[12.5px] leading-snug shadow-[0_8px_20px_-8px_rgba(0,0,0,0.25)]"
            style={{
              left: `${(x(hover.day) / W) * 100}%`,
              transform: hover.day > DAYS / 2 ? "translateX(calc(-100% - 8px))" : "translateX(8px)",
            }}
          >
            <div className="font-semibold">
              {hover.day === 0 ? "Right after the lesson" : `Day ${Math.floor(hover.day)}`}
            </div>
            <div className="tabular-nums">With Practice: {pct(hover.practiced)}</div>
            <div className="tabular-nums">Read once: {pct(hover.once)}</div>
          </div>
        )}
      </div>
      <p className="m-0 mt-3 text-[13px] leading-relaxed text-[var(--coach-ink-muted)]">
        Dots are reviews, each about half a minute. A model, not a measurement: the curve is FSRS&apos;s forgetting
        curve, and real memories vary.
      </p>
      <table className="sr-only">
        <caption>Estimated recall of one lesson over a month</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">With Practice</th>
            <th scope="col">Read once</th>
          </tr>
        </thead>
        <tbody>
          {POINTS.filter((p) => p.day % 7 === 0).map((p) => (
            <tr key={p.day}>
              <td>{p.day}</td>
              <td>{pct(p.practiced)}</td>
              <td>{pct(p.once)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
