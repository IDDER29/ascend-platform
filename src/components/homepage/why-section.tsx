import {
  LineChart,
  CheckCircle2,
  Play,
  Layers3,
  Clock,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";

const REASONS = [
  {
    icon: LineChart,
    bg: "bg-xp-bg",
    fg: "text-brand-violet",
    title: "Bottom-up, on purpose",
    body: "We start at bits, logic and the CPU — so by the time you reach C and real systems, nothing feels like magic.",
  },
  {
    icon: CheckCircle2,
    bg: "bg-[#E7F8F0]",
    fg: "text-[#12A472]",
    title: "Curated, not endless",
    body: "One great lesson, the right video and a quick check per concept. Stop drowning in twelve open tabs.",
  },
  {
    icon: Play,
    bg: "bg-[#FBEBFA]",
    fg: "text-[#C13AE0]",
    title: "Learn by doing",
    body: "Runnable code in every lesson, spaced-repetition drills, and projects you actually build and defend.",
  },
  {
    icon: Layers3,
    bg: "bg-[#FFF1EC]",
    fg: "text-[#FF6B4A]",
    title: "Real projects",
    body: "Ship a shell, a formatter and your own C library. Pass the auto-grader, then unlock peer solutions.",
  },
  {
    icon: Clock,
    bg: "bg-[#FEF4E1]",
    fg: "text-[#E0900A]",
    title: "Momentum by design",
    body: "XP, streaks, badges and daily goals — the gentle pressure that turns learning into a daily habit.",
  },
  {
    icon: Users,
    bg: "bg-xp-bg",
    fg: "text-brand-violet",
    title: "Learn alongside others",
    body: "Compare approaches with a community walking the same path — real code from people who passed.",
  },
];

export function WhySection() {
  return (
    <section id="why" className="scroll-mt-[88px] py-16 sm:py-[70px]">
      <SectionHeading eyebrow="Why Ascend" title="Depth, without the overwhelm." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map((r, i) => (
          <Card
            key={r.title}
            className="animate-rise p-7"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={`mb-[18px] flex h-[46px] w-[46px] items-center justify-center rounded-[13px] ${r.bg} ${r.fg}`}>
              <r.icon size={22} strokeWidth={2.1} />
            </div>
            <h3 className="mb-2 font-display text-[19px] font-bold">{r.title}</h3>
            <p className="text-[14.5px] leading-relaxed text-ink-secondary">{r.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
