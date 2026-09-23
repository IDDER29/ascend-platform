import { Layers, Focus, Hammer, Users } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { SectionBand } from "./section-band";
import { landingCardClass, landingCardTitleClass } from "./landing-styles";

const REASONS = [
  {
    icon: Layers,
    title: "Bottom-up, on purpose",
    body: "We start at bits, logic and the CPU — so by the time you reach C and real systems, nothing feels like magic.",
    badge: null as string | null,
  },
  {
    icon: Focus,
    title: "Curated, not endless",
    body: "One great lesson, the right video and a quick check per concept. Stop drowning in twelve open tabs.",
    badge: null,
  },
  {
    icon: Hammer,
    title: "A real capstone",
    body: "Finish with Shellforge — build toward a working shell. Labeled demo today; it sits at the end of the path, not off to the side.",
    badge: null,
  },
  {
    icon: Users,
    title: "Learn alongside others",
    body: "A preview of what's coming — sample threads you can poke at. The path never depends on it.",
    badge: "Preview",
  },
];

/** Why Ascend — same card language as Inside the levels. Display-only. */
export function WhySection() {
  return (
    <SectionBand id="why" tone="paper">
      <SectionHeading
        eyebrow="Why Ascend"
        title="Depth, without the overwhelm."
        subtitle="Built for people who want the real model — not another endless feed of tutorials."
      />
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5">
        {REASONS.map((r, i) => (
          <article
            key={r.title}
            className={`relative min-w-0 ${landingCardClass}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {r.badge ? (
              <span className="absolute right-4 top-4 rounded-full bg-xp-bg px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.08em] text-xp-text sm:right-5 sm:top-5 sm:px-2.5 sm:text-[10px]">
                {r.badge}
              </span>
            ) : null}
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] bg-brand-gradient text-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] sm:h-11 sm:w-11 sm:rounded-[13px] dark:shadow-none">
              <r.icon size={20} strokeWidth={2.2} />
            </div>
            <h3 className={`mb-2 min-w-0 ${r.badge ? "pr-16" : ""} ${landingCardTitleClass}`}>{r.title}</h3>
            <p className="min-w-0 text-[14px] leading-relaxed text-ink-secondary text-pretty sm:text-[14.5px]">
              {r.body}
            </p>
          </article>
        ))}
      </div>
    </SectionBand>
  );
}
