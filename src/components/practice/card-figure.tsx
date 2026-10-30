import type { CSSProperties, ReactNode } from "react";
import { bitPatterns, groupBits, hexGroups, placeTerms, truthTable, type CardFigure } from "@/lib/practice/figures";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number) =>
  String(n)
    .split("")
    .map((d) => SUP[Number(d)])
    .join("");

/** Staggered entrance: item i appears a beat after item i-1, once the card has turned. */
const step = (i: number): CSSProperties => ({ "--i": i }) as CSSProperties;

function Caption({ children }: { children: ReactNode }) {
  return <p className="m-0 mt-3 text-[13px] leading-snug text-[var(--coach-ink-muted)]">{children}</p>;
}

function Bit({ value, i }: { value: string; i: number }) {
  const on = value === "1";
  return (
    <span
      style={step(i)}
      className={`fig-in flex size-9 items-center justify-center rounded-lg border-2 text-[15px] font-bold sm:size-10 ${MONO} ${
        on
          ? "border-[var(--coach-ink)] bg-[var(--coach-ink)] text-[var(--coach-bg)]"
          : "border-[var(--coach-border-strong)] bg-[var(--coach-surface)] text-[var(--coach-ink-muted)]"
      }`}
    >
      {value}
    </span>
  );
}

function BitsFigure({ bits, group, caption }: { bits: string; group?: number; caption?: string }) {
  let i = 0;
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {groupBits(bits, group ?? 0).map((g, gi) => (
          <div key={gi} className="flex gap-1.5">
            {g.split("").map((b, bi) => (
              <Bit key={bi} value={b} i={i++} />
            ))}
          </div>
        ))}
      </div>
      {caption ? <Caption>{caption}</Caption> : null}
    </div>
  );
}

function PatternsFigure({ n }: { n: number }) {
  const patterns = bitPatterns(n);
  return (
    <div>
      <div className="grid grid-cols-4 gap-1.5">
        {patterns.map((p, i) => (
          <span
            key={p}
            style={step(i)}
            className={`fig-in rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2 py-1.5 text-center text-[13.5px] font-semibold ${MONO}`}
          >
            {p}
          </span>
        ))}
      </div>
      <Caption>
        {n} bits → 2{sup(n)} = {patterns.length} patterns
      </Caption>
    </div>
  );
}

function PlacesFigure({ digits, base }: { digits: string; base: number }) {
  const { terms, total } = placeTerms(digits, base);
  return (
    <div className="flex flex-wrap items-end gap-2">
      {terms.map((t, i) => (
        <div key={i} style={step(i)} className="fig-in flex flex-col items-center gap-1">
          <span
            className={`flex size-10 items-center justify-center rounded-lg border-2 border-[var(--coach-ink)] text-[17px] font-bold ${MONO}`}
          >
            {t.digit}
          </span>
          <span className={`text-[12px] text-[var(--coach-ink-muted)] ${MONO}`}>
            ×{base}
            {sup(t.power)}
          </span>
          <span className={`text-[13.5px] font-semibold ${MONO}`}>{t.value}</span>
        </div>
      ))}
      <span
        style={step(terms.length)}
        className={`fig-in mb-0.5 ml-1 rounded-full bg-[var(--coach-lime)] px-3 py-1 text-[14px] font-bold text-[var(--coach-lime-ink)] ${MONO}`}
      >
        = {total}
      </span>
    </div>
  );
}

function HexFigure({ bits }: { bits: string }) {
  const groups = hexGroups(bits);
  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {groups.map((g, i) => (
          <div key={i} style={step(i * 2)} className="fig-in flex flex-col items-center gap-1.5">
            <span
              className={`rounded-lg border-2 border-[var(--coach-border-strong)] px-2.5 py-1 text-[14px] font-semibold ${MONO}`}
            >
              {g.bits}
            </span>
            <span aria-hidden className="text-[var(--coach-ink-muted)]">
              ↓
            </span>
            <span
              style={step(i * 2 + 1)}
              className={`fig-in flex size-10 items-center justify-center rounded-lg bg-[var(--coach-lime)] text-[18px] font-bold text-[var(--coach-lime-ink)] ${MONO}`}
            >
              {g.hex}
            </span>
          </div>
        ))}
      </div>
      <Caption>
        Four bits, one hex digit:{" "}
        <span className={`font-semibold text-[var(--coach-ink)] ${MONO}`}>0x{groups.map((g) => g.hex).join("")}</span>
      </Caption>
    </div>
  );
}

