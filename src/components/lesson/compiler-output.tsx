import { functionListing, loadEvidence } from "@/lib/evidence";

const MONO = "font-[family-name:var(--font-plex-mono)]";

/**
 * Real compiler output, shown as evidence: the C source and one function's assembly at -O0 and -O2,
 * with the exact compiler, target and flags. Reads content/evidence/<evidence>/ at build time (a server
 * component), so it can't drift from what gcc actually printed. <CompilerOutput evidence="sum-to-n" fn="sum_to" />
 */
export function CompilerOutput({
  evidence,
  fn,
  caption,
  compare = "optimisation",
}: {
  evidence: string;
  fn: string;
  caption?: string;
  /** "optimisation": -O0 next to -O2. "targets": -O2 for 64-bit x86 next to -O2 for 32-bit x86. */
  compare?: "optimisation" | "targets";
}) {
  const e = loadEvidence(evidence);
  const block = (title: string, flags: string, lines: string[]) => (
    <div className="min-w-0">
      <p className="m-0 text-[13px] font-bold">{title}</p>
      <p className={`m-0 mb-1.5 text-[11.5px] text-[var(--coach-ink-muted)] ${MONO}`}>{flags}</p>
      <pre
        className={`m-0 overflow-x-auto rounded-xl bg-[var(--coach-code-bg)] p-3 text-[12.5px] leading-relaxed text-[var(--coach-code-ink)] ${MONO}`}
      >
        {lines.join("\n")}
      </pre>
      <p className="m-0 mt-1 text-[12px] text-[var(--coach-ink-muted)]">
        {lines.filter((l) => /^ {2}\S/.test(l)).length} instructions
      </p>
    </div>
  );
  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="block text-[15px] font-bold">{caption ?? e.title}</span>
        <span className="block text-[12.5px] text-[var(--coach-ink-muted)]">
          Real output from {e.compiler}, for {e.target}. Program output: {e.output}.
        </span>
      </figcaption>
      <div className="flex flex-col gap-4 p-4">
        <div>
          <p className="m-0 mb-1.5 text-[13px] font-bold">The C source</p>
          <pre
            className={`m-0 overflow-x-auto rounded-xl bg-[var(--coach-code-bg)] p-3 text-[12.5px] leading-relaxed text-[var(--coach-code-ink)] ${MONO}`}
          >
            {e.source.trim()}
          </pre>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {compare === "targets" && e.asm.O2m32 ? (
            <>
              {block("64-bit x86 (-O2)", e.flags.O2, functionListing(e.asm.O2, fn))}
              {block("32-bit x86 (-O2, -m32)", e.flags.O2m32 ?? "", functionListing(e.asm.O2m32, fn))}
            </>
          ) : (
            <>
              {block("Optimisation off (-O0)", e.flags.O0, functionListing(e.asm.O0, fn))}
              {block("Optimisation on (-O2)", e.flags.O2, functionListing(e.asm.O2, fn))}
            </>
          )}
        </div>
        <p className="m-0 text-[12.5px] leading-snug text-[var(--coach-ink-muted)]">{e.note}</p>
      </div>
    </figure>
  );
}
