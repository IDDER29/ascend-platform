import type { CSSProperties, ReactNode } from "react";
import { hexBytes, structLayout, type Field, type MemoryCell } from "@/lib/practice/figures";

/** Diagrams for the Machine, C and Systems cards: memory, pointers, layouts, descriptors, processes. */

const MONO = "font-[family-name:var(--font-plex-mono)]";
const step = (i: number): CSSProperties => ({ "--i": i }) as CSSProperties;
/** Field colours, in order (also used for the legend), so neighbouring members never share one. */
const TINTS = [
  "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)] border-[var(--coach-tint-blue-ink)]",
  "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)] border-[var(--coach-tint-lime-ink)]",
  "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)] border-[var(--coach-tint-orange-ink)]",
];

function Caption({ children }: { children: ReactNode }) {
  return <p className="m-0 mt-3 text-[13px] leading-snug text-[var(--coach-ink-muted)]">{children}</p>;
}

/** Boxes at addresses; a pointer's box holds the address of the variable it points to (that row is ringed). */
export function MemoryFigure({ cells, caption }: { cells: MemoryCell[]; caption?: string }) {
  const targets = new Set(cells.map((c) => c.pointsTo).filter(Boolean));
  return (
    <div>
      <div className="flex flex-col gap-1.5">
        {cells.map((c, i) => (
          <div key={c.addr} style={step(i)} className="fig-in flex items-center gap-2.5">
            <span className={`w-[58px] shrink-0 text-right text-[12px] text-[var(--coach-ink-muted)] ${MONO}`}>
              {c.addr}
            </span>
            <span
              className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border-2 px-2.5 py-1.5 ${
                targets.has(c.name)
                  ? "border-[var(--coach-lime-shadow)] bg-[var(--coach-tint-lime-bg)]"
                  : "border-[var(--coach-border-strong)] bg-[var(--coach-surface)]"
              }`}
            >
              <span className={`text-[13px] font-semibold ${MONO}`}>{c.name}</span>
              <span className="flex items-center gap-1.5">
                <span className={`text-[14px] font-bold ${MONO}`}>{c.value}</span>
                {c.pointsTo ? (
                  <span
                    className={`whitespace-nowrap rounded-full bg-[var(--coach-lime)] px-1.5 py-0.5 text-[11.5px] font-semibold text-[var(--coach-lime-ink)] ${MONO}`}
                  >
                    → {c.pointsTo}
                  </span>
                ) : null}
              </span>
            </span>
          </div>
        ))}
      </div>
      {caption ? <Caption>{caption}</Caption> : null}
    </div>
  );
}

/** A byte ruler, and for each pointer type where p and p + 1 land. */
export function PtrStepFigure({ pointers }: { pointers: { label: string; size: number }[] }) {
  const bytes = 8;
  return (
    <div>
      <div className="grid w-full grid-cols-[auto_repeat(8,minmax(0,1fr))] gap-x-1 gap-y-2 text-center">
        <span />
        {Array.from({ length: bytes }, (_, b) => (
          <span key={b} className={`text-[10.5px] text-[var(--coach-ink-muted)] ${MONO}`}>
            +{b}
          </span>
        ))}
        {pointers.map((ptr, r) => (
          <Row key={ptr.label} ptr={ptr} r={r} bytes={bytes} />
        ))}
      </div>
      <Caption>
        p + 1 moves one whole element:{" "}
        {pointers.map((p) => `${p.size} byte${p.size === 1 ? "" : "s"} for ${p.label}`).join(", ")}.
      </Caption>
    </div>
  );
}

function Row({ ptr, r, bytes }: { ptr: { label: string; size: number }; r: number; bytes: number }) {
  return (
    <>
      <span className={`self-center whitespace-nowrap pr-1 text-left text-[12px] font-semibold ${MONO}`}>
        {ptr.label}
      </span>
      {Array.from({ length: bytes }, (_, b) => {
        const mark = b === 0 ? "p" : b === ptr.size ? "p+1" : null;
        return (
          <span
            key={b}
            style={step(r * bytes + b)}
            className={`fig-in flex h-9 min-w-0 items-center justify-center rounded-md border-2 text-[10px] font-bold ${MONO} ${
              mark === "p"
                ? "border-[var(--coach-ink)] bg-[var(--coach-ink)] text-[var(--coach-bg)]"
                : mark
                  ? "border-[var(--coach-lime-shadow)] bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]"
                  : b < ptr.size
                    ? "border-[var(--coach-border-strong)] bg-[var(--coach-well)]"
                    : "border-[var(--coach-border)] bg-[var(--coach-surface)]"
            }`}
          >
            {mark}
          </span>
        );
      })}
    </>
  );
}

/** Each byte of a struct (or union), coloured by member, padding hatched; the total underneath. */
export function LayoutFigure({ layouts }: { layouts: { title: string; fields: Field[]; union?: boolean }[] }) {
  return (
    <div className="flex flex-col gap-4">
      {layouts.map((l, li) => {
        const { fields, size, padding } = structLayout(l.fields, l.union);
        const rows = l.union ? fields.map((f) => [f]) : [fields];
        return (
          <div key={l.title}>
            <p className={`m-0 mb-1.5 text-[13px] font-semibold ${MONO}`}>
              {l.title} <span className="font-normal text-[var(--coach-ink-muted)]">· {size} bytes</span>
            </p>
            <div className="flex flex-col gap-1">
              {rows.map((row, ri) => (
                <div key={ri} className="flex gap-[2px]">
                  {Array.from({ length: size }, (_, b) => {
                    const f = row.find((m) => b >= m.offset && b < m.offset + m.size) ?? null;
                    const fi = f ? fields.indexOf(f) : -1;
                    const pad = !l.union && padding.includes(b);
                    return (
                      <span
                        key={b}
                        style={step(li * 12 + b)}
                        title={f ? `${f.type} ${f.name}` : pad ? "padding" : undefined}
                        className={`fig-in flex h-8 min-w-0 max-w-7 flex-1 items-center justify-center rounded border text-[11px] font-bold ${MONO} ${
                          f
                            ? TINTS[fi % TINTS.length]
                            : pad
                              ? "fig-hatch border-[var(--coach-border-strong)] text-[var(--coach-ink-muted)]"
                              : "border-transparent"
                        }`}
                      >
                        {f && b === f.offset ? f.name : ""}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <Caption>
        {layouts.some((l) => !l.union && structLayout(l.fields).padding.length > 0)
          ? "Hatched bytes are padding: the compiler skips them so each member starts at an address its size divides."
          : layouts.some((l) => l.union)
            ? "A struct gives each member its own bytes; a union's members all share the same ones."
            : "Each member gets its own bytes, one after another."}
      </Caption>
    </div>
  );
}

/** The memory map, high addresses at the top: stack grows down, heap grows up, into the gap. */
export function AddrSpaceFigure() {
  const regions = [
    { name: "Stack", note: "grows down ↓", cls: "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]" },
    { name: "free gap", note: "", cls: "fig-hatch bg-[var(--coach-well)] text-[var(--coach-ink-muted)] h-12" },
    { name: "Heap", note: "grows up ↑", cls: "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]" },
    { name: "BSS", note: "zeroed globals", cls: "bg-[var(--coach-tint-neutral-bg)]" },
    { name: "Data", note: "initialised globals", cls: "bg-[var(--coach-tint-neutral-bg)]" },
    { name: "Text", note: "the code", cls: "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]" },
  ];
  return (
    <div className="flex gap-3">
      <div aria-hidden className="flex flex-col items-center text-[11px] text-[var(--coach-ink-muted)]">
        <span>high</span>
        <span className="my-1 w-0.5 flex-1 rounded-full bg-[var(--coach-border-strong)]" />
        <span>low</span>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {regions.map((r, i) => (
          <div
            key={r.name}
            style={step(i)}
            className={`fig-in flex items-center justify-between rounded-lg px-3 py-2 text-[13.5px] ${r.cls}`}
          >
            <span className="font-bold">{r.name}</span>
            <span>{r.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Frames stacked downward; the newest is where the stack pointer is. */
export function FramesFigure({ frames }: { frames: { name: string; rows: string[] }[] }) {
  return (
    <div>
      <div className="flex flex-col gap-1.5">
        {frames.map((f, i) => {
          const newest = i === frames.length - 1;
          return (
            <div key={f.name} style={step(i)} className="fig-in flex items-stretch gap-2">
              <div
                className={`flex-1 rounded-lg border-2 px-3 py-2 ${
                  newest
                    ? "border-[var(--coach-ink)] bg-[var(--coach-surface)]"
                    : "border-[var(--coach-border-strong)] bg-[var(--coach-well)]"
                }`}
              >
                <p className={`m-0 text-[13px] font-bold ${MONO}`}>{f.name}</p>
                <ul className="m-0 mt-1 list-none p-0">
                  {f.rows.map((r) => (
                    <li key={r} className={`text-[12.5px] text-[var(--coach-ink-secondary)] ${MONO}`}>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <span className={`w-14 self-end pb-1 text-[12px] font-bold ${MONO}`}>
                {newest ? (
                  <span className="rounded-full bg-[var(--coach-lime)] px-1.5 py-0.5 text-[var(--coach-lime-ink)]">
                    ← SP
                  </span>
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
      <Caption>Each call adds a frame below; returning pops it, and the SP moves back up.</Caption>
    </div>
  );
}

/** One value's bytes at four addresses, little- and big-endian; the least significant byte is lime. */
export function EndianFigure({ value }: { value: string }) {
  const bytes = hexBytes(value);
  const least = bytes[bytes.length - 1];
  const orders = [
    { name: "Little-endian", bytes: [...bytes].reverse() },
    { name: "Big-endian", bytes },
  ];
  return (
    <div>
      <div className="grid w-full grid-cols-[auto_repeat(4,minmax(0,1fr))] gap-1.5 text-center">
        <span />
        {bytes.map((_, i) => (
          <span key={i} className={`text-[11px] text-[var(--coach-ink-muted)] ${MONO}`}>
            0x10{i}
          </span>
        ))}
        {orders.map((o, r) => (
          <Endian key={o.name} name={o.name} bytes={o.bytes} least={least} r={r} />
        ))}
      </div>
      <Caption>
        {value} stored at address 0x100. The least significant byte (<span className={MONO}>{least}</span>) is in lime.
      </Caption>
    </div>
  );
}

function Endian({ name, bytes, least, r }: { name: string; bytes: string[]; least: string; r: number }) {
  return (
    <>
      <span className="self-center pr-1 text-left text-[12px] leading-tight font-semibold">{name}</span>
      {bytes.map((b, i) => (
        <span
          key={i}
          style={step(r * 4 + i)}
          className={`fig-in rounded-md border-2 py-1.5 text-[13.5px] font-bold ${MONO} ${
            b === least
              ? "border-[var(--coach-lime-shadow)] bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]"
              : "border-[var(--coach-border-strong)] bg-[var(--coach-surface)]"
          }`}
        >
          {b}
        </span>
      ))}
    </>
  );
}

/** A process's file descriptor table. */
export function FdsFigure({
  rows,
  caption,
}: {
  rows: { fd: number; target: string; changed?: boolean; closed?: boolean }[];
  caption?: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-1.5">
        {rows.map((r, i) => (
          <div key={r.fd} style={step(i)} className="fig-in flex items-center gap-2.5">
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-md text-[14px] font-bold ${MONO} ${
                r.closed
                  ? "border-2 border-dashed border-[var(--coach-border-strong)] text-[var(--coach-ink-muted)]"
                  : "bg-[var(--coach-ink)] text-[var(--coach-bg)]"
              }`}
            >
              {r.fd}
            </span>
            <span aria-hidden className="text-[var(--coach-ink-muted)]">
              →
            </span>
            <span
              className={`flex-1 rounded-lg border-2 px-2.5 py-1.5 text-[13px] ${MONO} ${
                r.closed
                  ? "border-dashed border-[var(--coach-border)] text-[var(--coach-ink-muted)] line-through"
                  : r.changed
                    ? "border-[var(--coach-lime-shadow)] bg-[var(--coach-tint-lime-bg)] font-semibold"
                    : "border-[var(--coach-border-strong)] bg-[var(--coach-surface)]"
              }`}
            >
              {r.target}
            </span>
          </div>
        ))}
      </div>
      {caption ? <Caption>{caption}</Caption> : null}
    </div>
  );
}

