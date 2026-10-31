"use client";

import { useId, useMemo, useState } from "react";
import { FastForward, RotateCcw, StepForward } from "lucide-react";
import { matrixWalk, parseTrace, simulate, strided, type Access, type CacheConfig, type Policy, type WritePolicy } from "@/lib/cache/model";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const hex = (n: number) => `0x${n.toString(16).toUpperCase()}`;

type Goal = { maxMisses?: number; minHitRate?: number };
type Pattern = { start: number; stride: number; count: number; repeat?: number; op?: "R" | "W" };

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * The Cache Lab: a trace of loads and stores through a set-associative cache (src/lib/cache/model.ts),
 * step by step: each address split into tag, index and offset, hit or miss (compulsory, capacity or
 * conflict), and the sets' contents. JSON-string props: configJson ('{"sizeBytes":256,"lineBytes":16,
 * "ways":1,"policy":"LRU","write":"write-back"}'), traceJson (["R 0x40","W 0x80"]), patternJson
 * ('{"start":0,"stride":4,"count":64,"repeat":2}') or matrixJson ('{"start":4096,"rows":16,"cols":16,
 * "elemBytes":4,"order":"cols","rowBytes":68}'), goalJson ('{"maxMisses":8}' or '{"minHitRate":0.9}').
 * With `fixed` the configuration is locked; with `editable` the learner edits the trace.
 */
