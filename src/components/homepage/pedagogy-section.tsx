import { BookOpen, Hammer, Zap, Bug, MessageSquare } from "lucide-react";
import { SectionBand } from "./section-band";
import { cn } from "@/lib/cn";
import {
  glassSurfaceClass,
  glassWashClass,
  landingEyebrowClass,
  landingH2Class,
  landingIconCrystalClass,
  landingIconTileClass,
  landingLeadClass,
} from "./landing-styles";

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

const breakInnerLayoutClass =
  "relative grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 px-2.5 py-3.5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-5 sm:px-4 sm:py-5";

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
          <h2 className={landingH2Class}>
            Reading a chapter isn&apos;t the same as knowing it.
          </h2>
          <p className={landingLeadClass}>
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
                      "relative z-[1]",
                      step.accent ? landingIconCrystalClass : landingIconTileClass,
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
                    <span aria-hidden className={glassWashClass} />
                    <div className={cn(glassSurfaceClass, breakInnerLayoutClass)}>{body}</div>
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