function TruthFigure({ gate }: { gate: Parameters<typeof truthTable>[0] }) {
  const table = truthTable(gate);
  const cell = `px-3 py-1.5 text-center ${MONO}`;
  return (
    <table className="border-separate border-spacing-0 text-[14px]">
      <thead>
        <tr>
          {table.inputs.map((h) => (
            <th
              key={h}
              className={`${cell} border-b-2 border-[var(--coach-border)] font-semibold text-[var(--coach-ink-muted)]`}
            >
              {h}
            </th>
          ))}
          {table.outputs.map((h) => (
            <th
              key={h}
              className={`${cell} border-b-2 border-l-2 border-[var(--coach-border)] font-semibold text-[var(--coach-ink)]`}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, i) => (
          <tr key={i} style={step(i)} className="fig-in">
            {row.in.map((v, j) => (
              <td key={j} className={`${cell} text-[var(--coach-ink-secondary)]`}>
                {v}
              </td>
            ))}
            {row.out.map((v, j) => (
              <td key={`o${j}`} className={`${cell} border-l-2 border-[var(--coach-border)] font-bold`}>
                <span
                  className={`inline-flex size-7 items-center justify-center rounded-md ${
                    v === 1 ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]" : "text-[var(--coach-ink-muted)]"
                  }`}
                >
                  {v}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function VoltageFigure() {
  const bands = [
    { label: "HIGH", reads: "reads as 1", cls: "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]" },
    {
      label: "Forbidden zone",
      reads: "never trusted",
      cls: "fig-hatch bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]",
    },
    { label: "LOW", reads: "reads as 0", cls: "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]" },
  ];
  return (
    <div className="flex gap-3">
      <div aria-hidden className="flex flex-col items-center text-[11px] text-[var(--coach-ink-muted)]">
        <span>5 V</span>
        <span className="my-1 w-0.5 flex-1 rounded-full bg-[var(--coach-border-strong)]" />
        <span>0 V</span>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {bands.map((b, i) => (
          <div
            key={b.label}
            style={step(i)}
            className={`fig-in flex items-center justify-between rounded-lg px-3 py-2.5 text-[13.5px] ${b.cls}`}
          >
            <span className="font-bold">{b.label}</span>
            <span>{b.reads}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CycleFigure({ steps }: { steps: string[] }) {
  return (
    <div>
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        {steps.map((s, i) => (
          <li key={s} style={step(i)} className="fig-in flex items-center gap-2">
            <span
              style={{ "--n": steps.length, "--k": i } as CSSProperties}
              className="fig-cycle rounded-full border-2 border-[var(--coach-ink)] px-3.5 py-1.5 text-[14px] font-bold"
            >
              {s}
            </span>
            <span aria-hidden className="text-[var(--coach-ink-muted)]">
              {i < steps.length - 1 ? "→" : "↻"}
            </span>
          </li>
        ))}
      </ol>
      <Caption>…then back to the start, for every instruction.</Caption>
    </div>
  );
}

/** The diagram on a flashcard's back. Every figure is real text (digits, labels, a table), so screen readers get it too. */
export function CardFigureView({ figure }: { figure: CardFigure }) {
  const body = (() => {
    switch (figure.type) {
      case "bits":
        return <BitsFigure bits={figure.bits} group={figure.group} caption={figure.caption} />;
      case "patterns":
        return <PatternsFigure n={figure.n} />;
      case "places":
        return <PlacesFigure digits={figure.digits} base={figure.base} />;
      case "hex":
        return <HexFigure bits={figure.bits} />;
      case "truth":
        return <TruthFigure gate={figure.gate} />;
      case "voltage":
        return <VoltageFigure />;
      case "cycle":
        return <CycleFigure steps={figure.steps} />;
    }
  })();
  return (
    <figure className="m-0 overflow-x-auto rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-4">
      {body}
    </figure>
  );
}
