import Link from "next/link";
import { Map, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { SectionBand } from "./section-band";
import { Button } from "@/components/ui/button";
import { CURRICULUM_HREF, FIRST_LESSON_HREF } from "@/lib/routes";

const STEPS = [
  {
    icon: Map,
    title: "Open the map",
    body: "See all four levels at once. Nothing is locked — the order is a recommendation.",
  },
  {
    icon: BookOpen,
    title: "Pick a lesson",
    body: "Jump into any concept. Each page is short, focused, and readable without an account.",
  },
  {
    icon: CheckCircle2,
    title: "Check yourself",
    body: "A quick knowledge check at the end. When you're signed in, mark it complete and move on.",
  },
];

/** Calm student-explore story — how it feels to move through Ascend. */
export function ExploreExperience() {
  return (
    <SectionBand id="explore" tone="tint">
      <SectionHeading
        eyebrow="How it feels"
        title="Explore at your own pace."
        subtitle="No gates, no fake progress walls — just a clear path you can wander and resume."
      />
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
        {STEPS.map((step, i) => (
          <div key={step.title} className="animate-rise relative" style={{ animationDelay: `${i * 0.06}s` }}>
            {i < STEPS.length - 1 ? (
              <div
                aria-hidden
                className="absolute -right-3 top-10 z-10 hidden text-[#D3CDE4] md:block"
              >
                <ArrowRight size={18} strokeWidth={2} />
              </div>
            ) : null}
            <div className="h-full rounded-[20px] border border-[#E8E2F6] bg-white/80 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#F1EDFE] text-[#5A32D6]">
                <step.icon size={20} strokeWidth={2.1} />
              </div>
              <div className="mb-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-fainter">
                Step {i + 1}
              </div>
              <h3 className="mb-2 font-display text-[18px] font-bold">{step.title}</h3>
              <p className="text-[14px] leading-relaxed text-ink-secondary">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="animate-rise flex flex-wrap items-center justify-center gap-3">
        <Button href={CURRICULUM_HREF} variant="secondary" size="lg">
          Browse the curriculum
        </Button>
        <Link
          href={FIRST_LESSON_HREF}
          className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-[#5A32D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B4DFF]/40 focus-visible:ring-offset-2 rounded-sm"
        >
          Or open lesson 1
          <ArrowRight size={15} strokeWidth={2.4} />
        </Link>
      </div>
    </SectionBand>
  );
}
