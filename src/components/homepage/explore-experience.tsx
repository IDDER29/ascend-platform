import { Map, BookOpen, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { SectionBand } from "./section-band";
import { Button } from "@/components/ui/button";
import { CURRICULUM_HREF } from "@/lib/routes";
import { landingCardOnTintClass, landingCardTitleClass, landingIconTileClass } from "./landing-styles";

const STEPS = [
  {
    icon: Map,
    num: "01",
    title: "Open the map",
    tag: "Browse freely",
    body: "See all four topics at once. Nothing is locked — the order is a recommendation.",
  },
  {
    icon: BookOpen,
    num: "02",
    title: "Pick a lesson",
    tag: "Jump in",
    body: "Open any concept. Each page is short, focused, and readable without an account.",
  },
  {
    icon: CheckCircle2,
    num: "03",
    title: "Check yourself",
    tag: "Then continue",
    body: "A quick knowledge check at the end. Signed in? Mark it complete and move on.",
  },
];

/** How it feels — white cards on tint; same CTA language as the rest of the page. */
export function ExploreExperience() {
  return (
    <SectionBand id="explore" tone="tint">
      <SectionHeading
        eyebrow="How it feels"
        title="Explore at your own pace."
        subtitle="No gates, no fake progress walls — wander the path, then pick up where you left off."
      />

      <div className="mb-8 grid min-w-0 grid-cols-1 items-stretch gap-3 sm:mb-9 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className={`${landingCardOnTintClass}${i === 2 ? " sm:col-span-2 lg:col-span-1" : ""}`}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="mb-4 flex min-w-0 items-center justify-between gap-2">
              <div className={landingIconTileClass}>
                <step.icon size={20} strokeWidth={2.2} />
              </div>
              <span className="shrink-0 font-mono text-[10.5px] text-ink-muted sm:text-[11px]">
                Step {step.num}
              </span>
            </div>

            <h3 className={`mb-0.5 min-w-0 ${landingCardTitleClass}`}>{step.title}</h3>
            <div className="mb-4 text-[12.5px] text-ink-muted">{step.tag}</div>

            <p className="mt-auto min-w-0 text-[13px] leading-snug text-ink-secondary text-pretty sm:text-[13.5px]">
              {step.body}
            </p>
          </div>
        ))}
      </div>

      <div className="animate-rise flex justify-center px-1">
        <Button href={CURRICULUM_HREF} size="lg" variant="secondary" className="w-full max-w-xs sm:w-auto sm:max-w-none">
          View full curriculum
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
      </div>
    </SectionBand>
  );
}
