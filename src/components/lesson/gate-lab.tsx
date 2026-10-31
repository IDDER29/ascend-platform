"use client";

import { useId, useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { chain, parseCircuit, runLab, type GateName } from "@/lib/gate-lab/model";

const MONO = "font-[family-name:var(--font-plex-mono)]";

type ChainConfig = {
  bits: number;
  /** Inputs that take one bit of a number each (like A and B). */
  perBit: string[];
  /** Inputs shared by every bit (like an operation code). */
  shared: string[];
  carryIn: string;
  carryOut: string;
  output: string;
  /** A shared input whose value is also the first bit's carry in (SUB needs a carry of 1). */
  firstCarryFrom?: string;
};

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * The Gate Lab: write a circuit as gate expressions, one wire per line ("SUM = A XOR B"), and see its
 * whole truth table, checked row by row against a target. Pass JSON strings (MDX drops expression props):
 * inputsJson='["A","B"]' outputsJson='["OUT"]' targetJson='{"OUT":"A XOR B"}' startJson='["OUT = A OR B"]'
 * allowJson='["NAND"]' maxGatesJson='4' (a gate budget). With chainJson, the one-bit circuit is also chained into a wider one (an ALU).
 */
export function GateLab({
  caption,
  inputsJson,
  outputsJson,
  targetJson,
  startJson,
  allowJson,
  chainJson,
  maxGatesJson,
}: {
  caption?: string;
  inputsJson: string;
  outputsJson: string;
  targetJson?: string;
  startJson?: string;
  allowJson?: string;
  chainJson?: string;
  maxGatesJson?: string;
}) {
  const inputs = useMemo(() => parseJson<string[]>(inputsJson, ["A", "B"]), [inputsJson]);
  const outputs = useMemo(() => parseJson<string[]>(outputsJson, ["OUT"]), [outputsJson]);
  const target = useMemo(() => parseJson<Record<string, string> | undefined>(targetJson, undefined), [targetJson]);
  const allow = useMemo(() => parseJson<GateName[] | undefined>(allowJson, undefined), [allowJson]);
  const maxGates = useMemo(() => parseJson<number | undefined>(maxGatesJson, undefined), [maxGatesJson]);
  const chainCfg = useMemo(() => parseJson<ChainConfig | undefined>(chainJson, undefined), [chainJson]);
  const start = useMemo(
    () => parseJson<string[]>(startJson, outputs.map((o) => `${o} = 0`)).join("\n"),
    [startJson, outputs],
  );

  const editorId = useId();
  const [source, setSource] = useState(start);
  const lines = useMemo(() => source.split("\n"), [source]);
  const result = useMemo(() => {
    try {
      return runLab({ inputs, outputs, lines, target, allow, maxGates });
    } catch (e) {
      return { ok: false as const, line: 0, message: e instanceof Error ? e.message : "This lab is set up wrongly." };
    }
  }, [lines, inputs, outputs, target, allow, maxGates]);

  const matching = result.ok ? result.rows.filter((r) => r.ok).length : 0;
  const status = !result.ok
    ? { tone: "error", text: `Line ${result.line}: ${result.message}.` }
    : !target
      ? { tone: "info", text: "Every row of your circuit's truth table." }
      : result.solved
        ? { tone: "good", text: `Solved: every row matches, with ${result.gates.total} ${result.gates.total === 1 ? "gate" : "gates"}.` }
        : result.missing.length > 0
          ? { tone: "info", text: `Still to define: ${result.missing.join(", ")}.` }
          : result.disallowed.length > 0
            ? { tone: "error", text: `This lab only allows ${allow!.join(", ")}; you used ${result.disallowed.join(", ")}.` }
            : result.overBudget > 0 && matching === result.rows.length
              ? { tone: "info", text: `Every row matches, but with ${result.gates.total} gates: the budget is ${maxGates}.` }
              : { tone: "info", text: `${matching} of ${result.rows.length} rows match.` };

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "The Gate Lab"}</span>
        <span className="flex items-center gap-2 text-[12.5px] text-[var(--coach-ink-muted)]">
          {allow ? <span>Only {allow.join(", ")}</span> : null}
          {maxGates !== undefined ? <span>At most {maxGates} gates</span> : null}
          <button
            type="button"
            onClick={() => setSource(start)}
            aria-label="Reset the circuit"
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)] text-[var(--coach-ink)]"
          >
            <RotateCcw size={15} aria-hidden />
          </button>
        </span>
      </figcaption>

      <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={editorId} className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
            Your circuit: one wire per line, NAME = expression
          </label>
          <textarea
            id={editorId}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            rows={Math.max(4, lines.length + 1)}
            className={`w-full resize-y rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-3 text-[13.5px] leading-relaxed text-[var(--coach-code-ink)] outline-none focus-visible:border-[var(--coach-focus)] ${MONO}`}
          />
          <p className="m-0 text-[12px] leading-snug text-[var(--coach-ink-muted)]">
            Inputs: <span className={MONO}>{inputs.join(", ")}</span>. Outputs:{" "}
            <span className={MONO}>{outputs.join(", ")}</span>. Gates: NOT, AND, OR, XOR, NAND, NOR, and brackets. Any
            other name is a wire you can use on later lines.
          </p>
          {result.ok && (
            <p className="m-0 text-[12.5px] text-[var(--coach-ink-secondary)]">
              Gates used: <b>{result.gates.total}</b>
              {result.gates.total > 0 &&
                ` (${Object.entries(result.gates.byGate)
                  .map(([g, n]) => `${n} ${g}`)
                  .join(", ")})`}
              {result.gates.total > 0 && (
                <>
                  . Longest path: <b>{result.depth}</b> {result.depth === 1 ? "gate" : "gates"}
                </>
              )}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          {result.ok ? (
            <table className={`w-full border-separate border-spacing-0 text-center text-[13px] ${MONO}`}>
              <caption className="sr-only">Truth table</caption>
              <thead>
                <tr className="text-[12px] text-[var(--coach-ink-muted)]">
                  {inputs.map((n) => (
                    <th key={n} scope="col" className="px-1.5 py-1 font-semibold">
                      {n}
                    </th>
                  ))}
                  {outputs.map((n) => (
                    <th key={n} scope="col" className="border-l-2 border-[var(--coach-border)] px-1.5 py-1 font-bold text-[var(--coach-ink)]">
                      {n}
                    </th>
                  ))}
                  {target && (
                    <th scope="col" className="px-1.5 py-1">
                      <span className="sr-only">Matches the target</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r, i) => (
                  <tr key={i} className={target && !r.ok ? "bg-[var(--coach-wrong-soft)]" : ""}>
                    {inputs.map((n) => (
                      <td key={n} className="px-1.5 py-[3px] text-[var(--coach-ink-secondary)]">
                        {r.inputs[n]}
                      </td>
                    ))}
                    {outputs.map((n) => (
                      <td key={n} className="border-l-2 border-[var(--coach-border)] px-1.5 py-[3px] font-bold">
                        {r.outputs[n]}
                        {r.want && r.want[n] !== r.outputs[n] ? (
                          <span className="ml-1 text-[11px] font-normal text-[var(--coach-ink-muted)]">want {r.want[n]}</span>
                        ) : null}
                      </td>
                    ))}
                    {target && (
                      <td className="px-1.5 py-[3px]">
                        {r.ok ? (
                          <Check size={14} strokeWidth={3} className="inline text-[var(--coach-ink)]" aria-label="matches" />
                        ) : (
                          <X size={14} strokeWidth={3} className="inline text-[var(--coach-wrong-title)]" aria-label="doesn't match" />
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="m-0 text-[13px] text-[var(--coach-ink-muted)]">Fix the line above to see the truth table.</p>
          )}
        </div>
      </div>

      {chainCfg && result.ok && <ChainPanel cfg={chainCfg} lines={lines} inputs={inputs} target={target} outputs={outputs} />}

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          status.tone === "good"
            ? "bg-[var(--coach-tint-lime-bg)] font-semibold"
            : status.tone === "error"
              ? "bg-[var(--coach-wrong-soft)]"
              : ""
        }`}
      >
        {status.text}
      </p>
    </figure>
  );
}

/** The one-bit circuit chained into a wider one, run on whole numbers, next to what the target gives. */
function ChainPanel({
  cfg,
  lines,
  inputs,
  outputs,
  target,
}: {
  cfg: ChainConfig;
  lines: string[];
  inputs: string[];
  outputs: string[];
  target?: Record<string, string>;
}) {
  const [numbers, setNumbers] = useState<Record<string, number>>(Object.fromEntries(cfg.perBit.map((n, i) => [n, i === 0 ? 28 : 14])));
  const [shared, setShared] = useState<Record<string, number>>(Object.fromEntries(cfg.shared.map((n) => [n, 0])));
  const max = (1 << cfg.bits) - 1;

  const run = (src: string[]) => {
    const parsed = parseCircuit(src, inputs);
    if (!parsed.ok) return null;
    return chain(parsed.circuit, {
      bits: cfg.bits,
      perBit: numbers,
      shared,
      carryIn: cfg.carryIn,
      carryOut: cfg.carryOut,
      output: cfg.output,
      firstCarry: cfg.firstCarryFrom ? (shared[cfg.firstCarryFrom] ?? 0) : 0,
    });
  };
  const mine = run(lines);
  const want = target ? run(outputs.map((o) => `${o} = ${target[o] ?? "0"}`)) : null;
  const bits = (v: number) => v.toString(2).padStart(cfg.bits, "0");

  return (
    <div className="flex flex-col gap-3 border-t-2 border-[var(--coach-border)] p-4">
      <p className="m-0 text-[13px] font-bold">
        {cfg.bits} copies of your circuit, chained: each bit&apos;s {cfg.carryOut} feeds the next bit&apos;s {cfg.carryIn}
      </p>
      <div className="flex flex-wrap items-end gap-3 text-[13px]">
        {cfg.perBit.map((n) => (
          <label key={n} className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold text-[var(--coach-ink-secondary)]">{n} (0 to {max})</span>
            <input
              type="number"
              min={0}
              max={max}
              value={numbers[n]}
              onChange={(e) => setNumbers((v) => ({ ...v, [n]: Math.max(0, Math.min(max, Number(e.target.value) || 0)) }))}
              className={`h-9 w-[90px] rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2 text-[14px] text-[var(--coach-ink)] ${MONO}`}
            />
          </label>
        ))}
        {cfg.shared.map((n) => (
          <label key={n} className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold text-[var(--coach-ink-secondary)]">{n}</span>
            <select
              value={shared[n]}
              onChange={(e) => setShared((v) => ({ ...v, [n]: Number(e.target.value) }))}
              className="h-9 rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2 text-[14px] text-[var(--coach-ink)]"
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </label>
        ))}
      </div>
      <dl className={`m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13.5px] ${MONO}`}>
        <dt className="text-[var(--coach-ink-muted)]">yours</dt>
        <dd className="m-0 font-bold">
          {mine ? `${mine.value}  (${bits(mine.value)}), ${cfg.carryOut} = ${mine.carryOut}` : "fix your circuit first"}
        </dd>
        {want && (
          <>
            <dt className="text-[var(--coach-ink-muted)]">target</dt>
            <dd className="m-0">
              {want.value} ({bits(want.value)}), {cfg.carryOut} = {want.carryOut}
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}
