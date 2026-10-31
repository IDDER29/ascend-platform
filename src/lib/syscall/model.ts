/**
 * A teaching model of a program asking an operating system for services (the blueprint's P8-X). It is a
 * visualisation, not a kernel: each call becomes an auditable trace of who does what (the app in user
 * mode, the hardware switching modes, the kernel checking and acting, a device doing the work) so a
 * learner can see where the protection boundary is. Pure and deterministic.
 *
 * The program is one call per line:
 *   compute <words>          work the app does by itself, in user mode
 *   open "name"              open (or create) a file; returns a file descriptor (3, 4, ...)
 *   write <fd> "text"        fd 1 is the screen; a file fd adds to the end of the kernel's cache of it
 *   write <fd> @<hex>        pass a buffer address instead of text (checked against the app's memory)
 *   read <fd>                read a file's whole contents into the app
 *   close <fd>               close a file: its cached data is written to the disk (a simplification:
 *                            real kernels write it back later; only sync or fsync forces it)
 *   sync                     write every cached file to the disk now
 *   out <port> <value>       a privileged I/O instruction tried directly from user mode
 *   exit <code>              end the process
 * Blank lines and lines starting with # are ignored.
 */

export type Layer = "app" | "hardware" | "kernel" | "device";
export type Mode = "user" | "kernel";
/** What the learner can see after a step: the screen, the kernel's RAM cache of files, and the disk. */
export type Snapshot = { screen: string; cache: Record<string, string>; disk: Record<string, string> };
export type TraceStep = { line: number; layer: Layer; mode: Mode; text: string; after: Snapshot };

export type SyscallState = {
  /** What the display shows. */
  screen: string;
  /** Files as they are on the disk (what survives a power cut). */
  disk: Record<string, string>;
  /** Files as the kernel holds them in RAM, written to the disk on close or sync. */
  cache: Record<string, string>;
  /** Open file descriptors, by number. */
  fds: Record<number, string>;
  /** The return value of each call, by line. */
  results: Record<number, number | string>;
  exitCode: number | null;
  /** Why the kernel stopped the process, if it did. */
  killed: string | null;
};

export type SyscallRun =
  | { ok: true; trace: TraceStep[]; state: SyscallState }
  | { ok: false; error: { line: number; message: string } };

/** The app's own memory, as the kernel sees it: buffers must be inside it. */
export const APP_MEMORY = { start: 0x4000, end: 0x7fff };
/** What is stored at the app's buffer addresses: only one, for the write @address case. */
const APP_BUFFER = { address: 0x4000, text: "hi" };

type Call =
  | { op: "compute"; what: string }
  | { op: "open"; name: string }
  | { op: "write"; fd: number; text: string }
  | { op: "write-addr"; fd: number; address: number }
  | { op: "read"; fd: number }
  | { op: "close"; fd: number }
  | { op: "sync" }
  | { op: "out"; port: number; value: number }
  | { op: "exit"; code: number };

