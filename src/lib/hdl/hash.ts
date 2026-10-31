import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Waves } from "./vcd";

/**
 * Real hardware designs used by lessons live in content/hdl/<id>/: Verilog files (.v or .sv) and an
 * optional meta.json. run.json holds what Icarus Verilog (simulation) or Yosys (synthesis or a formal
 * proof) actually printed, written by `npx tsx scripts/run-hdl.ts`; a test checks the hash, so a design
 * that changed but wasn't re-run fails.
 */
export const HDL_DIR = path.join(process.cwd(), "content", "hdl");
export const HDL_ID = /^[A-Za-z0-9-]+(\/[A-Za-z0-9-]+)*$/;

export type HdlMeta = {
  /**
   * "sim": compile with iverilog and run vvp. "synth": yosys synth and stat. "prove": yosys sat on the
   * asserts. "pnr": yosys synth_ice40, then nextpnr-ice40 places and routes it on an iCE40 HX1K.
   */
  tool?: "sim" | "synth" | "prove" | "pnr";
  /** Target clock in MHz for "pnr". */
  freq?: number;
  /** The top module (synthesis and proofs). */
  top?: string;
  /** Signals to show as a waveform (simulation; the testbench must $dumpfile("waves.vcd") and $dumpvars). */
  waves?: string[];
  /** Extra Yosys commands to run after synth, e.g. "abc -g AND,NAND,OR,NOR,XOR,XNOR,MUX". */
  yosys?: string;
};

export type HdlRun = {
  id: string;
  sourceHash: string;
  tool: "sim" | "synth" | "prove" | "pnr";
  versions: string;
  commands: string[];
  /** Messages from compiling or reading the design. */
  compile: { ok: boolean; messages: string };
  /** What the simulation printed, or the synthesis statistics, or the proof's result. */
  output: string;
  exitCode: number | null;
  waves: Waves | null;
  generated: string;
};

export function hdlFiles(id: string): { name: string; text: string }[] {
  const dir = path.join(HDL_DIR, id);
  return readdirSync(dir)
    .filter((f) => /\.s?v$/.test(f))
    .sort((a, b) => (a.startsWith("tb") ? 1 : b.startsWith("tb") ? -1 : a.localeCompare(b)))
    .map((name) => ({ name, text: readFileSync(path.join(dir, name), "utf8") }));
}

export function hdlMeta(id: string): HdlMeta {
  const p = path.join(HDL_DIR, id, "meta.json");
  return existsSync(p) ? (JSON.parse(readFileSync(p, "utf8")) as HdlMeta) : {};
}

/** Other inputs a design reads or was built from: memory images ($readmemh) and the sources they came from. */
export function hdlDataFiles(id: string): { name: string; text: string }[] {
  const dir = path.join(HDL_DIR, id);
  return readdirSync(dir)
    .filter((f) => /\.(hex|mem|c|S|ld)$/.test(f))
    .sort()
    .map((name) => ({ name, text: readFileSync(path.join(dir, name), "utf8") }));
}

export function hdlHash(id: string): string {
  return createHash("sha256")
    .update(JSON.stringify({ files: hdlFiles(id), data: hdlDataFiles(id), meta: hdlMeta(id) }))
    .digest("hex")
    .slice(0, 16);
}

export function allHdlIds(dir = HDL_DIR, prefix = ""): string[] {
  if (!existsSync(dir)) return [];
  const ids: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const id = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (readdirSync(path.join(dir, entry.name)).some((f) => /\.s?v$/.test(f))) ids.push(id);
    ids.push(...allHdlIds(path.join(dir, entry.name), id));
  }
  return ids.sort();
}