/** fork(): one call, then two processes, each told something different. */
export function ForkFigure() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        style={step(0)}
        className={`fig-in rounded-lg border-2 border-[var(--coach-ink)] px-3 py-1.5 text-[13px] font-semibold ${MONO}`}
      >
        pid = fork();
      </span>
      <span aria-hidden style={step(1)} className="fig-in text-[var(--coach-ink-muted)]">
        ↙ ↘
      </span>
      <div className="grid w-full grid-cols-2 gap-2">
        {[
          { who: "Parent", got: "pid = 4243", note: "the child's PID" },
          { who: "Child (a copy)", got: "pid = 0", note: '"you\'re the child"' },
        ].map((p, i) => (
          <div
            key={p.who}
            style={step(i + 2)}
            className={`fig-in rounded-lg border-2 px-3 py-2 ${i === 0 ? "border-[var(--coach-tint-blue-ink)] bg-[var(--coach-tint-blue-bg)]" : "border-[var(--coach-tint-lime-ink)] bg-[var(--coach-tint-lime-bg)]"}`}
          >
            <p className="m-0 text-[13px] font-bold">{p.who}</p>
            <p className={`m-0 mt-0.5 text-[14px] font-bold ${MONO}`}>{p.got}</p>
            <p className="m-0 text-[12px] text-[var(--coach-ink-secondary)]">{p.note}</p>
          </div>
        ))}
      </div>
      <Caption>Both carry on from the line after fork(); the return value tells them apart.</Caption>
    </div>
  );
}