export function CacheLab({
  caption,
  configJson,
  traceJson,
  patternJson,
  matrixJson,
  goalJson,
  fixed = false,
  editable = false,
}: {
  caption?: string;
  configJson?: string;
  traceJson?: string;
  patternJson?: string;
  matrixJson?: string;
  goalJson?: string;
  fixed?: boolean;
  editable?: boolean;
}) {
  const startConfig = useMemo(
    () => ({ sizeBytes: 256, lineBytes: 16, ways: 1, policy: "LRU" as Policy, write: "write-back" as WritePolicy, ...parseJson<Partial<CacheConfig>>(configJson, {}) }),
    [configJson],
  );
  const startTrace = useMemo(() => {
    const pattern = parseJson<Pattern | null>(patternJson, null);
    const matrix = parseJson<Parameters<typeof matrixWalk>[0] | null>(matrixJson, null);
    const generated = matrix ? matrixWalk(matrix) : pattern ? strided(pattern) : null;
    const lines = generated ? generated.map((a) => `${a.op} ${hex(a.addr)}`) : parseJson<string[]>(traceJson, []);
    return lines.join("\n");
  }, [traceJson, patternJson, matrixJson]);
  const goal = useMemo(() => parseJson<Goal | null>(goalJson, null), [goalJson]);
  const [config, setConfig] = useState<CacheConfig>(startConfig);
  const [text, setText] = useState(startTrace);
  const [shown, setShown] = useState(0);
  const traceId = useId();

  const parsed = useMemo(() => parseTrace(text.split("\n")), [text]);
  const trace = useMemo<Access[]>(() => (parsed.ok ? parsed.trace : []), [parsed]);
  const full = useMemo(() => simulate(config, trace), [config, trace]);
  const upTo = useMemo(() => simulate(config, trace.slice(0, shown)), [config, trace, shown]);
  const error = !parsed.ok ? `Line ${parsed.line}: ${parsed.message}.` : "error" in full ? `This cache can't exist: ${full.error}.` : null;

  const setNum = (key: "sizeBytes" | "lineBytes" | "ways", v: number) => {
    setConfig((c) => ({ ...c, [key]: v }));
    setShown(0);
  };
  const select = "h-9 rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2 text-[13px] disabled:opacity-60";

  const stats = "error" in full ? null : full.stats;
  const missCount = stats ? stats.misses.compulsory + stats.misses.capacity + stats.misses.conflict : 0;
  const hitRate = stats && stats.accesses ? stats.hits / stats.accesses : 0;
  const met =
    goal && stats && stats.accesses > 0 && (goal.maxMisses === undefined || missCount <= goal.maxMisses) && (goal.minHitRate === undefined || hitRate >= goal.minHitRate);
  const btn = "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-bold disabled:opacity-40";

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="border-b-2 border-[var(--coach-border)] px-4 py-3 text-[15px] font-bold">{caption ?? "The cache"}</figcaption>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-end gap-3 text-[12.5px]">
          {(
            [
              ["size", "sizeBytes", [64, 128, 256, 512, 1024, 4096, 32768]],
              ["line", "lineBytes", [4, 8, 16, 32, 64]],
              ["ways", "ways", [1, 2, 4, 8, 16]],
            ] as const
          ).map(([label, key, options]) => (
            <label key={key} className="flex flex-col gap-1 font-semibold text-[var(--coach-ink-secondary)]">
              {label}
              <select value={config[key]} disabled={fixed} onChange={(e) => setNum(key, Number(e.target.value))} className={`${select} ${MONO}`}>
                {options.map((o) => (
                  <option key={o} value={o}>
                    {key === "ways" ? o : o >= 1024 ? `${o / 1024} KiB` : `${o} B`}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label className="flex flex-col gap-1 font-semibold text-[var(--coach-ink-secondary)]">
            replace
            <select value={config.policy} disabled={fixed} onChange={(e) => (setConfig((c) => ({ ...c, policy: e.target.value as Policy })), setShown(0))} className={select}>
              <option value="LRU">least recently used</option>
              <option value="FIFO">oldest first</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 font-semibold text-[var(--coach-ink-secondary)]">
            writes
            <select value={config.write} disabled={fixed} onChange={(e) => (setConfig((c) => ({ ...c, write: e.target.value as WritePolicy })), setShown(0))} className={select}>
              <option value="write-back">write-back</option>
              <option value="write-through">write-through</option>
            </select>
          </label>
          {"shape" in full && (
            <p className={`m-0 text-[12.5px] text-[var(--coach-ink-muted)] ${MONO}`}>
              {full.shape.sets} sets · offset {full.shape.offsetBits} bits · index {full.shape.indexBits} bits
            </p>
          )}
        </div>

        {editable && (
          <div className="flex flex-col gap-1">
            <label htmlFor={traceId} className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
              The trace: R or W and an address, one per line
            </label>
            <textarea
              id={traceId}
              value={text}
              onChange={(e) => (setText(e.target.value), setShown(0))}
              spellCheck={false}
              rows={Math.min(10, Math.max(4, text.split("\n").length + 1))}
              className={`w-full resize-y rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-3 text-[13px] text-[var(--coach-code-ink)] outline-none focus-visible:border-[var(--coach-focus)] ${MONO}`}
            />
          </div>
        )}

        {!error && "results" in upTo && (
          <>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={shown >= trace.length}
                onClick={() => setShown(shown + 1)}
                className={`${btn} bg-[var(--coach-lime)] text-[var(--coach-lime-ink)] shadow-[0_2px_0_var(--coach-lime-shadow)]`}
              >
                <StepForward size={15} strokeWidth={2.4} aria-hidden /> Next access
              </button>
              <button type="button" disabled={shown >= trace.length} onClick={() => setShown(trace.length)} className={`${btn} border-2 border-[var(--coach-border-strong)]`}>
                <FastForward size={15} strokeWidth={2.4} aria-hidden /> All {trace.length}
              </button>
              <button
                type="button"
                onClick={() => setShown(0)}
                aria-label="Start the trace again"
                className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
              >
                <RotateCcw size={15} aria-hidden />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div className="min-w-0">
                <p className="m-0 mb-1 text-[13px] font-bold">Accesses ({shown} of {trace.length})</p>
                <div className="max-h-[260px] overflow-auto">
                  <table className={`w-full text-[12px] ${MONO}`}>
                    <thead>
                      <tr className="text-left text-[var(--coach-ink-muted)]">
                        <th className="pr-2 font-semibold">access</th>
                        <th className="pr-2 font-semibold">tag</th>
                        <th className="pr-2 font-semibold">set</th>
                        <th className="pr-2 font-semibold">off</th>
                        <th className="font-semibold">result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upTo.results
                        .map((r, i) => ({ r, i }))
                        .slice(-40)
                        .map(({ r, i }) => (
                          <tr key={i} className={i === shown - 1 ? "bg-[var(--coach-tint-blue-bg)]" : ""}>
                            <td className="pr-2 whitespace-nowrap">
                              {r.op} {hex(r.addr)}
                            </td>
                            <td className="pr-2">{hex(r.tag)}</td>
                            <td className="pr-2">{r.index}</td>
                            <td className="pr-2">{r.offset}</td>
                            <td className={`whitespace-nowrap ${r.hit ? "" : "font-bold text-[var(--coach-wrong-title)]"}`}>
                              {r.hit ? "hit" : `${r.miss} miss`}
                              {r.evicted ? `, evicts ${hex(r.evicted.tag)}${r.evicted.dirty ? " (dirty)" : ""}` : ""}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="min-w-0">
                <p className="m-0 mb-1 text-[13px] font-bold">Sets now</p>
                <SetsView config={config} trace={trace.slice(0, shown)} />
              </div>
            </div>
          </>
        )}

        {stats && (
          <dl className={`m-0 flex flex-wrap gap-x-5 gap-y-1 text-[13px] ${MONO}`}>
            {[
              ["accesses", stats.accesses],
              ["hit rate", stats.accesses ? `${(hitRate * 100).toFixed(1)}%` : "-"],
              ["compulsory", stats.misses.compulsory],
              ["capacity", stats.misses.capacity],
              ["conflict", stats.misses.conflict],
              [config.write === "write-back" ? "write-backs" : "memory writes", config.write === "write-back" ? stats.writebacks : stats.memoryWrites],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex gap-1.5">
                <dt className="text-[var(--coach-ink-muted)]">{k}</dt>
                <dd className="m-0 font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          error ? "bg-[var(--coach-wrong-soft)]" : met ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : ""
        }`}
      >
        {error
          ? error
          : goal
            ? met
              ? `The goal is met: ${missCount} misses, ${(hitRate * 100).toFixed(1)}% hits for the whole trace.`
              : `Not yet: the whole trace has ${missCount} misses (${(hitRate * 100).toFixed(1)}% hits).`
            : "Step through the accesses, or run them all. The totals are for the whole trace."}
      </p>
    </figure>
  );
}

/** Each set's lines after the accesses so far (tag, and D for dirty). */
function SetsView({ config, trace }: { config: CacheConfig; trace: Access[] }) {
  const r = simulate(config, trace);
  if ("error" in r) return null;
  const sets: ({ tag: number; dirty: boolean } | null)[][] = Array.from({ length: r.shape.sets }, () => new Array(config.ways).fill(null));
  const dirty = new Map<string, boolean>();
  for (const a of r.results) {
    const key = `${a.index}:${a.way}`;
    if (!a.hit) dirty.set(key, false);
    if (a.op === "W" && config.write === "write-back") dirty.set(key, true);
    sets[a.index][a.way] = { tag: a.tag, dirty: dirty.get(key) ?? false };
  }
  const visible = sets.slice(0, 32);
  return (
    <div className="max-h-[260px] overflow-auto">
      <table className={`text-[12px] ${MONO}`}>
        <tbody>
          {visible.map((ways, s) => (
            <tr key={s}>
              <th scope="row" className="pr-2 text-right font-normal text-[var(--coach-ink-muted)]">
                set {s}
              </th>
              {ways.map((l, w) => (
                <td key={w} className={`min-w-[64px] rounded px-1.5 py-[2px] ${l ? "bg-[var(--coach-tint-neutral-bg)]" : "text-[var(--coach-ink-muted)]"}`}>
                  {l ? `${hex(l.tag)}${l.dirty ? " D" : ""}` : "empty"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sets.length > visible.length && <p className="m-0 text-[11.5px] text-[var(--coach-ink-muted)]">and {sets.length - visible.length} more sets</p>}
    </div>
  );
}
