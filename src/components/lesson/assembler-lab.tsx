"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { assembleListing } from "@/lib/tiny-cpu/v2";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const hex2 = (n: number) => n.toString(16).toUpperCase().padStart(2, "0");

/** "0x0A", "0A", "10" (decimal) or "a" all mean the same address; null if it isn't a byte. */
function parseAddress(text: string): number | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;
  const n = /^0x[0-9a-f]{1,2}$/.test(t) ? parseInt(t, 16) : /^\d{1,3}$/.test(t) ? Number(t) : /^[0-9a-f]{1,2}$/.test(t) ? parseInt(t, 16) : NaN;
  return Number.isInteger(n) && n >= 0 && n <= 255 ? n : null;
}

/** Two bytes written in hex, like "08 02" or "0802"; null if that isn't two bytes. */
function parseBytes(text: string): [number, number] | null {
  const t = text.trim().replace(/0x/gi, "").replace(/\s+/g, "");
  if (!/^[0-9a-f]{4}$/i.test(t)) return null;
  return [parseInt(t.slice(0, 2), 16), parseInt(t.slice(2), 16)];
}

/**
 * The Assembler Lab: be the assembler. Pass one: give each instruction its address and each label its
 * address. Pass two: give each instruction its two bytes, in hex. Every answer is checked against the
 * real assembler (`assembleListing` in src/lib/tiny-cpu/v2.ts). JSON-string props: programJson, and
 * passJson ('1', '2' or 'both'; with '2' the addresses are given).
 */
export function AssemblerLab({ caption, programJson, passJson }: { caption?: string; programJson: string; passJson?: string }) {
  const pass = passJson === "1" || passJson === "2" ? passJson : "both";
  const listing = useMemo(() => {
    try {
      return { ok: true as const, ...assembleListing(JSON.parse(programJson) as string[]) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "This program can't be assembled." };
    }
  }, [programJson]);

  const [addr, setAddr] = useState<Record<number, string>>({});
  const [bytes, setBytes] = useState<Record<number, string>>({});
  const [labelAddr, setLabelAddr] = useState<Record<string, string>>({});

  if (!listing.ok) {
    return (
      <div className="not-prose my-6 rounded-2xl border-2 border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-soft)] p-4 text-[14px]">
        Assembler Lab: {listing.error}
      </div>
    );
  }

  const rows = listing.lines.map((l, i) => ({ ...l, i })).filter((l) => l.address !== null);
  const labels = Object.entries(listing.labels);
  const doPass1 = pass !== "2";
  const doPass2 = pass !== "1";

  const addrOk = (i: number, want: number) => parseAddress(addr[i] ?? "") === want;
  const bytesOk = (i: number, want: [number, number]) => {
    const got = parseBytes(bytes[i] ?? "");
    return got !== null && got[0] === want[0] && got[1] === want[1];
  };
  const labelOk = (name: string, want: number) => parseAddress(labelAddr[name] ?? "") === want;

  const p1Total = doPass1 ? rows.length + labels.length : 0;
  const p1Right = doPass1
    ? rows.filter((r) => addrOk(r.i, r.address!)).length + labels.filter(([n, a]) => labelOk(n, a)).length
    : 0;
  const p2Total = doPass2 ? rows.length : 0;
  const p2Right = doPass2 ? rows.filter((r) => bytesOk(r.i, r.bytes!)).length : 0;
  const solved = p1Right === p1Total && p2Right === p2Total;

  const mark = (filled: boolean, ok: boolean) =>
    !filled ? null : ok ? (
      <Check size={14} strokeWidth={3} className="inline" aria-label="right" />
    ) : (
      <X size={14} strokeWidth={3} className="inline text-[var(--coach-wrong-title)]" aria-label="not right yet" />
    );
  const field =
    "h-8 rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2 text-[13px] text-[var(--coach-ink)] outline-none focus-visible:border-[var(--coach-focus)]";

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "Be the assembler"}</span>
        <button
          type="button"
          onClick={() => {
            setAddr({});
            setBytes({});
            setLabelAddr({});
          }}
          aria-label="Clear your answers"
          className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
        >
          <RotateCcw size={15} aria-hidden />
        </button>
      </figcaption>

      <div className="overflow-x-auto p-4">
        <table className={`w-full border-separate border-spacing-y-1 text-[13px] ${MONO}`}>
          <caption className="sr-only">The program, one row per instruction</caption>
          <thead>
            <tr className="text-left text-[12px] text-[var(--coach-ink-muted)]">
              <th scope="col" className="pr-3 font-semibold">source</th>
              <th scope="col" className="pr-3 font-semibold">{doPass1 ? "address (pass one)" : "address"}</th>
              {doPass2 && <th scope="col" className="font-semibold">bytes, in hex (pass two)</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.i}>
                <td className="pr-3 whitespace-nowrap">{r.source.replace(/;.*/, "").trim()}</td>
                <td className="pr-3 whitespace-nowrap">
                  {doPass1 ? (
                    <>
                      <input
                        aria-label={`Address of ${r.source.trim()}`}
                        value={addr[r.i] ?? ""}
                        onChange={(e) => setAddr((a) => ({ ...a, [r.i]: e.target.value }))}
                        placeholder="0x.."
                        className={`${field} w-[68px] ${MONO}`}
                      />{" "}
                      {mark(Boolean(addr[r.i]), addrOk(r.i, r.address!))}
                    </>
                  ) : (
                    <span>0x{hex2(r.address!)}</span>
                  )}
                </td>
                {doPass2 && (
                  <td className="whitespace-nowrap">
                    <input
                      aria-label={`Bytes for ${r.source.trim()}`}
                      value={bytes[r.i] ?? ""}
                      onChange={(e) => setBytes((b) => ({ ...b, [r.i]: e.target.value }))}
                      placeholder=".. .."
                      className={`${field} w-[84px] ${MONO}`}
                    />{" "}
                    {mark(Boolean(bytes[r.i]), bytesOk(r.i, r.bytes!))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {doPass1 && labels.length > 0 && (
          <div className="mt-3">
            <p className="m-0 mb-1 text-[13px] font-bold">The label table</p>
            <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
              {labels.map(([name, a]) => (
                <li key={name} className={`flex items-center gap-1.5 text-[13px] ${MONO}`}>
                  <label htmlFor={`label-${name}`}>{name} =</label>
                  <input
                    id={`label-${name}`}
                    value={labelAddr[name] ?? ""}
                    onChange={(e) => setLabelAddr((l) => ({ ...l, [name]: e.target.value }))}
                    placeholder="0x.."
                    className={`${field} w-[68px] ${MONO}`}
                  />
                  {mark(Boolean(labelAddr[name]), labelOk(name, a))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          solved ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : ""
        }`}
      >
        {solved
          ? "Assembled: every address and byte matches the real assembler."
          : [
              doPass1 ? `Pass one: ${p1Right} of ${p1Total} right.` : null,
              doPass2 ? `Pass two: ${p2Right} of ${p2Total} right.` : null,
            ]
              .filter(Boolean)
              .join(" ")}
      </p>
    </figure>
  );
}
