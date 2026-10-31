import assert from "node:assert/strict";
import { test } from "node:test";
import { display, parseVcd, valueAt } from "./vcd";

const VCD = `$date today $end
$timescale
  1ns
$end
$scope module tb $end
$var reg 1 ! clk $end
$var wire 4 " count [3:0] $end
$scope module dut $end
$var wire 4 " count [3:0] $end
$upscope $end
$upscope $end
$enddefinitions $end
#0
$dumpvars
0!
b0000 "
$end
#5
1!
b0001 "
#10
0!
#15
1!
b0010 "
`;

test("reads the timescale, signals and their changes", () => {
  const w = parseVcd(VCD);
  assert.equal(w.timescale, "1ns");
  assert.equal(w.end, 15);
  assert.deepEqual(
    w.waves.map((x) => x.name),
    ["tb.clk", "tb.count", "tb.dut.count"],
  );
  assert.deepEqual(w.waves[0].changes, [
    [0, "0"],
    [5, "1"],
    [10, "0"],
    [15, "1"],
  ]);
  assert.deepEqual(w.waves[1].changes, [
    [0, "0000"],
    [5, "0001"],
    [15, "0010"],
  ]);
});

test("a wanted list picks signals and keeps their order", () => {
  const w = parseVcd(VCD, ["count", "clk"]);
  assert.deepEqual(
    w.waves.map((x) => x.name),
    ["tb.count", "tb.clk"],
  );
});

test("values at a time, shown in decimal", () => {
  const count = parseVcd(VCD).waves[1];
  assert.equal(display(valueAt(count, 12), 4), "1");
  assert.equal(display(valueAt(count, 15), 4), "2");
  assert.equal(display("1x01", 4), "x");
});
