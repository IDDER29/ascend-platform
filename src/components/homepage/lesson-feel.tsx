import { SectionBand } from "./section-band";
import { TrafficLights } from "./mac-chrome";
import { CURRICULUM_HREF } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { landingEyebrowClass } from "./landing-styles";

/**
 * Shows the calm anatomy of a lesson — window chrome + nested Terminal.
 * Preview is display-only; CTA opens the curriculum.
 * Surfaces follow the page theme (light or dark).
 */
export function LessonFeel() {
  return (
    <SectionBand id="lesson" tone="paper" className="overflow-x-clip">
      <div className="grid min-w-0 items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12 xl:gap-16">
        <div className="animate-rise min-w-0">
          <div className={landingEyebrowClass}>Inside a lesson</div>
          <h2 className="mb-3.5 max-w-xl font-display text-[clamp(1.6rem,4.5vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-balance">
            One concept. Quiet focus. Then the next.
          </h2>
          <p className="mb-6 max-w-md text-[15.5px] leading-relaxed text-ink-secondary text-pretty sm:text-[16.5px]">
            Lessons are short pages — a clear explanation, a bit of code when it
            helps, and a knowledge check. No sidebar noise while you read.
          </p>
          <ul className="mb-8 flex flex-col gap-3 text-[14px] text-ink-secondary sm:text-[14.5px]">
            {[
              "Readable without signing in",
              "Mark complete when you're ready",
              "Continue picks up where you left off",
            ].map((line) => (
              <li key={line} className="flex min-w-0 items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-violet" />
                <span className="min-w-0">{line}</span>
              </li>
            ))}
          </ul>
          <Button href={CURRICULUM_HREF} size="lg" variant="secondary" className="w-full max-w-xs sm:w-auto sm:max-w-none">
            View full curriculum
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </div>

        <div className="animate-rise relative min-w-0" style={{ animationDelay: "0.08s" }}>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-3 rounded-[32px] opacity-40 blur-md sm:-inset-6 sm:rounded-[40px] dark:opacity-50"
            style={{
              background:
                "radial-gradient(circle at 40% 30%, var(--color-hero-wash-a), transparent 65%)",
            }}
          />

          {/* Display-only preview — themes with the page */}
          <article
            aria-hidden
            className="relative w-full max-w-full overflow-hidden rounded-[14px] border border-card-border bg-elevated shadow-card-hover ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
          >
            {/* Title bar */}
            <div className="relative flex items-center justify-end border-b border-card-border bg-bg px-3 py-2 sm:px-3.5 sm:py-2.5">
              <div className="pointer-events-none absolute inset-x-0 flex justify-center px-12">
                <span className="truncate text-center text-[11px] font-medium text-ink-muted sm:text-[12px]">
                  What is a bit? — Ascend
                </span>
              </div>
              <TrafficLights />
            </div>

            {/* URL / toolbar bar */}
            <div className="border-b border-card-border bg-bg px-2.5 py-1.5 sm:px-3 sm:py-2">
              <div className="flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md border border-card-border bg-elevated px-2.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="flex-none text-ink-faint" aria-hidden>
                  <path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4l1.4-1.4M17 7l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="min-w-0 truncate font-mono text-[10.5px] text-ink-secondary sm:text-[11.5px]">
                  ascend.dev/…/what-is-a-bit
                </span>
              </div>
            </div>

            {/* Page content */}
            <div className="bg-paper px-4 pb-4 pt-4 sm:px-7 sm:pb-7 sm:pt-6">
              <div className="mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 sm:mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-xp-bg px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.04em] text-brand-magenta sm:text-[10.5px]">
                  CONCEPT 01
                </span>
                <span className="font-mono text-[11px] text-ink-muted sm:text-[11.5px]">4 min read</span>
                <span className="hidden font-mono text-[11.5px] text-ink-faint sm:inline">·</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted sm:text-[11.5px]">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-level-00 text-[8px] font-bold text-white">
                    00
                  </span>
                  Bits &amp; Logic
                </span>
              </div>

              <h3 className="mb-2.5 font-display text-[22px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:mb-3 sm:text-[28px]">
                What is a bit?
              </h3>

              <p className="mb-4 text-[13.5px] leading-[1.65] text-ink-secondary sm:mb-5 sm:text-[14.5px] sm:leading-[1.7]">
                A bit is the smallest possible unit of information — the answer
                to one yes/no question. Hardware stores that answer as one of
                two distinguishable states, not a continuous range.
              </p>

              <div className="mb-4 rounded-[14px] border border-xp-border bg-xp-bg px-3.5 py-3 sm:mb-5 sm:rounded-[16px] sm:px-4 sm:py-3.5">
                <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-brand-violet">
                  The idea
                </div>
                <p className="text-[13px] leading-relaxed text-ink-secondary sm:text-[13.5px]">
                  “0” and “1” are just labels. The bit is the underlying
                  distinction — on/off, present/absent — that those labels name.
                </p>
              </div>

              {/* Nested Terminal — always dark (code surface) */}
              <div className="mb-4 overflow-hidden rounded-[10px] border border-black/50 bg-[#141816] shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:mb-5 dark:border-white/[0.08]">
                <div className="relative flex items-center justify-end border-b border-white/[0.06] bg-[#1c221f] px-3 py-2">
                  <span className="pointer-events-none absolute inset-x-0 truncate px-10 text-center text-[11px] font-medium text-[#8a9a92] sm:px-12">
                    bit.c — Terminal
                  </span>
                  <TrafficLights size="sm" />
                </div>
                <pre className="overflow-x-auto px-3 py-3 font-mono text-[11.5px] leading-[1.85] text-[#E8E8ED] sm:px-4 sm:py-3.5 sm:text-[12.5px]">
                  <code>
                    <span className="text-[#6E6E73]">{"// one yes/no answer"}</span>
                    {"\n"}
                    <span className="text-[#FC5FA3]">int</span>
                    {" "}
                    <span className="text-[#67B7F7]">bit</span>
                    <span className="text-[#E8E8ED]"> = </span>
                    <span className="text-[#D9C97C]">0</span>
                    <span className="text-[#6E6E73]">{"  // off"}</span>
                    {"\n"}
                    <span className="text-[#67B7F7]">bit</span>
                    <span className="text-[#E8E8ED]"> = </span>
                    <span className="text-[#D9C97C]">1</span>
                    <span className="text-[#6E6E73]">{"  // on"}</span>
                    {"\n"}
                    <span className="text-[#FC5FA3]">printf</span>
                    <span className="text-[#E8E8ED]">(</span>
                    <span className="text-[#FC6A5D]">&quot;bit = %d\\n&quot;</span>
                    <span className="text-[#E8E8ED]">, bit);</span>
                  </code>
                </pre>
              </div>

              <div className="rounded-[14px] border border-card-border bg-elevated p-3.5 sm:rounded-[16px] sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-3 sm:mb-2.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                    Knowledge check
                  </span>
                  <span className="rounded-full bg-xp-bg px-2 py-0.5 font-mono text-[10px] font-bold text-xp-text">
                    1 / 3
                  </span>
                </div>
                <p className="mb-3 text-[13px] font-semibold leading-snug text-ink sm:text-[13.5px]">
                  Why is “smallest unit of information” more precise than
                  “a zero or a one”?
                </p>
                <div className="flex items-center gap-2">
                  <span className="h-8 min-w-0 flex-1 rounded-lg border border-dashed border-card-border-soft bg-bg" />
                  <span className="inline-flex h-8 flex-none items-center rounded-lg bg-xp-bg px-3 text-[12px] font-semibold text-ink-muted">
                    Reveal
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </SectionBand>
  );
}
