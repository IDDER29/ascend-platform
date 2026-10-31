"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { HdlRun } from "@/lib/hdl/hash";
import { display, valueAt, type Waves } from "@/lib/hdl/vcd";

const MONO = "font-[family-name:var(--font-plex-mono)]";

/** The commands and what the tool printed, and the waveform if there is one; optionally hidden until asked. */
export function HdlRunOutput({ run, predict }: { run: HdlRun; predict: boolean }) {
  const [shown, setShown] = useState(!predict);
  if (!shown) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-[var(--coach-tint-neutral-bg)] px-3 py-2.5">
        <p className="m-0 flex-1 text-[13.5px]">Predict the result, then run it.</p>
        <button
          type="button"
          onClick={() => setShown(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--coach-lime)] px-3.5 text-[13.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_2px_0_var(--coach-lime-shadow)]"
        >
          <Play size={14} strokeWidth={2.6} aria-hidden /> Run it
        </button>
      </div>
    );
  }
  return (
    <div aria-live="polite" className="flex min-w-0 flex-col gap-3">
      <pre
        className={`m-0 max-h-[360px] overflow-auto rounded-xl bg-[var(--coach-code-bg)] p-3 text-[13px] leading-relaxed text-[var(--coach-code-ink)] ${MONO}`}
      >
        {run.commands.map((c) => `$ ${c}`).join("\n")}
        {run.compile.messages ? `\n${run.compile.messages.replace(/\n$/, "")}` : ""}
        {run.output ? `\n${run.output.replace(/\n$/, "")}` : ""}
      </pre>
      {run.waves && run.waves.waves.length > 0 && <WaveView waves={run.waves} />}
    </div>
  );
}

/** A waveform: one row per signal, 1-bit signals as a trace, buses as labelled segments. */
function WaveView({ waves }: { waves: Waves }) {
  const end = Math.max(1, waves.end);
  const W = 640;
  const label = 96;
  const row = 30;
  const x = (t: number) => label + (t / end) * (W - label - 8);
  const H = waves.waves.length * row + 22;
  const ticks = niceTicks(end);
  // Icarus's default unit is 1 s when a design sets no `timescale; then the numbers are just time steps.
  const unit = !waves.timescale || waves.timescale === "1s" ? "time steps" : waves.timescale;
  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full min-w-[480px]"
        role="img"
        aria-label={`Waveform of ${waves.waves.map((w) => w.name.split(".").pop()).join(", ")} over ${waves.end} ${unit}`}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={0} y2={H - 18} stroke="var(--coach-border)" strokeWidth={1} />
            <text x={x(t)} y={H - 5} textAnchor="middle" fontSize={10} fill="var(--coach-ink-muted)">
              {t}
            </text>
          </g>
        ))}
        {waves.waves.map((w, r) => {
          const top = r * row + 5;
          const hi = top + 3;
          const lo = top + row - 9;
          const name = w.name.split(".").pop()!;
          const segs = w.changes.map(([t, v], k) => ({ t0: t, t1: k + 1 < w.changes.length ? w.changes[k + 1][0] : end, v }));
          return (
            <g key={w.name}>
              <text x={4} y={(hi + lo) / 2 + 4} fontSize={11.5} fill="var(--coach-ink)" fontFamily="var(--font-plex-mono)">
                {name}
                {w.width > 1 ? `[${w.width - 1}:0]` : ""}
              </text>
              {w.width === 1 ? (
                <polyline
                  fill="none"
                  stroke="var(--coach-ink)"
                  strokeWidth={1.8}
                  points={segs
                    .flatMap(({ t0, t1, v }) => {
                      const y = v === "1" ? hi : v === "0" ? lo : (hi + lo) / 2;
                      return [`${x(t0)},${y}`, `${x(t1)},${y}`];
                    })
                    .join(" ")}
                />
              ) : (
                segs.map(({ t0, t1, v }, k) => {
                  const known = !/[xz]/i.test(v);
                  return (
                    <g key={k}>
                      <path
                        d={`M${x(t0) + 3},${hi} L${x(t1) - 3},${hi} L${x(t1)},${(hi + lo) / 2} L${x(t1) - 3},${lo} L${x(t0) + 3},${lo} L${x(t0)},${(hi + lo) / 2} Z`}
                        fill={known ? "var(--coach-tint-lime-bg)" : "var(--coach-wrong-soft)"}
                        stroke="var(--coach-ink-secondary)"
                        strokeWidth={1}
                      />
                      {x(t1) - x(t0) > 16 && (
                        <text x={(x(t0) + x(t1)) / 2} y={(hi + lo) / 2 + 4} textAnchor="middle" fontSize={10.5} fill="var(--coach-ink)" fontFamily="var(--font-plex-mono)">
                          {display(v, w.width)}
                        </text>
                      )}
                    </g>
                  );
                })
              )}
            </g>
          );
        })}
      </svg>
      <p className="m-0 text-[11.5px] text-[var(--coach-ink-muted)]">
        Time in {unit}. Red segments are unknown (x) or undriven (z). At the end:{" "}
        {waves.waves.map((w) => `${w.name.split(".").pop()} = ${display(valueAt(w, waves.end), w.width)}`).join(", ")}.
      </p>
    </div>
  );
}

function niceTicks(end: number): number[] {
  const step = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].find((s) => end / s <= 12) ?? Math.ceil(end / 10);
  const out: number[] = [];
  for (let t = 0; t <= end; t += step) out.push(t);
  return out;
}
