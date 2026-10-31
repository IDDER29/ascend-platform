/**
 * Simulate, synthesise or prove every lesson design in content/hdl/ with the local Icarus Verilog and
 * Yosys, and record exactly what happened in each design's run.json (see src/lib/hdl/hash.ts).
 *   npx tsx scripts/run-hdl.ts [id ...]   (no ids: only designs whose run.json is stale; --all: every one)
 * The tools come from PATH (apt install iverilog yosys yosys-abc), or from ASCEND_TOOLS_ROOT: a folder
 * with the Ubuntu packages unpacked into it (apt-get download ...; dpkg -x <deb> <folder>), for machines
 * where they can't be installed system-wide.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { allHdlIds, HDL_DIR, hdlDataFiles, hdlFiles, hdlHash, hdlMeta, type HdlRun } from "../src/lib/hdl/hash";
import { parseVcd } from "../src/lib/hdl/vcd";

const ROOT = process.env.ASCEND_TOOLS_ROOT;
const bin = (name: string) => (ROOT ? path.join(ROOT, "usr", "bin", name) : name);
const IVL = ROOT ? path.join(ROOT, "usr", "lib", "x86_64-linux-gnu", "ivl") : null;

const version = (cmd: string, args: string[]) => {
  try {
    return execFileSync(bin(cmd), args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).split("\n")[0].trim();
  } catch (e) {
    return ((e as { stdout?: string }).stdout ?? "").split("\n")[0].trim();
  }
};
const versions = `${version("iverilog", ["-V"]).replace(/ \(.*/, "")}; ${version("yosys", ["-V"]).replace(/ \(git.*/, "")}`;
const today = new Date().toISOString().slice(0, 10);
const MAX = 6000;
const cap = (t: string) => (t.length <= MAX ? t : `${t.slice(0, MAX)}\n... (output cut here)\n`);

const argv = process.argv.slice(2);
const all = argv.includes("--all");
const named = argv.filter((a) => !a.startsWith("--"));
const stale = (id: string) => {
  const p = path.join(HDL_DIR, id, "run.json");
  return !existsSync(p) || (JSON.parse(readFileSync(p, "utf8")) as HdlRun).sourceHash !== hdlHash(id);
};

const ids = named.length ? named : allHdlIds().filter((id) => all || stale(id));
for (const id of ids) {
  const dir = path.join(HDL_DIR, id);
  const meta = hdlMeta(id);
  const tool = meta.tool ?? "sim";
  const files = hdlFiles(id).map((f) => f.name);
  const out = mkdtempSync(path.join(tmpdir(), "ascend-hdl-"));
  const clean = (t: string) => t.replaceAll(out, "/tmp/build").replaceAll(dir + "/", "").replaceAll(dir, ".");
  const commands: string[] = [];
  let compile = { ok: true, messages: "" };
  let output = "";
  let exitCode: number | null = 0;
  let waves: HdlRun["waves"] = null;

  if (tool === "sim") {
    const vvp = path.join(out, "sim.vvp");
    commands.push(`iverilog -g2012 -Wall -o sim.vvp ${files.join(" ")}`, "vvp sim.vvp");
    const cc = spawnSync(bin("iverilog"), [...(IVL ? [`-B${IVL}`] : []), "-g2012", "-Wall", "-o", vvp, ...files], { cwd: dir, encoding: "utf8" });
    compile = { ok: cc.status === 0, messages: clean((cc.stderr ?? "") + (cc.stdout ?? "")) };
    if (compile.ok) {
      // Memory images the testbench loads with $readmemh run next to the simulation.
      for (const f of hdlDataFiles(id)) if (/\.(hex|mem)$/.test(f.name)) copyFileSync(path.join(dir, f.name), path.join(out, f.name));
      const r = spawnSync(bin("vvp"), [...(IVL ? [`-M${IVL}`] : []), "-n", vvp], { cwd: out, encoding: "utf8", timeout: 10000 });
      output = cap(clean((r.stdout ?? "") + (r.stderr ?? "")));
      exitCode = r.status;
      const vcd = path.join(out, "waves.vcd");
      if (meta.waves && existsSync(vcd)) waves = parseVcd(readFileSync(vcd, "utf8"), meta.waves);
    }
  } else if (tool === "pnr") {
    const json = path.join(out, "design.json");
    const synthScript = `read_verilog -sv ${files.join(" ")}; synth_ice40 -top ${meta.top} -json ${json}`;
    const pnrArgs = ["--hx1k", "--package", "tq144", "--json", json, "--pcf-allow-unconstrained", "--freq", String(meta.freq ?? 12)];
    commands.push(`yosys -p "read_verilog -sv ${files.join(" ")}; synth_ice40 -top ${meta.top} -json design.json"`);
    commands.push(`nextpnr-ice40 ${pnrArgs.join(" ").replace(json, "design.json")}`);
    const y = spawnSync(bin("yosys"), ["-q", "-p", synthScript], { cwd: dir, encoding: "utf8", timeout: 120000 });
    const yErrors = clean((y.stdout ?? "") + (y.stderr ?? "")).split("\n").filter((l) => l.startsWith("ERROR"));
    compile = { ok: y.status === 0, messages: yErrors.join("\n") };
    if (compile.ok) {
      // With unpacked packages, nextpnr only finds its chip database at /usr/share/nextpnr, so bwrap
      // mounts it there for this one command.
      const libs = ROOT ? path.join(ROOT, "usr", "lib", "x86_64-linux-gnu") : null;
      const [cmd, args] = ROOT
        ? [
            "bwrap",
            ["--dev-bind", "/", "/", "--tmpfs", "/usr/share", "--ro-bind", path.join(ROOT, "usr", "share", "nextpnr"), "/usr/share/nextpnr",
             "--setenv", "LD_LIBRARY_PATH", libs!, bin("nextpnr-ice40"), ...pnrArgs],
          ]
        : ["nextpnr-ice40", pnrArgs];
      const r = spawnSync(cmd as string, args as string[], { cwd: out, encoding: "utf8", timeout: 300000 });
      const log = clean((r.stdout ?? "") + (r.stderr ?? ""));
      const keep = log
        .split("\n")
        .filter((l) => /Device utilisation|ICESTORM_LC:|SB_IO:|ICESTORM_RAM:|SB_GB:|Max frequency|Max delay|Critical path report|LCs used|ns logic|ERROR|Program finished/.test(l))
        .filter((l) => !/\||at iteration/.test(l));
      output = cap(keep.join("\n").replace(/^Info: ?/gm, ""));
      exitCode = r.status;
    }
  } else {
    const read = `read_verilog ${tool === "prove" ? "-formal -sv " : "-sv "}${files.join(" ")}`;
    const script =
      tool === "synth"
        ? `${read}; synth -top ${meta.top}; ${meta.yosys ? `${meta.yosys}; ` : ""}stat`
        : `${read}; prep -top ${meta.top}; chformal -lower; sat -prove-asserts -show-inputs -show-outputs`;
    commands.push(`yosys -p "${script}"`);
    const r = spawnSync(bin("yosys"), ["-p", script], { cwd: dir, encoding: "utf8", timeout: 60000 });
    const log = clean((r.stdout ?? "") + (r.stderr ?? ""));
    const errors = log.split("\n").filter((l) => l.startsWith("ERROR"));
    compile = { ok: errors.length === 0, messages: errors.join("\n") };
    if (tool === "synth") {
      // The statistics of the last stat pass: from its "=== top ===" heading to the end of the table.
      const at = log.lastIndexOf("Printing statistics.");
      output = cap(log.slice(at < 0 ? 0 : at).split("\n").slice(1).join("\n").split(/\nEnd of script/)[0].trim());
    } else {
      // The proof: from the solver's start, without Yosys's large "Q.E.D." banner.
      const at = log.indexOf("Solving problem");
      output = cap(
        log
          .slice(at < 0 ? 0 : at)
          .split("\n")
          .filter((l) => !/\$\$|\|__|\\__/.test(l) && !(/[_|()\\/]/.test(l) && !/[A-Za-z0-9]/.test(l))) // ASCII banners
          .join("\n")
          .split(/\nEnd of script/)[0]
          .replace(/\n{3,}/g, "\n\n")
          .trim(),
      );
    }
    exitCode = r.status;
  }
  rmSync(out, { recursive: true, force: true });

  const result: HdlRun = { id, sourceHash: hdlHash(id), tool, versions, commands, compile, output, exitCode, waves, generated: today };
  writeFileSync(path.join(dir, "run.json"), JSON.stringify(result, null, 2) + "\n");
  console.log(`${id}: ${tool} ${!compile.ok ? "compile error" : `exit ${exitCode}`}${waves ? `, ${waves.waves.length} waves` : ""}`);
}
if (ids.length === 0) console.log("Every design's run.json is up to date.");
