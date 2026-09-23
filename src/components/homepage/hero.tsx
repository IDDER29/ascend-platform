import { Button } from "@/components/ui/button";
import { CURRICULUM_HREF } from "@/lib/routes";
import { PATH_OUTCOME, PATH_STEPS } from "@/components/homepage/path-ladder";

/**
 * Display-only understanding ladder — not a syllabus or project list.
 * Shows how knowledge deepens on Ascend, and what you walk away with.
 */
const STEPS = PATH_STEPS;
const OUTCOME = PATH_OUTCOME;

function PathNode({
  mark,
  markClass,
  title,
  gain,
  size = "md",
}: {
  mark: string;
  markClass: string;
  title: string;
  gain: string;
  size?: "md" | "lg";
}) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center px-0.5 text-center sm:px-1">
      <span
        className={
          size === "lg"
            ? `mb-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] font-display text-[15px] font-extrabold text-white shadow-[0_6px_16px_rgba(0,0,0,0.14)] md:mb-2.5 md:h-14 md:w-14 md:rounded-[16px] md:text-[18px] lg:h-[60px] lg:w-[60px] lg:rounded-[18px] lg:text-[20px] ${markClass}`
            : `mb-1.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] font-display text-[16px] font-extrabold text-white shadow-[0_8px_20px_rgba(0,0,0,0.14)] ${markClass}`
        }
      >
        {mark}
      </span>
      <span
        className={
          size === "lg"
            ? "mb-0.5 w-full min-w-0 font-display text-[12px] font-bold text-ink md:text-[13.5px] lg:text-[15px]"
            : "w-full min-w-0 font-display text-[14px] font-bold text-ink"
        }
      >
        {title}
      </span>
      <span
        className={
          size === "lg"
            ? "w-full min-w-0 text-[10.5px] leading-snug text-ink-muted md:text-[11.5px] lg:text-[12px]"
            : "mt-0.5 w-full min-w-0 text-[11.5px] leading-snug text-ink-muted"
        }
      >
        {gain}
      </span>
    </div>
  );
}

/**
 * Full-viewport trailhead hero.
 * CTAs navigate. The ladder below is how understanding progresses — not course content.
 */
export function Hero() {
  return (
    <div className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-x-clip overflow-y-hidden bg-[var(--color-hero-surface)] sm:min-h-[calc(100svh-68px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(80% 55% at 18% 0%, var(--color-hero-wash-a), transparent 60%),
            radial-gradient(70% 50% at 88% 8%, var(--color-hero-wash-b), transparent 55%),
            linear-gradient(180deg, transparent 55%, var(--color-bg) 100%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-hero-grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-hero-grid) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto flex w-full min-w-0 max-w-[1000px] flex-1 flex-col items-center justify-center px-4 py-8 text-center sm:px-8 sm:py-12">
        <div className="flex w-full min-w-0 flex-col items-center">
          <h1 className="animate-rise mb-4 w-full max-w-[820px] font-display text-[clamp(1.85rem,6.5vw,3.625rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-balance">
            Learn how computers{" "}
            <span className="text-headline-grad">really work.</span>
          </h1>

          <p
            className="animate-rise mb-7 w-full max-w-[36rem] text-[clamp(0.95rem,2.8vw,1.0625rem)] leading-relaxed text-ink-secondary text-pretty sm:mb-8"
            style={{ animationDelay: "0.05s" }}
          >
            Understanding stacks bottom-up — each step deeper than the last,
            until the whole machine makes sense.
          </p>

          <div
            className="animate-rise mb-3 w-full max-w-sm sm:w-auto sm:max-w-none"
            style={{ animationDelay: "0.08s" }}
          >
            <Button href={CURRICULUM_HREF} size="lg" className="w-full sm:w-auto">
              View full curriculum
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </div>

          <p
            className="animate-rise mb-8 max-w-[22rem] px-1 font-mono text-[11px] leading-relaxed text-ink-muted sm:mb-10 sm:max-w-none sm:text-[12px]"
            style={{ animationDelay: "0.12s" }}
          >
            Free forever · open every step · sign in only to save progress
          </p>

          <div
            className="animate-rise w-full min-w-0"
            style={{ animationDelay: "0.16s" }}
            aria-label="How understanding progresses on Ascend"
          >
            {/* Desktop / tablet — one flexible row */}
            <div className="relative hidden min-w-0 sm:block">
              <div
                aria-hidden
                className="bg-path-rail absolute left-[4%] right-[4%] top-[22px] h-[3px] rounded-full opacity-45 md:top-[28px] lg:top-[30px]"
              />
              <ul className="relative grid w-full min-w-0 grid-cols-5 gap-1 md:gap-2">
                {STEPS.map((step) => (
                  <li key={step.mark} className="flex min-w-0 justify-center">
                    <PathNode
                      mark={step.mark}
                      markClass={step.tone}
                      title={step.title}
                      gain={step.gain}
                      size="lg"
                    />
                  </li>
                ))}
                <li className="flex min-w-0 justify-center">
                  <PathNode
                    mark={OUTCOME.mark}
                    markClass={OUTCOME.tone}
                    title={OUTCOME.title}
                    gain={OUTCOME.gain}
                    size="lg"
                  />
                </li>
              </ul>
            </div>

            {/* Phone — 2×2 + centered arrive */}
            <ul className="mx-auto grid w-full max-w-sm grid-cols-2 gap-x-2 gap-y-5 sm:hidden">
              {STEPS.map((step) => (
                <li key={step.mark} className="flex min-w-0 justify-center">
                  <PathNode
                    mark={step.mark}
                    markClass={step.tone}
                    title={step.title}
                    gain={step.gain}
                  />
                </li>
              ))}
              <li className="col-span-2 flex min-w-0 justify-center pt-1">
                <PathNode
                  mark={OUTCOME.mark}
                  markClass={`${OUTCOME.tone} text-[15px]`}
                  title={OUTCOME.title}
                  gain={OUTCOME.gain}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
