"use client";

import { useId, useMemo, useState } from "react";
import { bitsToText, HIGH_V, LOW_V, simulate, textToBits, type Coding } from "@/lib/channel/model";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const CODING_NAME: Record<Coding, string> = { none: "No code", parity: "Parity bit per byte", repeat3: "Send each bit 3 times" };

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * The Channel Lab: send a short message as voltages down a noisy line and read it back with a threshold,
 * optionally with a parity bit or three copies of every bit (model: src/lib/channel/model.ts).
 * JSON-string props: messageJson ('"HI"'), noiseJson ('1'), thresholdJson ('4.2'), codingsJson
 * ('["none","parity","repeat3"]', which codes the learner may pick), seedJson, and goalJson
 * ('{"errors":0}': the message must arrive with no wrong bits). With `noiseAdjustable` the learner
 * can also change the noise.
 */
export function ChannelLab({
  caption,
  messageJson,
  noiseJson,
  thresholdJson,
  codingsJson,
  seedJson,
  goalJson,
  noiseAdjustable = false,
}: {
  caption?: string;
  messageJson?: string;
  noiseJson?: string;
  thresholdJson?: string;
  codingsJson?: string;
  seedJson?: string;
  goalJson?: string;
  noiseAdjustable?: boolean;
}) {
  const startMessage = parseJson<string>(messageJson, "HI");
  const startNoise = parseJson<number>(noiseJson, 0.8);
  const startThreshold = parseJson<number>(thresholdJson, 2.5);
  const codings = parseJson<Coding[]>(codingsJson, ["none"]);
  const seed = parseJson<number>(seedJson, 1);
  const goal = parseJson<{ errors?: number } | null>(goalJson, null);

  const [message, setMessage] = useState(startMessage);
  const [noise, setNoise] = useState(startNoise);
  const [threshold, setThreshold] = useState(startThreshold);
  const [coding, setCoding] = useState<Coding>(codings[0] ?? "none");
  const ids = { msg: useId(), noise: useId(), thr: useId() };

  const data = useMemo(() => textToBits(message.slice(0, 4)), [message]);
  const r = useMemo(() => simulate(data, { coding, noise, threshold, seed }), [data, coding, noise, threshold, seed]);
  const flips = new Set(r.lineFlips);
  const met = goal?.errors !== undefined && data.length > 0 && r.dataErrors.length <= goal.errors;

  // The chart: one mark per symbol on the line, voltage up the side, the threshold as a line.
  const W = 640;
  const H = 170;
  const pad = { l: 34, r: 8, t: 10, b: 18 };
  const vMin = -3;
  const vMax = 8;
  const y = (v: number) => pad.t + ((vMax - Math.max(vMin, Math.min(vMax, v))) / (vMax - vMin)) * (H - pad.t - pad.b);
  const x = (i: number) => pad.l + ((i + 0.5) / Math.max(1, r.volts.length)) * (W - pad.l - pad.r);

  const field =
    "rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2 text-[14px] text-[var(--coach-ink)] outline-none focus-visible:border-[var(--coach-focus)]";

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="border-b-2 border-[var(--coach-border)] px-4 py-3 text-[15px] font-bold">
        {caption ?? "A noisy channel"}
      </figcaption>

      <div className="flex flex-wrap items-end gap-4 p-4 text-[13px]">
        <label htmlFor={ids.msg} className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold text-[var(--coach-ink-secondary)]">message (up to 4 letters)</span>
          <input
            id={ids.msg}
            value={message}
            maxLength={4}
            onChange={(e) => setMessage(e.target.value)}
            className={`${field} h-9 w-[96px] ${MONO}`}
          />
        </label>
        <label htmlFor={ids.thr} className="flex min-w-[180px] flex-1 flex-col gap-1">
          <span className="text-[12px] font-semibold text-[var(--coach-ink-secondary)]">
            receiver threshold: <b className={MONO}>{threshold.toFixed(1)} V</b>
          </span>
          <input
            id={ids.thr}
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="accent-[var(--coach-blue)]"
          />
        </label>
        {noiseAdjustable ? (
          <label htmlFor={ids.noise} className="flex min-w-[160px] flex-1 flex-col gap-1">
            <span className="text-[12px] font-semibold text-[var(--coach-ink-secondary)]">
              noise: <b className={MONO}>{noise.toFixed(1)} V</b>
            </span>
            <input
              id={ids.noise}
              type="range"
              min={0}
              max={2.5}
              step={0.1}
              value={noise}
              onChange={(e) => setNoise(Number(e.target.value))}
              className="accent-[var(--coach-blue)]"
            />
          </label>
        ) : (
          <p className="m-0 text-[12.5px] text-[var(--coach-ink-secondary)]">
            noise on this line: <b className={MONO}>{noise.toFixed(1)} V</b>
          </p>
        )}
        {codings.length > 1 && (
          <fieldset className="m-0 flex flex-wrap gap-1.5 border-0 p-0">
            <legend className="mb-1 text-[12px] font-semibold text-[var(--coach-ink-secondary)]">code</legend>
            {codings.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={coding === c}
                onClick={() => setCoding(c)}
                className={`h-9 rounded-full px-3 text-[12.5px] font-bold ${
                  coding === c ? "bg-[var(--coach-ink)] text-[var(--coach-surface)]" : "border-2 border-[var(--coach-border)] text-[var(--coach-ink-secondary)]"
                }`}
              >
                {CODING_NAME[c]}
              </button>
            ))}
          </fieldset>
        )}
      </div>

      <div className="px-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Received voltages for ${r.volts.length} symbols, with the threshold at ${threshold.toFixed(1)} volts. ${r.lineFlips.length} misread.`}>
          {[LOW_V, HIGH_V].map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--coach-border)" strokeWidth={1} />
              <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="var(--coach-ink-muted)">
                {v} V
              </text>
            </g>
          ))}
          <line x1={pad.l} x2={W - pad.r} y1={y(threshold)} y2={y(threshold)} stroke="var(--coach-ink)" strokeWidth={2} strokeDasharray="6 4" />
          {r.volts.map((v, i) => {
            const wrong = flips.has(i);
            const cx = x(i);
            const cy = y(v);
            return wrong ? (
              <g key={i} stroke="var(--coach-wrong-title)" strokeWidth={2.4}>
                <line x1={cx - 4.5} y1={cy - 4.5} x2={cx + 4.5} y2={cy + 4.5} />
                <line x1={cx - 4.5} y1={cy + 4.5} x2={cx + 4.5} y2={cy - 4.5} />
              </g>
            ) : (
              <circle key={i} cx={cx} cy={cy} r={4} fill={r.sent[i] ? "var(--coach-blue)" : "var(--coach-ink-muted)"} stroke="var(--coach-surface)" strokeWidth={1.5} />
            );
          })}
        </svg>
        <p className="m-0 text-[12px] text-[var(--coach-ink-muted)]">
          Each mark is one symbol as it arrived: dots were read correctly (filled blue for a sent 1), crosses were misread. Above the dashed threshold reads as 1.
        </p>
      </div>

      <div className={`overflow-x-auto px-4 pt-3 text-[12.5px] ${MONO}`}>
        <div className="flex gap-2 whitespace-nowrap">
          <span className="w-[64px] shrink-0 text-[var(--coach-ink-muted)]">sent</span>
          <span>{r.sent.join("")}</span>
        </div>
        <div className="flex gap-2 whitespace-nowrap">
          <span className="w-[64px] shrink-0 text-[var(--coach-ink-muted)]">received</span>
          <span>
            {r.received.map((b, i) => (
              <span key={i} className={flips.has(i) ? "rounded-sm bg-[var(--coach-wrong-soft)] font-bold text-[var(--coach-wrong-title)]" : ""}>
                {b}
              </span>
            ))}
          </span>
        </div>
      </div>

      <dl className={`m-0 grid gap-x-6 gap-y-1 p-4 text-[13px] sm:grid-cols-2 ${MONO}`}>
        <div className="flex gap-2">
          <dt className="text-[var(--coach-ink-muted)]">message out</dt>
          <dd className="m-0 font-bold">{bitsToText(data) || "nothing"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-[var(--coach-ink-muted)]">message in</dt>
          <dd className="m-0 font-bold">{bitsToText(r.decoded) || "nothing"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-[var(--coach-ink-muted)]">misread on the line</dt>
          <dd className="m-0 font-bold">{r.lineFlips.length} of {r.sent.length}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-[var(--coach-ink-muted)]">wrong data bits</dt>
          <dd className="m-0 font-bold">{r.dataErrors.length} of {data.length}</dd>
        </div>
        {coding === "parity" && (
          <div className="flex gap-2">
            <dt className="text-[var(--coach-ink-muted)]">bytes flagged by parity</dt>
            <dd className="m-0 font-bold">{r.detected.length ? r.detected.map((g) => g + 1).join(", ") : "none"}</dd>
          </div>
        )}
        {coding === "repeat3" && (
          <div className="flex gap-2">
            <dt className="text-[var(--coach-ink-muted)]">bits fixed by majority</dt>
            <dd className="m-0 font-bold">{r.corrected.length}</dd>
          </div>
        )}
      </dl>

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          met ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : ""
        }`}
      >
        {goal?.errors !== undefined
          ? met
            ? `The message arrived intact: ${r.lineFlips.length} symbols were misread on the line, and none of the data is wrong.`
            : `Not yet: ${r.dataErrors.length} data ${r.dataErrors.length === 1 ? "bit is" : "bits are"} wrong.`
          : `${r.dataErrors.length} of ${data.length} data bits arrived wrong.`}
      </p>
    </figure>
  );
}
