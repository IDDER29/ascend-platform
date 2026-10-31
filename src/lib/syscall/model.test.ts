import { test } from "node:test";
import assert from "node:assert/strict";
import { runSyscalls, syscallGoalMisses } from "./model";

function ok(src: string, start?: { disk?: Record<string, string> }) {
  const r = runSyscalls(src, start);
  assert.ok(r.ok, r.ok ? "" : r.error.message);
  return r;
}

test("writing to fd 1 shows text on the screen, through kernel mode and back", () => {
  const r = ok('write 1 "hi"\nexit 0');
  assert.equal(r.state.screen, "hi");
  assert.equal(r.state.results[1], 2);
  assert.equal(r.state.exitCode, 0);
  const layers = r.trace.filter((t) => t.line === 1).map((t) => `${t.layer}/${t.mode}`);
  assert.deepEqual(layers, ["app/user", "hardware/kernel", "kernel/kernel", "device/kernel", "hardware/user"]);
});

test("compute never leaves user mode", () => {
  const r = ok("compute adds two numbers");
  assert.deepEqual(r.trace.map((t) => t.mode), ["user"]);
});

test("a file write stays in RAM until close", () => {
  const r = ok('open "notes.txt"\nwrite 3 "ok"');
  assert.equal(r.state.results[1], 3);
  assert.equal(r.state.cache["notes.txt"], "ok");
  assert.equal(r.state.disk["notes.txt"], undefined);
  assert.deepEqual(syscallGoalMisses(r.state, { disk: { "notes.txt": "ok" } }), ['"notes.txt" is right in RAM but not on the disk yet']);
  const closed = ok('open "notes.txt"\nwrite 3 "ok"\nclose 3');
  assert.equal(closed.state.disk["notes.txt"], "ok");
  assert.deepEqual(syscallGoalMisses(closed.state, { disk: { "notes.txt": "ok" } }), []);
});

test("sync and exit both write cached files to disk", () => {
  assert.equal(ok('open "a"\nwrite 3 "x"\nsync').state.disk.a, "x");
  assert.equal(ok('open "a"\nwrite 3 "x"\nexit 0').state.disk.a, "x");
});

test("appending to an existing file, and reading it back", () => {
  const r = ok('open "log"\nwrite 3 "b"\nread 3\nclose 3', { disk: { log: "a" } });
  assert.equal(r.state.results[3], '"ab"');
  assert.equal(r.state.disk.log, "ab");
});

test("reading a file that is only on disk goes to the storage controller", () => {
  const r = ok('open "log"\nread 3', { disk: { log: "a" } });
  assert.ok(r.trace.some((t) => t.layer === "device" && /reads it from the disk/.test(t.text)));
});

test("the kernel refuses bad descriptors and bad addresses without stopping the app", () => {
  const r = ok('write 5 "x"\nwrite 1 @0x9000\nwrite 1 @0x4000\nclose 7\nexit 0');
  assert.equal(r.state.results[1], "error: bad file descriptor");
  assert.equal(r.state.results[2], "error: bad address");
  assert.equal(r.state.results[3], 2);
  assert.equal(r.state.screen, "hi");
  assert.equal(r.state.results[4], "error: bad file descriptor");
  assert.equal(r.state.exitCode, 0);
});

test("a privileged instruction in user mode stops the process, and nothing after it runs", () => {
  const r = ok('out 1 65\nwrite 1 "after"');
  assert.match(r.state.killed!, /privileged/);
  assert.equal(r.state.screen, "");
  assert.deepEqual(syscallGoalMisses(r.state, { notKilled: true }), ["the kernel stopped the program"]);
});

test("nothing runs after exit", () => {
  const r = ok('exit 3\nwrite 1 "late"');
  assert.equal(r.state.screen, "");
  assert.equal(r.state.exitCode, 3);
});

test("parse errors name the line, and comments and blank lines are skipped", () => {
  const r = runSyscalls('# hello\n\nwrite 1 hi');
  assert.deepEqual(r.ok ? null : r.error, { line: 3, message: '"write" is written wrongly here' });
  const u = runSyscalls("printf hi");
  assert.equal(u.ok ? null : u.error.line, 1);
});

test("goal misses for screen and exit", () => {
  const r = ok('write 1 "a"');
  assert.deepEqual(syscallGoalMisses(r.state, { screen: "ab", exit: 0 }), [
    'the screen should show "ab"',
    "the program should exit with code 0",
  ]);
});

test("each step carries what the screen, cache and disk look like after it", () => {
  const r = ok('open "a"\nwrite 3 "x"\nclose 3');
  const afterWrite = r.trace.filter((t) => t.line === 2).at(-1)!.after;
  assert.deepEqual(afterWrite, { screen: "", cache: { a: "x" }, disk: {} });
  const afterClose = r.trace.at(-1)!.after;
  assert.deepEqual(afterClose, { screen: "", cache: {}, disk: { a: "x" } });
  const shown = ok('write 1 "hi"').trace.find((t) => t.layer === "device")!.after;
  assert.equal(shown.screen, "hi");
});
