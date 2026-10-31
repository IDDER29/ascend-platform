/**
 * Instruction scheduling on an idealised core, for Computer Architect's Advanced execution course: how
 * many cycles a block of instructions takes when issued in order or out of order, one or several per
 * cycle, with or without register renaming. Each instruction has a latency; it may issue once its sources
 * are ready (true dependences, read after write). Without renaming it must also wait for false
 * dependences: it may not overwrite a register an earlier instruction still has to read (write after
 * read) or will still write (write after write). Commit (retire) is in order. Fetch, branches and memory
 * ordering are left out on purpose. Pure and deterministic.
 */

export type OooInstr = { text: string; op: string; dest: number | null; srcs: number[]; latency: number; line: number };
export type OooOptions = {
  outOfOrder: boolean;
  /** Instructions issued per cycle. */
  width: number;
  /** Instructions in flight (issued or waiting) at once: the reorder buffer's size. */
  window: number;
  renaming: boolean;
  /** Instructions committed per cycle (default 4, as in many real cores). */
  commitWidth?: number;
};
export type Scheduled = {
  text: string;
  /** Cycle it starts executing, and the first cycle its result can be used. */
  issue: number;
  done: number;
  /** Cycle it commits, in program order. */
  commit: number;
  /** What it waited for, if anything, in words. */
  waited: string | null;
};
export type Schedule = { rows: Scheduled[]; cycles: number; ipc: number };

export const LATENCY: Record<string, number> = { add: 1, sub: 1, and: 1, or: 1, addi: 1, mul: 3, div: 10, lw: 3, fadd: 4, fmul: 5 };

/** "mul r1, r2, r3", "lw r4, 8(r1)", "addi r2, r2, 1": registers r0 to r31; r0 is never a dependency. */
export function parseBlock(lines: string[]): { ok: true; block: OooInstr[] } | { ok: false; line: number; message: string } {
  const block: OooInstr[] = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].replace(/#.*/, "").trim();
    if (!t) continue;
    const [mn, ...rest] = t.split(/\s+/);
    const op = mn.toLowerCase();
    if (LATENCY[op] === undefined) return { ok: false, line: i + 1, message: `"${mn}" isn't one of ${Object.keys(LATENCY).join(", ")}` };
    const regs = [...rest.join(" ").matchAll(/r(\d+)/g)].map((m) => Number(m[1]));
    if (regs.some((r) => r > 31)) return { ok: false, line: i + 1, message: "registers go from r0 to r31" };
    const need = op === "addi" || op === "lw" ? 2 : 3;
    if (regs.length !== need) return { ok: false, line: i + 1, message: `${op} takes ${need} registers` };
    const [d, ...s] = regs;
    block.push({ text: t.replace(/\s+/g, " "), op, dest: d === 0 ? null : d, srcs: s.filter((r) => r !== 0), latency: LATENCY[op], line: i + 1 });
  }
  return { ok: true, block };
}

export function schedule(block: OooInstr[], opts: OooOptions): Schedule {
  const n = block.length;
  const issue = new Array<number>(n).fill(0);
  const done = new Array<number>(n).fill(0);
  const commit = new Array<number>(n).fill(0);
  const waited: (string | null)[] = new Array(n).fill(null);
  const issuedAt = new Map<number, number>(); // cycle -> how many issued
  const commitsAt = new Map<number, number>(); // cycle -> how many committed
  const width = Math.max(1, opts.width);
  const window = Math.max(1, opts.window);

  for (let i = 0; i < n; i++) {
    const ins = block[i];
    let earliest = 1;
    let why: string | null = null;
    const bump = (c: number, reason: string) => {
      if (c > earliest) {
        earliest = c;
        why = reason;
      }
    };
    // True dependences: wait for the latest earlier writer of each source.
    for (const r of ins.srcs) {
      for (let p = i - 1; p >= 0; p--) {
        if (block[p].dest === r) {
          bump(done[p], `r${r} from ${block[p].text}`);
          break;
        }
      }
    }
    if (!opts.renaming && ins.dest !== null) {
      for (let p = i - 1; p >= 0; p--) {
        // Write after read: an earlier instruction must have read this register before we overwrite it.
        if (block[p].srcs.includes(ins.dest)) bump(issue[p], `r${ins.dest} still to be read by ${block[p].text}`);
        // Write after write: our write must land after the earlier one.
        if (block[p].dest === ins.dest) bump(done[p] - ins.latency + 1, `r${ins.dest} still to be written by ${block[p].text}`);
      }
    }
    if (!opts.outOfOrder && i > 0) bump(issue[i - 1], "in-order issue"); // no instruction issues before the one ahead of it
    if (i >= window) bump(commit[i - window] + 1, "the window is full"); // only `window` instructions in flight
    let c = earliest;
    while ((issuedAt.get(c) ?? 0) >= width) c++;
    if (c > earliest) why = "no free issue slot";
    issuedAt.set(c, (issuedAt.get(c) ?? 0) + 1);
    issue[i] = c;
    done[i] = c + ins.latency;
    // Commit in program order, at most commitWidth per cycle, once the result is ready.
    let k = Math.max(done[i], i > 0 ? commit[i - 1] : 0);
    while ((commitsAt.get(k) ?? 0) >= (opts.commitWidth ?? 4)) k++;
    commitsAt.set(k, (commitsAt.get(k) ?? 0) + 1);
    commit[i] = k;
    waited[i] = c > 1 && why ? why : null;
  }
  const rows = block.map((b, i) => ({ text: b.text, issue: issue[i], done: done[i], commit: commit[i], waited: waited[i] }));
  const cycles = n ? Math.max(...commit) : 0;
  return { rows, cycles, ipc: cycles ? n / cycles : 0 };
}
