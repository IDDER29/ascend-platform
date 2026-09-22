import Link from "next/link";
import { SectionBand } from "./section-band";
import { FIRST_LESSON_HREF } from "@/lib/routes";
import { Button } from "@/components/ui/button";

/**
 * Shows the calm anatomy of a lesson — real preview chrome, not skeleton bars.
 */
export function LessonFeel() {
  return (
    <SectionBand id="lesson" tone="paper">
      <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 xl:gap-16">
        <div className="animate-rise">
          <div className="mb-3.5 font-mono text-[12.5px] uppercase tracking-[0.14em] text-brand-violet">
            Inside a lesson
          </div>
          <h2 className="mb-3.5 max-w-[420px] font-display text-[32px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[40px]">
            One concept. Quiet focus. Then the next.
          </h2>
          <p className="mb-6 max-w-[440px] text-[16.5px] leading-relaxed text-ink-secondary">
            Lessons are short pages — a clear explanation, a bit of code when it
            helps, and a knowledge check. No sidebar noise while you read.
          </p>
          <ul className="mb-8 flex flex-col gap-3 text-[14.5px] text-ink-secondary">
            {[
              "Readable without signing in",
              "Mark complete when you're ready",
              "Continue picks up where you left off",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#7B4DFF]" />
                {line}
              </li>
            ))}
          </ul>
          <Button href={FIRST_LESSON_HREF} size="lg">
            Try the first lesson
          </Button>
        </div>

        <div className="animate-rise relative" style={{ animationDelay: "0.08s" }}>
          {/* Soft ambient glow behind the preview */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle_at_40%_30%,rgba(123,77,255,0.16),transparent_65%)] blur-sm"
          />

          <Link
            href={FIRST_LESSON_HREF}
            className="group relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B4DFF]/45 focus-visible:ring-offset-4 rounded-[24px]"
          >
            <article className="relative overflow-hidden rounded-[24px] border border-[#E6E1F2] bg-white shadow-[0_8px_24px_rgba(28,18,64,0.06),0_28px_64px_rgba(28,18,64,0.12)] transition-transform duration-300 group-hover:-translate-y-1">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-[#F0ECF7] bg-[#FAF9FC] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E8E4F0]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E8E4F0]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#E8E4F0]" />
                <span className="ml-2 truncate font-mono text-[11px] text-ink-faint">
                  ascend · curriculum / level-00 / what-is-a-bit
                </span>
              </div>

              <div className="px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
                {/* Lesson meta row — mirrors real lesson header */}
                <div className="mb-4 flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBEBFA] px-2.5 py-1 font-mono text-[10.5px] font-bold tracking-[0.04em] text-[#C13AE0]">
                    CONCEPT 01
                  </span>
                  <span className="font-mono text-[11.5px] text-ink-faint">4 min read</span>
                  <span className="font-mono text-[11.5px] text-ink-fainter">·</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-ink-faint">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-level-00 text-[8px] font-bold text-white">
                      00
                    </span>
                    Bits &amp; Logic
                  </span>
                </div>

                <h3 className="mb-3 font-display text-[26px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[28px]">
                  What is a bit?
                </h3>

                <p className="mb-5 text-[14.5px] leading-[1.7] text-ink-secondary">
                  A bit is the smallest possible unit of information — the answer
                  to one yes/no question. Hardware stores that answer as one of
                  two distinguishable states, not a continuous range.
                </p>

                {/* Callout — real teaching moment */}
                <div className="mb-5 rounded-[16px] border border-[#EDE8F8] bg-[#F8F5FF] px-4 py-3.5">
                  <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#7B4DFF]">
                    The idea
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-[#413D50]">
                    “0” and “1” are just labels. The bit is the underlying
                    distinction — on/off, present/absent — that those labels name.
                  </p>
                </div>

                {/* Code surface */}
                <div className="mb-5 overflow-hidden rounded-[14px] bg-[#181428]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#8A849C]">
                      example
                    </span>
                    <span className="font-mono text-[10px] text-[#6BE3A3]">binary</span>
                  </div>
                  <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-[1.85] text-[#D8D4E6]">
                    <code>
                      <span className="text-[#8A849C]">{"// one yes/no answer"}</span>
                      {"\n"}
                      <span className="text-[#9B7BFF]">bit</span>
                      <span className="text-[#B9B3D0]"> = </span>
                      <span className="text-[#FFC06B]">0</span>
                      <span className="text-[#B9B3D0]">{"  // off"}</span>
                      {"\n"}
                      <span className="text-[#9B7BFF]">bit</span>
                      <span className="text-[#B9B3D0]"> = </span>
                      <span className="text-[#6BE3A3]">1</span>
                      <span className="text-[#B9B3D0]">{"  // on"}</span>
                    </code>
                  </pre>
                </div>

                {/* Knowledge check preview */}
                <div className="rounded-[16px] border border-[#EDE9F8] bg-[#FBFBFD] p-4">
                  <div className="mb-2.5 flex items-center justify-between gap-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink-fainter">
                      Knowledge check
                    </span>
                    <span className="rounded-full bg-[#F1EDFE] px-2 py-0.5 font-mono text-[10px] font-bold text-[#5A32D6]">
                      1 / 3
                    </span>
                  </div>
                  <p className="mb-3 text-[13.5px] font-semibold leading-snug text-ink">
                    Why is “smallest unit of information” more precise than
                    “a zero or a one”?
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="h-8 flex-1 rounded-lg border border-dashed border-[#DAD4EA] bg-white" />
                    <span className="inline-flex h-8 items-center rounded-lg bg-[#EDE9F8] px-3 text-[12px] font-semibold text-ink-muted">
                      Reveal
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-center font-mono text-[11px] text-ink-fainter transition-colors group-hover:text-[#5A32D6]">
                  Open the real lesson →
                </p>
              </div>
            </article>
          </Link>
        </div>
      </div>
    </SectionBand>
  );
}
