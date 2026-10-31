import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Real compiler output kept in content/evidence/<id>/: the C source, the assembly gcc printed at -O0
 * and -O2, and how it was made (meta.json). Lessons show it as evidence; it is never edited by hand.
 */
export type Evidence = {
  id: string;
  title: string;
  compiler: string;
  target: string;
  flags: { O0: string; O2: string; O2m32?: string };
  targetM32?: string;
  output: string;
  note: string;
  source: string;
  asm: { O0: string; O2: string; O2m32: string | null };
};

const DIR = path.join(process.cwd(), "content", "evidence");

export function loadEvidence(id: string): Evidence {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`Bad evidence id: ${id}`);
  const base = path.join(DIR, id);
  const meta = JSON.parse(readFileSync(path.join(base, "meta.json"), "utf8")) as Omit<Evidence, "source" | "asm">;
  const sourceFile = readFileSync(path.join(base, "source.c"), "utf8");
  return {
    ...meta,
    source: sourceFile,
    asm: {
      O0: readFileSync(path.join(base, "O0.s"), "utf8"),
      O2: readFileSync(path.join(base, "O2.s"), "utf8"),
      O2m32: existsSync(path.join(base, "O2-m32.s")) ? readFileSync(path.join(base, "O2-m32.s"), "utf8") : null,
    },
  };
}

/** One function's lines from a gcc listing: from its label to gcc's `.size` line, without directives. */
export function functionListing(asm: string, fn: string): string[] {
  const lines = asm.split("\n");
  const start = lines.findIndex((l) => l === `${fn}:`);
  if (start < 0) return [];
  const out: string[] = [];
  for (let i = start; i < lines.length; i++) {
    const l = lines[i];
    if (new RegExp(`^\\s+\\.size\\s+${fn},`).test(l)) break;
    if (/^\s+\./.test(l)) continue; // directives such as .p2align
    out.push(l.replace(/\t/g, " ").replace(/^ (?=\S)/, "  "));
  }
  return out;
}