function parseLine(raw: string): Call | string {
  const t = raw.trim();
  let m: RegExpMatchArray | null;
  if ((m = t.match(/^compute\s+(.+)$/))) return { op: "compute", what: m[1] };
  if ((m = t.match(/^open\s+"([A-Za-z0-9._-]{1,24})"$/))) return { op: "open", name: m[1] };
  if ((m = t.match(/^write\s+(\d+)\s+"([^"]*)"$/))) return { op: "write", fd: Number(m[1]), text: m[2] };
  if ((m = t.match(/^write\s+(\d+)\s+@0x([0-9a-fA-F]{1,8})$/))) return { op: "write-addr", fd: Number(m[1]), address: parseInt(m[2], 16) };
  if ((m = t.match(/^read\s+(\d+)$/))) return { op: "read", fd: Number(m[1]) };
  if ((m = t.match(/^close\s+(\d+)$/))) return { op: "close", fd: Number(m[1]) };
  if (t === "sync") return { op: "sync" };
  if ((m = t.match(/^out\s+(\d+)\s+(\d+)$/))) return { op: "out", port: Number(m[1]), value: Number(m[2]) };
  if ((m = t.match(/^exit\s+(\d+)$/))) return { op: "exit", code: Number(m[1]) };
  const word = t.split(/\s+/)[0];
  if (["open", "write", "read", "close", "out", "exit", "compute"].includes(word)) return `"${word}" is written wrongly here`;
  return `"${word}" isn't a call this model knows (try open, write, read, close, sync, exit)`;
}

/** Parse and run a whole program, producing the trace and the final state. */
export function runSyscalls(source: string, start?: { disk?: Record<string, string> }): SyscallRun {
  const calls: { line: number; call: Call }[] = [];
  const lines = source.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t || t.startsWith("#")) continue;
    const c = parseLine(t);
    if (typeof c === "string") return { ok: false, error: { line: i + 1, message: c } };
    calls.push({ line: i + 1, call: c });
  }

  const s: SyscallState = {
    screen: "",
    disk: { ...(start?.disk ?? {}) },
    cache: {},
    fds: {},
    results: {},
    exitCode: null,
    killed: null,
  };
  const trace: TraceStep[] = [];
  let nextFd = 3;
  const push = (line: number, layer: Layer, mode: Mode, text: string) =>
    trace.push({ line, layer, mode, text, after: { screen: s.screen, cache: { ...s.cache }, disk: { ...s.disk } } });
  const fileNow = (name: string) => s.cache[name] ?? s.disk[name] ?? "";

  /** The start and end of every system call: the trap in, and the return to the app. */
  const trapIn = (line: number, name: string, args: string) => {
    push(line, "app", "user", `The app calls ${name}(${args}): it puts the call's number and arguments in registers.`);
    push(line, "hardware", "kernel", "The system-call instruction traps: the CPU saves where the app was and switches to kernel mode.");
  };
  const returnOut = (line: number, value: number | string) => {
    s.results[line] = value;
    push(line, "hardware", "user", `The kernel returns ${value}: the CPU switches back to user mode and the app continues.`);
  };
  const flush = (line: number, name: string) => {
    if (s.cache[name] === undefined) return;
    s.disk[name] = s.cache[name];
    delete s.cache[name];
    // The file stays readable through the disk copy; the cache entry is dropped to keep the picture simple.
    push(line, "device", "kernel", `The storage controller writes "${name}" to the disk. Now it survives a power cut.`);
  };

  for (const { line, call } of calls) {
    if (s.exitCode !== null || s.killed) break;
    switch (call.op) {
      case "compute":
        push(line, "app", "user", `The app ${call.what}, using only its own registers and memory. No OS needed.`);
        break;
      case "open": {
        trapIn(line, "open", `"${call.name}"`);
        const exists = s.disk[call.name] !== undefined || s.cache[call.name] !== undefined;
        if (!exists) s.cache[call.name] = "";
        push(line, "kernel", "kernel", exists ? `The kernel finds "${call.name}" in the file system.` : `There's no "${call.name}", so the kernel creates an empty one.`);
        const fd = nextFd++;
        s.fds[fd] = call.name;
        push(line, "kernel", "kernel", `It records the open file in the process's table as file descriptor ${fd}.`);
        returnOut(line, fd);
        break;
      }
      case "write":
      case "write-addr": {
        const shown = call.op === "write" ? `"${call.text}"` : `0x${call.address.toString(16).toUpperCase()}`;
        trapIn(line, "write", `${call.fd}, ${shown}`);
        if (call.op === "write-addr" && (call.address < APP_MEMORY.start || call.address > APP_MEMORY.end)) {
          push(line, "kernel", "kernel", `The kernel checks the buffer: 0x${call.address.toString(16).toUpperCase()} isn't in this app's memory, so it refuses.`);
          returnOut(line, "error: bad address");
          break;
        }
        const text = call.op === "write" ? call.text : call.address === APP_BUFFER.address ? APP_BUFFER.text : "";
        if (call.fd === 1) {
          push(line, "kernel", "kernel", "The kernel checks: file descriptor 1 is the screen, and the buffer is the app's own.");
          s.screen += text;
          push(line, "device", "kernel", `The display driver sends the bytes to the display controller, which shows "${text}".`);
        } else if (s.fds[call.fd] !== undefined) {
          const name = s.fds[call.fd];
          push(line, "kernel", "kernel", `The kernel checks: file descriptor ${call.fd} is "${name}", open for this process.`);
          s.cache[name] = fileNow(name) + text;
          push(line, "kernel", "kernel", `It copies the bytes into its cache of "${name}" in RAM. The disk hasn't changed yet.`);
        } else {
          push(line, "kernel", "kernel", `The kernel checks: file descriptor ${call.fd} isn't open in this process, so it refuses.`);
          returnOut(line, "error: bad file descriptor");
          break;
        }
        returnOut(line, text.length);
        break;
      }
      case "read": {
        trapIn(line, "read", String(call.fd));
        const name = s.fds[call.fd];
        if (name === undefined) {
          push(line, "kernel", "kernel", `The kernel checks: file descriptor ${call.fd} isn't open in this process, so it refuses.`);
          returnOut(line, "error: bad file descriptor");
          break;
        }
        if (s.cache[name] === undefined) {
          s.cache[name] = s.disk[name] ?? "";
          push(line, "device", "kernel", `"${name}" isn't in RAM yet, so the storage controller reads it from the disk.`);
        }
        push(line, "kernel", "kernel", `The kernel copies "${s.cache[name]}" into the app's buffer.`);
        returnOut(line, `"${s.cache[name]}"`);
        break;
      }
      case "close": {
        trapIn(line, "close", String(call.fd));
        const name = s.fds[call.fd];
        if (name === undefined) {
          push(line, "kernel", "kernel", `The kernel checks: file descriptor ${call.fd} isn't open, so there's nothing to close.`);
          returnOut(line, "error: bad file descriptor");
          break;
        }
        flush(line, name);
        delete s.fds[call.fd];
        push(line, "kernel", "kernel", `It removes file descriptor ${call.fd} from the process's table.`);
        returnOut(line, 0);
        break;
      }
      case "sync":
        trapIn(line, "sync", "");
        if (Object.keys(s.cache).length === 0) push(line, "kernel", "kernel", "Nothing is waiting in the cache, so there's nothing to write.");
        for (const name of Object.keys(s.cache)) flush(line, name);
        returnOut(line, 0);
        break;
      case "out":
        push(line, "app", "user", `The app tries OUT ${call.port}, ${call.value} itself, talking to a device directly.`);
        push(line, "hardware", "kernel", "OUT is privileged and the CPU is in user mode, so the CPU raises a fault and jumps to the kernel.");
        push(line, "kernel", "kernel", "The kernel doesn't let an app drive devices directly: it stops the process.");
        s.killed = `line ${line}: a privileged instruction in user mode`;
        break;
      case "exit": {
        trapIn(line, "exit", String(call.code));
        for (const fd of Object.keys(s.fds)) {
          const name = s.fds[Number(fd)];
          flush(line, name);
          delete s.fds[Number(fd)];
        }
        push(line, "kernel", "kernel", `The kernel closes what the process left open, frees its memory and records exit code ${call.code}.`);
        s.exitCode = call.code;
        s.results[line] = call.code;
        break;
      }
    }
  }
  return { ok: true, trace, state: s };
}

export type SyscallGoal = {
  screen?: string;
  /** Files that must be on the disk with exactly this content. */
  disk?: Record<string, string>;
  exit?: number;
  /** The process must not be stopped by the kernel. */
  notKilled?: boolean;
};

/** Which parts of a goal aren't met, in words; empty when it's met. */
export function syscallGoalMisses(s: SyscallState, goal: SyscallGoal): string[] {
  const misses: string[] = [];
  if (goal.screen !== undefined && s.screen !== goal.screen) misses.push(`the screen should show "${goal.screen}"`);
  for (const [name, text] of Object.entries(goal.disk ?? {})) {
    if (s.disk[name] !== text) {
      misses.push(
        s.cache[name] === text ? `"${name}" is right in RAM but not on the disk yet` : `the disk should hold "${name}" with "${text}"`,
      );
    }
  }
  if (goal.exit !== undefined && s.exitCode !== goal.exit) misses.push(`the program should exit with code ${goal.exit}`);
  if (goal.notKilled && s.killed) misses.push("the kernel stopped the program");
  return misses;
}
