"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import {
  MAX_BYTES,
  asRgb,
  asUtf8,
  asWord,
  bitwise,
  flipBit,
  parseByte,
  readByte,
  type BitOp,
} from "@/lib/byte-lab/model";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const PLACES = [128, 64, 32, 16, 8, 4, 2, 1];
const OPS: BitOp[] = ["AND", "OR", "XOR", "NOT", "SHL", "SHR"];
// Control characters (0 to 31, and 127) print as nothing, so the text reading shows them as dots.
const CONTROL = /[\u0000-\u001f\u007f]/g;
const CONTROL_TEST = /[\u0000-\u001f\u007f]/;

/**
 * The Byte Lab: bytes you can change bit by bit, read several ways at once (unsigned, signed, hex, ASCII,
 * UTF-8 text, a colour, a 16-bit word) with bitwise operations to try. Pass JSON strings (MDX drops
 * expression props): bytesJson='[72, 105]'. Readings come from `src/lib/byte-lab/model.ts`.
 */
export function ByteLab({ bytesJson, caption }: { bytesJson?: string; caption?: string }) {
  const initial = useMemo(() => {
    try {
      const parsed: unknown = bytesJson ? JSON.parse(bytesJson) : [0];
      const ok = Array.isArray(parsed) && parsed.length > 0 && parsed.every((b) => Number.isInteger(b) && b >= 0 && b <= 255);
      return ok ? (parsed as number[]).slice(0, MAX_BYTES) : [0];
    } catch {
      return [0];
    }
  }, [bytesJson]);

  const [bytes, setBytes] = useState<number[]>(initial);
  const [selected, setSelected] = useState(0);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [op, setOp] = useState<BitOp>("AND");
  const [operandText, setOperandText] = useState("0x0F");

  const sel = Math.min(selected, bytes.length - 1);
  const reading = readByte(bytes[sel]);
  const text = asUtf8(bytes);
  const colour = asRgb(bytes);
  const word = asWord(bytes);
  const operand = op === "NOT" ? 0 : parseByte(operandText);
  const result = operand === null ? null : bitwise(op, bytes[sel], operand);

  function setByte(i: number, value: number) {
    setBytes((bs) => bs.map((b, j) => (j === i ? value : b)));
  }

  function commitDraft(i: number) {
    const v = drafts[i] === undefined ? null : parseByte(drafts[i]);
    if (v !== null) setByte(i, v);
    setDrafts((d) => {
      const next = { ...d };
      delete next[i];
      return next;
    });
  }

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "The Byte Lab"}</span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setBytes((bs) => bs.slice(0, -1));
              setSelected((s) => Math.min(s, bytes.length - 2));
            }}
            disabled={bytes.length <= 1}
            aria-label="Remove the last byte"
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)] disabled:opacity-40"
          >
            <Minus size={15} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setBytes((bs) => [...bs, 0])}
            disabled={bytes.length >= MAX_BYTES}
            aria-label="Add a byte"
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)] disabled:opacity-40"
          >
            <Plus size={15} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => {
              setBytes(initial);
              setSelected(0);
              setDrafts({});
            }}
            aria-label="Reset the bytes"
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
          >
            <RotateCcw size={15} aria-hidden />
          </button>
        </span>
      </figcaption>

      {/* The bytes: click a bit to flip it, or type a value (65, 0x41, 0b1000001 or -1). */}
      <div className="flex flex-col gap-2 p-4">
        {bytes.map((byte, i) => {
          const r = readByte(byte);
          const isSel = i === sel;
          return (
            <div
              key={i}
              className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border-2 px-2.5 py-2 ${
                isSel ? "border-[var(--coach-ink)]" : "border-[var(--coach-border)]"
              }`}
              onFocusCapture={() => setSelected(i)}
              onClick={() => setSelected(i)}
            >
              <span className="w-[52px] shrink-0 text-[12px] font-semibold text-[var(--coach-ink-muted)]">byte {i + 1}</span>
              <span role="group" aria-label={`Bits of byte ${i + 1}`} className="flex gap-1">
                {PLACES.map((place, k) => {
                  const bit = 7 - k;
                  const on = (byte >> bit) & 1;
                  return (
                    <button
                      key={bit}
                      type="button"
                      aria-pressed={Boolean(on)}
                      aria-label={`Byte ${i + 1}, bit worth ${place}`}
                      onClick={() => setByte(i, flipBit(byte, bit))}
                      className={`flex h-9 w-7 flex-col items-center justify-center rounded-md text-[13px] font-bold ${MONO} ${
                        on
                          ? "bg-[var(--coach-ink)] text-[var(--coach-surface)]"
                          : "border-2 border-[var(--coach-border)] text-[var(--coach-ink-muted)]"
                      }`}
                    >
                      {on}
                    </button>
                  );
                })}
              </span>
              <label className="flex items-center gap-1.5 text-[12px] text-[var(--coach-ink-muted)]">
                <span className="sr-only">Value of byte {i + 1}</span>
                <input
                  value={drafts[i] ?? String(byte)}
                  onChange={(e) => setDrafts((d) => ({ ...d, [i]: e.target.value }))}
                  onBlur={() => commitDraft(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitDraft(i);
                  }}
                  inputMode="text"
                  className={`h-9 w-[84px] rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2 text-[14px] text-[var(--coach-ink)] outline-none focus-visible:border-[var(--coach-focus)] ${MONO}`}
                />
              </label>
              <span className={`text-[13px] text-[var(--coach-ink-secondary)] ${MONO}`}>
                0x{r.hex}
                {r.ascii !== null ? `  '${r.ascii}'` : ""}
              </span>
            </div>
          );
        })}
        <p className="m-0 text-[12px] text-[var(--coach-ink-muted)]">
          Click a bit to flip it, or type a value: 65, 0x41, 0b1000001, or a negative like -1.
        </p>
      </div>

      <div className="grid gap-4 border-t-2 border-[var(--coach-border)] p-4 sm:grid-cols-2">
        {/* One byte, read every way. */}
        <div>
          <p className="m-0 mb-1.5 text-[13px] font-bold">Byte {sel + 1}, read five ways</p>
          <dl className={`m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13.5px] ${MONO}`}>
            <dt className="text-[var(--coach-ink-muted)]">unsigned</dt>
            <dd className="m-0 font-bold">{reading.unsigned}</dd>
            <dt className="text-[var(--coach-ink-muted)]">signed</dt>
            <dd className="m-0 font-bold">{reading.signed}</dd>
            <dt className="text-[var(--coach-ink-muted)]">hex</dt>
            <dd className="m-0">0x{reading.hex}</dd>
            <dt className="text-[var(--coach-ink-muted)]">binary</dt>
            <dd className="m-0">
              {reading.bits.slice(0, 4)} {reading.bits.slice(4)}
            </dd>
            <dt className="text-[var(--coach-ink-muted)]">ASCII</dt>
            <dd className="m-0">{reading.ascii !== null ? `'${reading.ascii}'` : "not a printable character"}</dd>
          </dl>
        </div>

        {/* All the bytes together. */}
        <div>
          <p className="m-0 mb-1.5 text-[13px] font-bold">All {bytes.length === 1 ? "of it" : `${bytes.length} bytes`} together</p>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13.5px]">
            <dt className="text-[var(--coach-ink-muted)]">UTF-8 text</dt>
            <dd className={`m-0 ${MONO}`}>
              {text === null ? (
                "not valid UTF-8"
              ) : (
                <>
                  &quot;{text.replace(CONTROL, "·")}&quot;
                  {CONTROL_TEST.test(text) && (
                    <span className="ml-1.5 font-sans text-[12px] text-[var(--coach-ink-muted)]">· is an invisible control character</span>
                  )}
                </>
              )}
            </dd>
            <dt className="text-[var(--coach-ink-muted)]">colour</dt>
            <dd className="m-0 flex items-center gap-2">
              {colour ? (
                <>
                  <span
                    aria-hidden
                    className="inline-block size-5 rounded border-2 border-[var(--coach-border)]"
                    style={{ background: colour }}
                  />
                  <span className={MONO}>{colour}</span>
                  <span className="text-[12px] text-[var(--coach-ink-muted)]">from bytes 1 to 3</span>
                </>
              ) : (
                <span className="text-[var(--coach-ink-muted)]">needs 3 bytes</span>
              )}
            </dd>
            <dt className="text-[var(--coach-ink-muted)]">16-bit</dt>
            <dd className={`m-0 ${MONO}`}>
              {word ? (
                <>
                  {word.little} <span className="font-sans text-[12px] text-[var(--coach-ink-muted)]">low byte first</span>,{" "}
                  {word.big} <span className="font-sans text-[12px] text-[var(--coach-ink-muted)]">high byte first</span>
                </>
              ) : (
                <span className="font-sans text-[var(--coach-ink-muted)]">needs 2 bytes</span>
              )}
            </dd>
          </dl>
        </div>
      </div>

      {/* Try a bitwise operation on the selected byte. */}
      <div className="flex flex-wrap items-center gap-2 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[13.5px]">
        <span className="font-bold">Try</span>
        <span className={MONO}>byte {sel + 1}</span>
        <label>
          <span className="sr-only">Operation</span>
          <select
            value={op}
            onChange={(e) => setOp(e.target.value as BitOp)}
            className="h-9 rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2 text-[13.5px] text-[var(--coach-ink)]"
          >
            {OPS.map((o) => (
              <option key={o} value={o}>
                {o === "SHL" ? "shift left" : o === "SHR" ? "shift right" : o}
              </option>
            ))}
          </select>
        </label>
        {op !== "NOT" && (
          <label>
            <span className="sr-only">{op === "SHL" || op === "SHR" ? "Shift by" : "Mask"}</span>
            <input
              value={operandText}
              onChange={(e) => setOperandText(e.target.value)}
              className={`h-9 w-[84px] rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2 text-[14px] text-[var(--coach-ink)] ${MONO}`}
            />
          </label>
        )}
        <span aria-live="polite" className={MONO}>
          ={" "}
          {result === null ? (
            <span className="font-sans text-[var(--coach-ink-muted)]">type a byte</span>
          ) : (
            <>
              <b>{readByte(result).bits.slice(0, 4)} {readByte(result).bits.slice(4)}</b> ({result})
            </>
          )}
        </span>
        {result !== null && (
          <button
            type="button"
            onClick={() => setByte(sel, result)}
            className="ml-auto inline-flex h-9 items-center rounded-full bg-[var(--coach-lime)] px-3.5 text-[13.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_2px_0_var(--coach-lime-shadow)]"
          >
            Keep it
          </button>
        )}
      </div>
    </figure>
  );
}
