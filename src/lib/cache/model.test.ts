import assert from "node:assert/strict";
import { test } from "node:test";
import { parseTrace, shape, simulate, split, strided, type CacheConfig } from "./model";

const DM: CacheConfig = { sizeBytes: 256, lineBytes: 16, ways: 1, policy: "LRU", write: "write-back" };

function sim(c: CacheConfig, trace: Parameters<typeof simulate>[1]) {
  const r = simulate(c, trace);
  assert.ok(!("error" in r), "error" in r ? r.error : "");
  return r;
}

test("shape: sets, offset and index bits", () => {
  assert.deepEqual(shape(DM), { sets: 16, offsetBits: 4, indexBits: 4 });
  assert.deepEqual(shape({ ...DM, ways: 4 }), { sets: 4, offsetBits: 4, indexBits: 2 });
  assert.equal(shape({ ...DM, lineBytes: 24 }), "the line size must be a power of two");
});

test("an address splits into tag, index and offset", () => {
  const s = shape(DM);
  assert.ok(typeof s !== "string");
  assert.deepEqual(split(0x1234, s), { tag: 0x12, index: 3, offset: 4 });
});

test("a sequential walk misses once per line (spatial locality)", () => {
  const r = sim(DM, strided({ start: 0, stride: 4, count: 64 })); // 256 bytes = 16 lines
  assert.equal(r.stats.misses.compulsory, 16);
  assert.equal(r.stats.hits, 48);
});

test("two addresses that share a set thrash a direct-mapped cache, and two ways fix it", () => {
  const trace = strided({ start: 0, stride: 256, count: 2, repeat: 4 }); // 0 and 256: same index, different tag
  const dm = sim(DM, trace);
  assert.equal(dm.stats.hits, 0);
  assert.deepEqual(dm.stats.misses, { compulsory: 2, capacity: 0, conflict: 6 });
  const two = sim({ ...DM, ways: 2 }, trace);
  assert.equal(two.stats.hits, 6);
});

test("a working set bigger than the cache gives capacity misses", () => {
  const r = sim({ ...DM, ways: 16 }, strided({ start: 0, stride: 16, count: 20, repeat: 2 })); // 20 lines, room for 16
  assert.equal(r.stats.misses.compulsory, 20);
  assert.equal(r.stats.misses.capacity, 20); // LRU and a cyclic walk: every second-pass access misses
  assert.equal(r.stats.hits, 0);
});

test("LRU keeps the line just used; FIFO evicts the oldest arrival anyway", () => {
  const c: CacheConfig = { sizeBytes: 32, lineBytes: 16, ways: 2, policy: "LRU", write: "write-back" };
  const trace = [0, 16, 0, 32, 0].map((addr) => ({ op: "R" as const, addr }));
  assert.deepEqual(sim(c, trace).results.map((x) => x.hit), [false, false, true, false, true]);
  assert.deepEqual(sim({ ...c, policy: "FIFO" }, trace).results.map((x) => x.hit), [false, false, true, false, false]);
});

test("write-back writes dirty lines on eviction; write-through writes every store", () => {
  const trace = [
    { op: "W" as const, addr: 0 },
    { op: "W" as const, addr: 4 },
    { op: "R" as const, addr: 256 }, // evicts the dirty line at 0
  ];
  const wb = sim(DM, trace);
  assert.equal(wb.stats.writebacks, 1);
  assert.deepEqual(wb.results[2].evicted, { tag: 0, dirty: true });
  const wt = sim({ ...DM, write: "write-through" }, trace);
  assert.equal(wt.stats.memoryWrites, 2);
  assert.equal(wt.stats.writebacks, 0);
});

test("parseTrace reads R/W, hex and decimal, and names bad lines", () => {
  const p = parseTrace(["R 0x10", "W 32", "0x40  # a read", ""]);
  assert.deepEqual(p.ok ? p.trace : null, [
    { op: "R", addr: 16 },
    { op: "W", addr: 32 },
    { op: "R", addr: 64 },
  ]);
  const bad = parseTrace(["X 1"]);
  assert.equal(bad.ok ? 0 : bad.line, 1);
});
