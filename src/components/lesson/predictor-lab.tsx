"use client";

import { useId, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { fromPattern, parseBranches, predict, type Branch, type PredictorKind } from "@/lib/predictor/model";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const hex = (n: number) => `0x${n.toString(16).toUpperCase()}`;

const KIND_NAME: Record<PredictorKind, string> = {
  "not-taken": "always not taken",
  taken: "always taken",
  "1-bit": "1-bit (last outcome)",
  "2-bit": "2-bit counter",
  gshare: "gshare (with history)",
};
const COUNTER_NAME = ["strongly not taken", "weakly not taken", "weakly taken", "strongly taken"];

type Pattern = { pc: number; pattern: string; repeat: number };

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * The Predictor Lab: a stream of branch outcomes through a branch predictor (src/lib/predictor/model.ts),
 * showing each guess, whether it was right, and the table entry's state. JSON-string props: kindJson
 * ('"2-bit"'), kindsJson (which predictors the learner may pick), entriesJson ('16'), historyJson ('4'),
 * patternJson ('{"pc":64,"pattern":"TTTN","repeat":10}') or traceJson (["0x40 T","0x80 N"]), and goalJson
 * ('{"minAccuracy":0.85}'). With `editable` the learner edits the outcomes.
 */
export function PredictorLab({
  caption,
  kindJson,
  kindsJson,
  entriesJson,
  historyJson,
  patternJson,
  traceJson,
  goalJson,
  editable = false,
}: {
  caption?: string;
  kindJson?: string;
  kindsJson?: string;
  entriesJson?: string;
  historyJson?: string;
  patternJson?: string;
  traceJson?: string;
  goalJson?: string;
  editable?: boolean;
}) {
  const kinds = parseJson<PredictorKind[]>(kindsJson, ["not-taken", "taken", "1-bit", "2-bit", "gshare"]);
  const [kind, setKind] = useState<PredictorKind>(parseJson<PredictorKind>(kindJson, kinds[0] ?? "2-bit"));
  const [entries, setEntries] = useState(parseJson<number>(entriesJson, 16));
  const [historyBits, setHistoryBits] = useState(parseJson<number>(historyJson, 4));
  const goal = parseJson<{ minAccuracy?: number } | null>(goalJson, null);
  const start = useMemo(() => {
    const p = parseJson<Pattern | null>(patternJson, null);
    return (p ? fromPattern(p.pc, p.pattern, p.repeat).map((b) => `${hex(b.pc)} ${b.taken ? "T" : "N"}`) : parseJson<string[]>(traceJson, [])).join("\n");
  }, [patternJson, traceJson]);
  const [text, setText] = useState(start);
  const traceId = useId();

  const parsed = useMemo(() => parseBranches(text.split("\n")), [text]);
  const trace = useMemo<Branch[]>(() => (parsed.ok ? parsed.trace : []), [parsed]);
  const r = useMemo(() => predict({ kind, entries, historyBits }, trace), [kind, entries, historyBits, trace]);
  const met = goal?.minAccuracy !== undefined && trace.length > 0 && r.accuracy >= goal.minAccuracy;
  const usesTable = kind !== "taken" && kind !== "not-taken";
  const select = "h-9 rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2 text-[13px]";

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="border-b-2 border-[var(--coach-border)] px-4 py-3 text-[15px] font-bold">{caption ?? "A branch predictor"}</figcaption>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-end gap-3 text-[12.5px]">
          {kinds.length > 1 && (
            <label className="flex flex-col gap-1 font-semibold text-[var(--coach-ink-secondary)]">
              predictor
              <select value={kind} onChange={(e) => setKind(e.target.value as PredictorKind)} className={select}>
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {KIND_NAME[k]}
                  </option>
                ))}
              </select>
            </label>
          )}
          {usesTable && (
            <label className="flex flex-col gap-1 font-semibold text-[var(--coach-ink-secondary)]">
              table entries
              <select value={entries} onChange={(e) => setEntries(Number(e.target.value))} className={`${select} ${MONO}`}>
                {[1, 4, 16, 64, 256].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}
          {kind === "gshare" && (
            <label className="flex flex-col gap-1 font-semibold text-[var(--coach-ink-secondary)]">
              history bits
              <select value={historyBits} onChange={(e) => setHistoryBits(Number(e.target.value))} className={`${select} ${MONO}`}>
                {[1, 2, 4, 6, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}
          {kinds.length === 1 && <p className="m-0 font-semibold">{KIND_NAME[kind]}</p>}
        </div>

        {editable && (
          <div className="flex flex-col gap-1">
            <label htmlFor={traceId} className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
              Branch outcomes: address and T (taken) or N (not taken), one per line
            </label>
            <textarea
              id={traceId}
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              rows={Math.min(10, Math.max(4, text.split("\n").length + 1))}
              className={`w-full resize-y rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-3 text-[13px] text-[var(--coach-code-ink)] outline-none focus-visible:border-[var(--coach-focus)] ${MONO}`}
            />
          </div>
        )}

        {parsed.ok && (
          <div className="max-h-[300px] overflow-auto">
            <table className={`w-full text-[12px] ${MONO}`}>
              <caption className="sr-only">Each branch, the guess and the outcome</caption>
              <thead>
                <tr className="text-left text-[var(--coach-ink-muted)]">
                  <th className="pr-2 font-semibold">#</th>
                  <th className="pr-2 font-semibold">branch</th>
                  <th className="pr-2 font-semibold">guess</th>
                  <th className="pr-2 font-semibold">real</th>
                  <th className="pr-2 font-semibold" />
                  {usesTable && <th className="font-semibold">entry: before, after</th>}
                </tr>
              </thead>
              <tbody>
                {r.results.map((p, i) => (
                  <tr key={i} className={p.correct ? "" : "bg-[var(--coach-wrong-soft)]"}>
                    <td className="pr-2 text-[var(--coach-ink-muted)]">{i + 1}</td>
                    <td className="pr-2">{hex(p.pc)}</td>
                    <td className="pr-2">{p.predicted ? "T" : "N"}</td>
                    <td className="pr-2">{p.taken ? "T" : "N"}</td>
                    <td className="pr-2">
                      {p.correct ? (
                        <Check size={13} strokeWidth={3} aria-label="right" />
                      ) : (
                        <X size={13} strokeWidth={3} className="text-[var(--coach-wrong-title)]" aria-label="wrong" />
                      )}
                    </td>
                    {usesTable && (
                      <td className="whitespace-nowrap">
                        {p.entry}: {kind === "1-bit" ? `${p.before ? "T" : "N"} → ${p.after ? "T" : "N"}` : `${COUNTER_NAME[p.before!]} → ${COUNTER_NAME[p.after!]}`}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          !parsed.ok ? "bg-[var(--coach-wrong-soft)]" : met ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : ""
        }`}
      >
        {!parsed.ok
          ? `Line ${parsed.line}: ${parsed.message}.`
          : `${r.correct} of ${trace.length} right: ${(r.accuracy * 100).toFixed(1)}%.${
              goal?.minAccuracy !== undefined ? (met ? " The goal is met." : ` The goal is ${(goal.minAccuracy * 100).toFixed(0)}% or better.`) : ""
            }`}
      </p>
    </figure>
  );
}
