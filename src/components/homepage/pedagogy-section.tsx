import { BookOpen, Hammer, Zap, Bug, MessageSquare } from "lucide-react";
import { SectionBand } from "./section-band";
import { cn } from "@/lib/cn";
import { landingEyebrowClass } from "./landing-styles";

const STEPS = [
  {
    icon: BookOpen,
    title: "Learn",
    body: "A short, focused lesson on one concept — the mental model first, not just syntax.",
    accent: false,
  },
  {
    icon: Hammer,
    title: "Build",
    body: "Write real, runnable code that puts the idea to work immediately.",
    accent: false,
  },
  {
    icon: Zap,
    title: "Break",
    body: "Push it past its limits on purpose — overflow it, segfault it, race it — and see exactly how it fails.",
    accent: true,
  },
  {
    icon: Bug,
    title: "Debug",
    body: "Use real tools — gdb, valgrind, strace — to find out why it broke.",
    accent: false,
  },
  {
    icon: MessageSquare,
    title: "Explain",
    body: "Teach it back in the Knowledge Check. If you can't say it simply, you don't know it yet.",
    accent: false,
  },
];

const breakGlassInnerClass = [
  "relative grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 px-2.5 py-3.5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-5 sm:px-4 sm:py-5",
  "rounded-[16px] border border-white/75 bg-white/40 sm:rounded-[18px]",
  "shadow-[0_10px_32px_rgba(15,26,20,0.07),inset_0_1px_0_rgba(255,255,255,0.95)]",
  "backdrop-blur-2xl backdrop-saturate-150",
  "transition-[box-shadow,border-color] duration-200",
  "hover:border-white/90 hover:shadow-[0_14px_36px_rgba(15,26,20,0.09),inset_0_1px_0_rgba(255,255,255,1)]",
  "dark:border-white/[0.16] dark:bg-white/[0.09]",
  "dark:shadow-[0_16px_42px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.16)]",
  "dark:hover:border-white/[0.22]",
  "motion-reduce:bg-white/85 motion-reduce:backdrop-blur-none dark:motion-reduce:bg-elevated",
].join(" ");

/**
 * How you learn — stacked process rows.
 * Break is a frosted glass island: wash behind → blur → content.
 * Break icon keeps the brand gradient + crystal glaze.
 */
export function PedagogySection() {
  return (
    <SectionBand id="how" tone="tint" className="overflow-x-clip">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 xl:gap-16">
        <div className="animate-rise min-w-0 lg:sticky lg:top-[100px] lg:self-start">
          <div className={landingEyebrowClass}>How you learn</div>
          <h2 className="mb-3.5 max-w-xl font-display text-[clamp(1.6rem,4.5vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-balance">
            Reading a chapter isn&apos;t the same as knowing it.
          </h2>
          <p className="max-w-md text-[15.5px] leading-relaxed text-ink-secondary text-pretty sm:text-[16.5px]">
            Most courses stop at read-then-continue. Ascend adds the steps where
            understanding sticks.
          </p>
        </div>

        <ol className="flex min-w-0 flex-col">
          {STEPS.map((step, i) => {
            const nextAccent = STEPS[i + 1]?.accent;
            const prevAccent = i > 0 && STEPS[i - 1]?.accent;
            const showDivider = !step.accent && i > 0 && !prevAccent;

            const body = (
              <>
                <div className="relative flex flex-col items-center">
                  <span
                    className={cn(
                      "relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-white sm:h-12 sm:w-12 sm:rounded-[14px]",
                      step.accent ? "icon-crystal" : "bg-brand-gradient",
                    )}
                  >
                    <step.icon
                      className="relative z-[1] h-[18px] w-[18px] drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.28)] sm:h-[22px] sm:w-[22px]"
                      strokeWidth={2.2}
                    />
                  </span>
                  {i < STEPS.length - 1 ? (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-10 hidden w-px sm:top-12 sm:block",
                        step.accent
                          ? "bottom-[-0.35rem] bg-card-border/50"
                          : nextAccent
                            ? "bottom-1 bg-card-border"
                            : "bottom-[-1.35rem] bg-card-border",
                      )}
                    />
                  ) : null}
                </div>

                <div className="min-w-0 pt-0.5">
                  <div className="mb-1.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 sm:gap-x-2.5">
                    <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-muted sm:text-[11px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="min-w-0 font-display text-[17px] font-bold text-ink sm:text-[20px]">
                      {step.title}
                    </h3>
                    {step.accent ? (
                      <span className="rounded-full border border-brand-violet/25 bg-xp-bg/90 px-2 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.08em] text-xp-text sm:px-2.5 sm:text-[9px] dark:border-white/10 dark:bg-white/[0.08]">
                        The difference
                      </span>
                    ) : null}
                  </div>
                  <p className="max-w-xl text-[13.5px] leading-relaxed text-ink-secondary text-pretty sm:text-[15px]">
                    {step.body}
                  </p>
                </div>
              </>
            );

            return (
              <li
                key={step.title}
                className={cn(
                  "animate-rise relative min-w-0",
                  step.accent ? "z-[1] my-1.5" : "border border-transparent px-2.5 py-3.5 sm:px-4 sm:py-5",
                  !step.accent &&
                    "grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-5",
                  showDivider && "border-t-card-border/70",
                )}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {step.accent ? (
                  <>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-[-10px] -z-10 overflow-hidden"
                    >
                      <span className="absolute left-[6%] top-[18%] h-32 w-32 rounded-full bg-brand-violet/22 blur-3xl dark:bg-brand-violet/28" />
                      <span className="absolute bottom-[8%] right-[10%] h-28 w-28 rounded-full bg-brand-orange/18 blur-3xl dark:bg-brand-orange/22" />
                    </span>
                    <div className={breakGlassInnerClass}>{body}</div>
                  </>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </SectionBand>
  );
}
