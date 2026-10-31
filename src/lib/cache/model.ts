/**
 * A set-associative cache, for Computer Architect's Caches course. Addresses are split into tag, index and
 * offset; each access is a hit or a miss, and each miss is classified with the "3 Cs": compulsory (the
 * first touch of that line), capacity (a fully associative LRU cache of the same size would miss too), or
 * conflict (it would have hit there: the set was too small). Writes follow write-back (dirty lines are
 * written to memory on eviction) or write-through (every write goes to memory), both write-allocate.
 * Pure and deterministic.
 */

export type Policy = "LRU" | "FIFO";
export type WritePolicy = "write-back" | "write-through";
export type CacheConfig = { sizeBytes: number; lineBytes: number; ways: number; policy: Policy; write: WritePolicy };
export type Access = { op: "R" | "W"; addr: number };
export type MissKind = "compulsory" | "capacity" | "conflict";

export type AccessResult = {
  op: "R" | "W";
  addr: number;
  tag: number;
  index: number;
  offset: number;
  hit: boolean;
  miss: MissKind | null;
  /** The line that was evicted to make room, if any. */
  evicted: { tag: number; dirty: boolean } | null;
  way: number;
};

export type CacheStats = {
  accesses: number;
  hits: number;
  misses: Record<MissKind, number>;
  /** Lines written back to memory because they were dirty when evicted (write-back). */
  writebacks: number;
  /** Writes that went straight to memory (write-through). */
  memoryWrites: number;
};

export type CacheShape = { sets: number; offsetBits: number; indexBits: number };

const isPow2 = (n: number) => Number.isInteger(n) && n > 0 && (n & (n - 1)) === 0;

/** The cache's shape, or a reason it can't exist. */
export function shape(c: CacheConfig): CacheShape | string {
  if (!isPow2(c.lineBytes)) return "the line size must be a power of two";
  if (!isPow2(c.ways)) return "the number of ways must be a power of two";
  if (!isPow2(c.sizeBytes)) return "the cache size must be a power of two";
  if (c.lineBytes * c.ways > c.sizeBytes) return "the cache must hold at least one set";
  const sets = c.sizeBytes / (c.lineBytes * c.ways);
  return { sets, offsetBits: Math.log2(c.lineBytes), indexBits: Math.log2(sets) };
}

export function split(addr: number, s: CacheShape) {
  const offset = addr & ((1 << s.offsetBits) - 1);
  const index = (addr >>> s.offsetBits) & ((1 << s.indexBits) - 1);
  const tag = Math.floor(addr / 2 ** (s.offsetBits + s.indexBits));
  return { tag, index, offset };
}

type Line = { tag: number; dirty: boolean; stamp: number };

export function simulate(config: CacheConfig, trace: Access[]): { results: AccessResult[]; stats: CacheStats; shape: CacheShape } | { error: string } {
  const s = shape(config);
  if (typeof s === "string") return { error: s };
  const sets: (Line | null)[][] = Array.from({ length: s.sets }, () => new Array<Line | null>(config.ways).fill(null));
  const seen = new Set<number>();
  // The reference for capacity misses: a fully associative LRU cache with the same number of lines.
  const capacity = config.sizeBytes / config.lineBytes;
  const full = new Map<number, number>(); // line number -> last use
  const stats: CacheStats = { accesses: 0, hits: 0, misses: { compulsory: 0, capacity: 0, conflict: 0 }, writebacks: 0, memoryWrites: 0 };
  const results: AccessResult[] = [];

  trace.forEach((a, time) => {
    const { tag, index, offset } = split(a.addr, s);
    const lineNo = Math.floor(a.addr / config.lineBytes);
    const set = sets[index];
    let way = set.findIndex((l) => l !== null && l.tag === tag);
    const hit = way >= 0;

    const fullHit = full.has(lineNo);
    full.set(lineNo, time);
    if (full.size > capacity) {
      let oldest = -1;
      let at = Infinity;
      for (const [k, t] of full) if (t < at) [oldest, at] = [k, t];
      full.delete(oldest);
    }

    let miss: MissKind | null = null;
    let evicted: AccessResult["evicted"] = null;
    if (hit) {
      stats.hits++;
      if (config.policy === "LRU") set[way]!.stamp = time;
    } else {
      miss = !seen.has(lineNo) ? "compulsory" : fullHit ? "conflict" : "capacity";
      stats.misses[miss]++;
      way = set.findIndex((l) => l === null);
      if (way < 0) {
        // Evict the line used least recently (LRU) or brought in first (FIFO): both keep that time in stamp.
        way = 0;
        for (let w = 1; w < set.length; w++) if (set[w]!.stamp < set[way]!.stamp) way = w;
        const victim = set[way]!;
        evicted = { tag: victim.tag, dirty: victim.dirty };
        if (victim.dirty) stats.writebacks++;
      }
      set[way] = { tag, dirty: false, stamp: time };
    }
    seen.add(lineNo);
    if (a.op === "W") {
      if (config.write === "write-back") set[way]!.dirty = true;
      else stats.memoryWrites++;
    }
    stats.accesses++;
    results.push({ op: a.op, addr: a.addr, tag, index, offset, hit, miss, evicted, way });
  });
  return { results, stats, shape: s };
}

/** "R 0x1f0", "W 64" or just "0x40" (a read), one per line; # starts a comment. */
export function parseTrace(lines: string[]): { ok: true; trace: Access[] } | { ok: false; line: number; message: string } {
  const trace: Access[] = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].replace(/#.*/, "").trim();
    if (!t) continue;
    const m = /^(?:([RrWw])\s+)?(0x[0-9a-fA-F]+|\d+)$/.exec(t);
    if (!m) return { ok: false, line: i + 1, message: `"${t}" isn't an access like R 0x40 or W 128` };
    const addr = Number(m[2]);
    if (addr > 0xffffffff) return { ok: false, line: i + 1, message: "addresses go up to 0xFFFFFFFF" };
    trace.push({ op: (m[1] ?? "R").toUpperCase() as "R" | "W", addr });
  }
  return { ok: true, trace };
}

/** A strided walk, repeated: what a loop over an array produces. */
export function strided(p: { start: number; stride: number; count: number; repeat?: number; op?: "R" | "W" }): Access[] {
  const out: Access[] = [];
  for (let r = 0; r < (p.repeat ?? 1); r++) for (let i = 0; i < p.count; i++) out.push({ op: p.op ?? "R", addr: p.start + i * p.stride });
  return out;
}
