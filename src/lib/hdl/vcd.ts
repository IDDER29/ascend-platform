/**
 * A small reader for VCD (value change dump) files, the waveform format Verilog simulators write with
 * $dumpfile / $dumpvars. It keeps the chosen signals' changes over time, ready to draw. Pure.
 */

export type Wave = {
  /** Full hierarchical name, e.g. "tb.dut.count". */
  name: string;
  width: number;
  /** Value changes in time order: [time, value], value as a binary string ("x" and "z" kept). */
  changes: [number, string][];
};

export type Waves = { timescale: string; end: number; waves: Wave[] };

export function parseVcd(text: string, wanted?: string[]): Waves {
  const lines = text.split("\n");
  const scope: string[] = [];
  const byId = new Map<string, Wave[]>();
  const waves: Wave[] = [];
  const taken = new Set<string>();
  let timescale = "";
  let time = 0;
  let i = 0;
  // Header: scopes, variables and the timescale, up to $enddefinitions.
  for (; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t.startsWith("$timescale")) {
      const inline = t.replace("$timescale", "").replace("$end", "").trim();
      timescale = inline || lines[i + 1].trim();
    } else if (t.startsWith("$scope")) {
      scope.push(t.split(/\s+/)[2]);
    } else if (t.startsWith("$upscope")) {
      scope.pop();
    } else if (t.startsWith("$var")) {
      const [, , width, id, ref] = t.split(/\s+/);
      const name = [...scope, ref].join(".");
      // Each wanted signal once: the first (outermost) variable with that name, usually the testbench's.
      const key = wanted?.find((n) => n === name || n === ref);
      if (!wanted || (key !== undefined && !taken.has(key))) {
        if (key !== undefined) taken.add(key);
        const w: Wave = { name, width: Number(width), changes: [] };
        waves.push(w);
        byId.set(id, [...(byId.get(id) ?? []), w]);
      }
    } else if (t.startsWith("$enddefinitions")) {
      i++;
      break;
    }
  }
  const set = (id: string, value: string) => {
    for (const w of byId.get(id) ?? []) {
      const last = w.changes[w.changes.length - 1];
      if (last && last[0] === time) last[1] = value;
      else if (!last || last[1] !== value) w.changes.push([time, value]);
    }
  };
  for (; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t || t.startsWith("$")) continue;
    if (t[0] === "#") time = Number(t.slice(1));
    else if (t[0] === "b" || t[0] === "r") {
      const [v, id] = t.slice(1).split(/\s+/);
      set(id, v);
    } else set(t.slice(1), t[0]);
  }
  if (wanted) waves.sort((a, b) => order(wanted, a) - order(wanted, b));
  return { timescale, end: time, waves };
}

const order = (wanted: string[], w: Wave) => {
  const i = wanted.findIndex((n) => n === w.name || w.name.endsWith(`.${n}`));
  return i < 0 ? wanted.length : i;
};

/** A value at a time, as the waveform would show it: binary for 1 bit, unsigned decimal when possible. */
export function valueAt(w: Wave, t: number): string {
  let v = "x";
  for (const [ct, cv] of w.changes) {
    if (ct > t) break;
    v = cv;
  }
  return v;
}

export function display(value: string, width: number): string {
  if (width === 1) return value;
  if (/[xz]/i.test(value)) return value.toLowerCase().includes("z") ? "z" : "x";
  return String(parseInt(value, 2));
}
