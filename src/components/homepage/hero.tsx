import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CURRICULUM_HREF, FIRST_LESSON_HREF } from "@/lib/routes";

const TRAIL = [
  { num: "00", name: "Bits", tone: "bg-level-00", href: `${CURRICULUM_HREF}#level-00-bits-logic` },
  { num: "01", name: "Machine", tone: "bg-level-01", href: `${CURRICULUM_HREF}#level-01-machine-memory` },
  { num: "02", name: "C", tone: "bg-level-02", href: `${CURRICULUM_HREF}#level-02-the-c-language` },
  { num: "03", name: "Systems", tone: "bg-level-03", href: `${CURRICULUM_HREF}#level-03-systems-software` },
];

/** Centered trailhead — brand + thesis + path preview. No floating product card. */
export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_-10%,rgba(123,77,255,0.18),transparent_55%),radial-gradient(60%_50%_at_85%_40%,rgba(255,107,74,0.10),transparent_50%)]"
      />
      <div className="relative mx-auto flex w-full max-w-[920px] flex-col items-center px-6 pb-16 pt-14 text-center sm:px-8 sm:pb-20 sm:pt-[72px]">
        <p className="animate-rise mb-5 font-display text-[15px] font-bold tracking-[0.02em] text-[#5A32D6] sm:text-base">
          Ascend
        </p>
        <h1 className="animate-rise mb-5 max-w-[780px] font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[56px] lg:text-[64px]">
          Learn how computers{" "}
          <span className="bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] bg-clip-text text-transparent">
            really work.
          </span>
        </h1>
        <p
          className="animate-rise mb-9 max-w-[520px] text-[17px] leading-relaxed text-ink-secondary sm:text-lg"
          style={{ animationDelay: "0.06s" }}
        >
          A free, bottom-up path — from a single bit to a working shell.
          Open every lesson. Sign in only when you want progress saved.
        </p>
        <div
          className="animate-rise mb-4 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.1s" }}
        >
          <Button href={CURRICULUM_HREF} size="lg">
            Start the path
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
          <Button
            href={FIRST_LESSON_HREF}
            variant="secondary"
            size="lg"
            className="border-[#C9B8F5] text-[#5A32D6] hover:border-[#A78BFA] hover:bg-[#F8F5FF]"
          >
            Start lesson 1
          </Button>
        </div>
        <p
          className="animate-rise mb-12 font-mono text-[12.5px] text-ink-muted"
          style={{ animationDelay: "0.14s" }}
        >
          No account needed · 4 levels · 24 lessons
        </p>

        {/* Path trail — the hero visual is the curriculum itself */}
        <div
          className="animate-rise w-full max-w-[640px] pb-6"
          style={{ animationDelay: "0.18s" }}
          aria-label="Curriculum trail preview"
        >
          <div className="relative flex items-start justify-between gap-2">
            <div
              aria-hidden
              className="absolute left-[12%] right-[12%] top-[22px] h-px bg-gradient-to-r from-[#12B981] via-[#7B4DFF] to-[#FF6B4A] opacity-40"
            />
            {TRAIL.map((node, i) => (
              <Link
                key={node.num}
                href={node.href}
                className="group relative z-[1] flex flex-1 flex-col items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B4DFF]/45 focus-visible:ring-offset-2"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${node.tone} font-display text-[15px] font-extrabold text-white shadow-[0_10px_22px_rgba(28,18,64,0.16)] transition-transform duration-200 group-hover:-translate-y-0.5`}
                >
                  {node.num}
                </span>
                <span className="font-mono text-[11px] font-bold tracking-[0.04em] text-ink-muted group-hover:text-ink">
                  {node.name}
                </span>
                {i === 0 ? (
                  <span className="absolute -bottom-5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#12B981]">
                    Start
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
