/**
 * Branch predictors, for Computer Architect's Pipelining course. Each predicts a branch's direction
 * before it resolves, then learns from the real outcome:
 *  - "not-taken" / "taken": static guesses.
 *  - "1-bit": remembers the last outcome per table entry.
 *  - "2-bit": a saturating counter per entry (0, 1 predict not taken; 2, 3 predict taken), so one odd
 *    outcome doesn't flip the prediction.
 *  - "gshare": 2-bit counters indexed by the branch address XOR a global history of recent outcomes, so
 *    patterns (and correlations between branches) can be learned.
 * Pure and deterministic.
 */

export type PredictorKind = "not-taken" | "taken" | "1-bit" | "2-bit" | "gshare";
export type Branch = { pc: number; taken: boolean };
export type PredictorConfig = { kind: PredictorKind; entries: number; historyBits: number };

export type Prediction = {
  pc: number;
  taken: boolean;
  predicted: boolean;
  correct: boolean;
  /** The table entry used, and its state before and after the update (null for static predictors). */
  entry: number | null;
  before: number | null;
  after: number | null;
  history: number;
};

export function predict(config: PredictorConfig, trace: Branch[]): { results: Prediction[]; correct: number; accuracy: number } {
  const entries = Math.max(1, config.entries);
  const table = new Array<number>(entries).fill(config.kind === "1-bit" ? 0 : 1); // start weakly not taken
  const historyMask = (1 << Math.max(0, config.historyBits)) - 1;
  let history = 0;
  const results: Prediction[] = [];
  let correct = 0;
  for (const b of trace) {
    let predicted: boolean;
    let entry: number | null = null;
    let before: number | null = null;
    let after: number | null = null;
    if (config.kind === "not-taken" || config.kind === "taken") {
      predicted = config.kind === "taken";
    } else {
      const base = Math.floor(b.pc / 4);
      entry = (config.kind === "gshare" ? base ^ history : base) % entries;
      before = table[entry];
      if (config.kind === "1-bit") {
        predicted = before === 1;
        table[entry] = b.taken ? 1 : 0;
      } else {
        predicted = before >= 2;
        table[entry] = b.taken ? Math.min(3, before + 1) : Math.max(0, before - 1);
      }
      after = table[entry];
    }
    const ok = predicted === b.taken;
    if (ok) correct++;
    results.push({ pc: b.pc, taken: b.taken, predicted, correct: ok, entry, before, after, history });
    history = ((history << 1) | (b.taken ? 1 : 0)) & historyMask;
  }
  return { results, correct, accuracy: trace.length ? correct / trace.length : 0 };
}

/** One branch repeating a pattern of T and N: "TTTN" is a loop of 4 that exits on the 4th test. */
export function fromPattern(pc: number, pattern: string, repeat: number): Branch[] {
  const steps = pattern.toUpperCase().replace(/[^TN]/g, "").split("");
  const out: Branch[] = [];
  for (let r = 0; r < repeat; r++) for (const s of steps) out.push({ pc, taken: s === "T" });
  return out;
}

/** "0x40 T" or "64 N", one branch outcome per line; # starts a comment. */
export function parseBranches(lines: string[]): { ok: true; trace: Branch[] } | { ok: false; line: number; message: string } {
  const trace: Branch[] = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].replace(/#.*/, "").trim();
    if (!t) continue;
    const m = /^(0x[0-9a-fA-F]+|\d+)\s+([TtNn])$/.exec(t);
    if (!m) return { ok: false, line: i + 1, message: `"${t}" isn't a branch like 0x40 T` };
    trace.push({ pc: Number(m[1]), taken: m[2].toUpperCase() === "T" });
  }
  return { ok: true, trace };
}
