"use client";

import { useEffect, useRef, useState } from "react";
import { recallAt, type CardMemory } from "@/lib/practice/card-memory";
import { recall } from "@/lib/practice/memory-curve";

const H = 220;
const PAD = { top: 26, right: 16, bottom: 26, left: 46 };
const SAMPLES = 280;
const DAY_MS = 86_400_000;

const pct = (r: number) => `${Math.round(r * 100)}%`;

/**
 * One card's sawtooth: recall falls after each review; a review jumps it back
 * up and (when right) stretches the next curve. Solid up to today, dashed after.
 * The dotted line is the card if it had never been reviewed again.
 */
export function CardMemoryChart({ memory }: { memory: CardMemory }) {
  const [hover, setHover] = useState<number | null>(null);
  // Drawn at its real width, so text stays readable on a phone.
  const [W, setW] = useState(560);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const firstAt = Date.parse(memory.reviews[0].at);
  const dueDay = memory.due?.day ?? memory.today;
  const end = Math.max(7, Math.max(memory.today, dueDay) * 1.15 + 1);
  const x = (day: number) => PAD.left + (day / end) * (W - PAD.left - PAD.right);
  const y = (r: number) => PAD.top + (1 - r) * (H - PAD.top - PAD.bottom);
  const dateOf = (day: number) =>
    new Date(firstAt + day * DAY_MS).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // The sawtooth, split at today into what happened and what's predicted.
  const past: string[] = [];
  const future: string[] = [];
  memory.reviews.forEach((r, i) => {
    const to = memory.reviews[i + 1]?.day ?? end;
    const steps = Math.max(2, Math.ceil(((to - r.day) / end) * SAMPLES));
    for (let k = 0; k <= steps; k++) {
      const day = r.day + ((to - r.day) * k) / steps;
      const point = `${x(day).toFixed(1)},${y(recall(day - r.day, r.stability)).toFixed(1)}`;
      if (day <= memory.today) past.push(`${past.length === 0 ? "M" : "L"}${point}`);
      if (day >= memory.today) future.push(`${future.length === 0 ? "M" : "L"}${point}`);
    }
  });
  const never =
    memory.firstStability === null
      ? ""
      : Array.from({ length: SAMPLES + 1 }, (_, k) => {
          const day = (end * k) / SAMPLES;
          return `${k === 0 ? "M" : "L"}${x(day).toFixed(1)},${y(recall(day, memory.firstStability!)).toFixed(1)}`;
        }).join(" ");

  const ticks = [0, end / 3, (2 * end) / 3, end];
  const hoverDay = hover === null ? null : (hover / SAMPLES) * end;
  const hoverRecall = hoverDay === null ? null : recallAt(memory, hoverDay);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - box.left) / box.width) * W;
    const k = Math.round(((sx - PAD.left) / (W - PAD.left - PAD.right)) * SAMPLES);
    setHover(Math.min(SAMPLES, Math.max(0, k)));
  }

  return (
    <figure className="m-0 flex flex-col gap-3">
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[var(--coach-ink-secondary)]">
        <span className="flex items-center gap-1.5">
          <svg width="18" height="6" aria-hidden>
            <line x1="0" y1="3" x2="18" y2="3" stroke="var(--coach-chart-kept)" strokeWidth="2" />
          </svg>
          Your memory of this card
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="18" height="6" aria-hidden>
            <line x1="1" y1="3" x2="17" y2="3" stroke="var(--coach-chart-kept)" strokeWidth="2" strokeDasharray="4 3" />
          </svg>
          Predicted
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="18" height="6" aria-hidden>
            <line
              x1="1"
              y1="3"
              x2="17"
              y2="3"
              stroke="var(--coach-ink-muted)"
              strokeWidth="2"
              strokeDasharray="1 3"
              strokeLinecap="round"
            />
          </svg>
          Never reviewed again
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="10" height="10" aria-hidden>
            <circle cx="5" cy="5" r="4" fill="var(--coach-chart-kept)" />
          </svg>
          Right
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="10" height="10" aria-hidden>
            <rect x="1" y="1" width="8" height="8" fill="var(--coach-chart-stopped)" />
          </svg>
          Missed
        </span>
      </figcaption>

      <div ref={box} className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-none"
          role="img"
          aria-label={`Recall of this card over time: ${memory.reviews.length} reviews; about ${pct(memory.now ?? 0)} now${memory.due ? `; next review ${dateOf(memory.due.day)}` : ""}.`}
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
          <text x={W - PAD.right} y={y(0.9) - 4} textAnchor="end" className="fill-[var(--coach-ink-muted)] text-[10px]">
            90% · time to review
          </text>
          {ticks.map((d, i) => (
            <text
              key={i}
              x={x(d)}
              y={H - 6}
              textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"}
              className="fill-[var(--coach-ink-muted)] text-[10px]"
            >
              {dateOf(d)}
            </text>
          ))}

          <path
            d={never}
            fill="none"
            stroke="var(--coach-ink-muted)"
            strokeWidth="2"
            strokeDasharray="1 4"
            strokeLinecap="round"
          />
          <path
            d={past.join(" ")}
            fill="none"
            stroke="var(--coach-chart-kept)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d={future.join(" ")}
            fill="none"
            stroke="var(--coach-chart-kept)"
            strokeWidth="2"
            strokeDasharray="5 4"
          />

          {/* Today */}
          <line
            x1={x(memory.today)}
            x2={x(memory.today)}
            y1={PAD.top - 12}
            y2={H - PAD.bottom}
            stroke="var(--coach-ink)"
            strokeWidth="1"
          />
          <text
            x={x(memory.today)}
            y={PAD.top - 15}
            textAnchor="middle"
            className="fill-[var(--coach-ink)] text-[10px] font-semibold"
          >
            Today {memory.now !== null ? pct(memory.now) : ""}
          </text>

          {/* Next review, where recall reaches 90% */}
          {memory.due && memory.due.day > memory.today && (
            <g>
              <rect
                x={x(memory.due.day) - 4}
                y={y(0.9) - 4}
                width="8"
                height="8"
                transform={`rotate(45 ${x(memory.due.day)} ${y(0.9)})`}
                fill="var(--coach-surface)"
                stroke="var(--coach-chart-kept)"
                strokeWidth="2"
              />
              <text
                x={x(memory.due.day)}
                y={y(0.9) + 16}
                textAnchor="middle"
                className="fill-[var(--coach-ink-secondary)] text-[10px]"
              >
                Next review
              </text>
            </g>
          )}

          {/* Reviews: back to the top */}
          {memory.reviews.map((r) =>
            r.correct ? (
              <circle
                key={r.at}
                cx={x(r.day)}
                cy={y(1)}
                r="4.5"
                fill="var(--coach-chart-kept)"
                stroke="var(--coach-surface)"
                strokeWidth="2"
              />
            ) : (
              <rect
                key={r.at}
                x={x(r.day) - 4.5}
                y={y(1) - 4.5}
                width="9"
                height="9"
                fill="var(--coach-chart-stopped)"
                stroke="var(--coach-surface)"
                strokeWidth="2"
              />
            ),
          )}

          {hoverDay !== null && hoverRecall !== null && (
            <g pointerEvents="none">
              <line
                x1={x(hoverDay)}
                x2={x(hoverDay)}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="var(--coach-ink-muted)"
                strokeWidth="1"
              />
              <circle
                cx={x(hoverDay)}
                cy={y(hoverRecall)}
                r="4"
                fill="var(--coach-chart-kept)"
                stroke="var(--coach-surface)"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {hoverDay !== null && hoverRecall !== null && (
          <div
            className="pointer-events-none absolute top-6 rounded-lg border border-[var(--coach-border)] bg-[var(--coach-surface)] px-2.5 py-1.5 text-[12px] leading-snug text-[var(--coach-ink)] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.25)]"
            style={{
              left: `${(x(hoverDay) / W) * 100}%`,
              transform: hoverDay > end / 2 ? "translateX(calc(-100% - 8px))" : "translateX(8px)",
            }}
          >
            <div className="font-semibold">{dateOf(hoverDay)}</div>
            <div className="tabular-nums">
              {hoverDay > memory.today ? "Predicted" : "Recall"}: {pct(hoverRecall)}
            </div>
          </div>
        )}
      </div>

      <table className="sr-only">
        <caption>Reviews of this card</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Result</th>
            <th scope="col">Holds for</th>
          </tr>
        </thead>
        <tbody>
          {memory.reviews.map((r) => (
            <tr key={r.at}>
              <th scope="row">{dateOf(r.day)}</th>
              <td>{r.correct ? "Right" : "Missed"}</td>
              <td>{r.stability < 1 ? "under a day" : `${r.stability} days`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
