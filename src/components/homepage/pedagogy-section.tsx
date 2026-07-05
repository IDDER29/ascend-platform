import { BookOpen, Hammer, Zap, Bug, MessageSquare } from "lucide-react";
import { SectionHeading } from "./section-heading";

const STEPS = [
  {
    icon: BookOpen,
    title: "Learn",
    body: "A short, focused lesson on one concept — the mental model first, not just syntax.",
  },
  {
    icon: Hammer,
    title: "Build",
    body: "Write real, runnable code that puts the idea to work immediately, not just reads about it.",
  },
  {
    icon: Zap,
    title: "Break",
    body: "Push it past its limits on purpose — overflow it, segfault it, race it — and see exactly how it fails.",
  },
  {
    icon: Bug,
    title: "Debug",
    body: "Use real tools — gdb, valgrind, strace — to find out why it broke. The skill you'll actually use for years.",
  },
  {
    icon: MessageSquare,
    title: "Explain",
    body: "Teach it back in your own words in the Knowledge Check. If you can't say it simply, you don't know it yet.",
  },
];

export function PedagogySection() {
  return (
    <section id="how" className="scroll-mt-[88px] py-16 sm:py-[70px]">
      <SectionHeading
        eyebrow="How you actually learn here"
        title="Reading a chapter isn't the same as knowing it."
        subtitle="Most courses stop at “read, then continue.” Ascend adds three more steps most skip — because that's where real understanding comes from."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="animate-rise relative"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            {i < STEPS.length - 1 && (
              <div className="absolute -right-[18px] top-9 z-10 hidden text-[#D3CDE4] lg:block">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            )}
            <div className="h-full rounded-[20px] border border-card-border bg-white p-6 shadow-card-rest">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[14px] bg-brand-gradient text-white shadow-glow">
                <step.icon size={20} strokeWidth={2.2} />
              </div>
              <div className="mb-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-fainter">
                Step {i + 1}
              </div>
              <h3 className="mb-2 font-display text-[18px] font-bold">{step.title}</h3>
              <p className="text-[13.5px] leading-relaxed text-ink-secondary">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
