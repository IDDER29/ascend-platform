import {
  LineChart,
  CheckCircle2,
  Layers3,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";
import { SectionBand } from "./section-band";

const REASONS = [
  {
    icon: LineChart,
    bg: "bg-xp-bg",
    fg: "text-brand-violet",
    title: "Bottom-up, on purpose",
    body: "We start at bits, logic and the CPU — so by the time you reach C and real systems, nothing feels like magic.",
    badge: null as string | null,
  },
  {
    icon: CheckCircle2,
    bg: "bg-[#FBEBFA]",
    fg: "text-[#C13AE0]",
    title: "Curated, not endless",
    body: "One great lesson, the right video and a quick check per concept. Stop drowning in twelve open tabs.",
    badge: null,
  },
  {
    icon: Layers3,
    bg: "bg-[#FFF1EC]",
    fg: "text-[#FF6B4A]",
    title: "A real capstone",
    body: "Finish the path with Shellforge — build toward a working shell. The project page is a walkthrough demo today; it sits at the end of the curriculum, not off to the side.",
    badge: null,
  },
  {
    icon: Users,
    bg: "bg-xp-bg",
    fg: "text-brand-violet",
    title: "Learn alongside others",
    body: "A preview of what's coming — sample threads you can poke at. The path never depends on it.",
    badge: "Preview",
  },
];

export function WhySection() {
  return (
    <SectionBand id="why" tone="wash">
      <SectionHeading eyebrow="Why Ascend" title="Depth, without the overwhelm." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {REASONS.map((r, i) => (
          <Card
            key={r.title}
            className="animate-rise relative p-7"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {r.badge ? (
              <span className="absolute right-5 top-5 rounded-full bg-[#F1EDFE] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#5A32D6]">
                {r.badge}
              </span>
            ) : null}
            <div className={`mb-[18px] flex h-[46px] w-[46px] items-center justify-center rounded-[13px] ${r.bg} ${r.fg}`}>
              <r.icon size={22} strokeWidth={2.1} />
            </div>
            <h3 className="mb-2 font-display text-[19px] font-bold">{r.title}</h3>
            <p className="text-[14.5px] leading-relaxed text-ink-secondary">{r.body}</p>
          </Card>
        ))}
      </div>
    </SectionBand>
  );
}