/** A pipe, top to bottom (it fits a portrait card): the writer's fds[1] → a bounded kernel buffer → the reader's fds[0]. */
export function PipeFigure() {
  const proc =
    "fig-in w-full rounded-lg border-2 border-[var(--coach-border-strong)] px-3 py-2 text-[13px] font-semibold";
  const arrow = "text-[var(--coach-ink-muted)] leading-none";
  return (
    <div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span style={step(0)} className={proc}>
          Writer <span className={`font-normal ${MONO}`}>write(fds[1], …)</span>
        </span>
        <span aria-hidden className={arrow}>
          ↓
        </span>
        <span
          style={step(1)}
          className="fig-in w-full rounded-lg bg-[var(--coach-code-bg)] px-3 py-2 text-[var(--coach-code-ink)]"
        >
          <span className="flex justify-center gap-1">
            {["h", "e", "l", "l", "o"].map((c, i) => (
              <span
                key={i}
                style={step(i + 2)}
                className={`fig-in rounded bg-[var(--coach-lime)] px-1.5 text-[12px] font-bold text-[var(--coach-lime-ink)] ${MONO}`}
              >
                {c}
              </span>
            ))}
          </span>
          <span className="mt-1 block text-[11.5px] text-[var(--coach-hero-muted)]">kernel buffer, about 64 KB</span>
        </span>
        <span aria-hidden className={arrow}>
          ↓
        </span>
        <span style={step(7)} className={proc}>
          Reader <span className={`font-normal ${MONO}`}>read(fds[0], …)</span>
        </span>
      </div>
      <Caption>
        One way only, first in first out. A full buffer makes write() wait; an empty one makes read() wait.
      </Caption>
    </div>
  );
}
