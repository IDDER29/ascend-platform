import { Button } from "@/components/ui/button";
import { LESSON_URL } from "./header";

export function Hero() {
  return (
    <section className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-[74px]">
      <div className="animate-rise">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-card-border-soft bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#5A32D6] shadow-[0_4px_14px_rgba(28,18,64,0.05)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#12B981]" />
          Free · open-source · self-paced
        </div>
        <h1 className="mb-5 font-display text-[42px] font-extrabold leading-[1.03] tracking-[-0.035em] sm:text-[52px] lg:text-[60px]">
          Learn how computers{" "}
          <span className="bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] bg-clip-text text-transparent">
            really work.
          </span>
        </h1>
        <p className="mb-8 max-w-[490px] text-[17px] leading-relaxed text-ink-secondary sm:text-lg">
          Ascend teaches computer science bottom-up — from a single bit to a
          working shell. Clear lessons, hands-on drills, and real projects,
          with XP and streaks that make you want to come back.
        </p>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Button href={LESSON_URL} size="lg">
            Start learning free
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
          <Button href="#path" variant="secondary" size="lg">
            Browse the curriculum
          </Button>
        </div>
        <div className="font-mono text-[13px] text-ink-muted">
          No account needed to start · progress saves as you go
        </div>
      </div>

      <div className="animate-rise relative mb-12 lg:mb-0 lg:pb-10" style={{ animationDelay: "0.12s" }}>
        <div className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(123,77,255,0.22),transparent_62%)] blur-[10px]" />
        <div className="relative rounded-3xl border border-card-border-soft bg-white p-5 shadow-[0_30px_70px_rgba(60,40,120,0.16)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-level-02 font-mono text-sm font-bold text-white">
                *p
              </div>
              <div>
                <div className="text-[13.5px] font-bold">The C Language</div>
                <div className="font-mono text-[11px] text-ink-faint">Level 02 · 3/8</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-streak-border bg-streak-bg px-2.5 py-1">
              <span className="animate-flame inline-block h-3.5 w-[11px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-[#FFCE4A] to-[#FF6B4A]" />
              <span className="text-xs font-extrabold text-streak-text">12</span>
            </div>
          </div>
          <div className="mb-4 rounded-[14px] bg-[#181428] px-[18px] py-4 font-mono text-[13px] leading-[1.9] text-[#D8D4E6]">
            <div><span className="text-[#9B7BFF]">int</span>  x = <span className="text-[#FFC06B]">42</span>;</div>
            <div><span className="text-[#9B7BFF]">int</span> *p = &amp;x;</div>
            <div><span className="text-[#6BE3A3]">printf</span>(<span className="text-[#8FCF9A]">&quot;%d&quot;</span>, *p);</div>
          </div>
          <div className="flex flex-col gap-2.5">
            {["Binary & bits", "Logic gates"].map((label) => (
              <div key={label} className="flex items-center gap-2.5 rounded-[11px] px-2.5 py-2">
                <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[#12B981]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="text-[13px] font-semibold text-[#413D50]">{label}</span>
                <span className="ml-auto font-mono text-[10.5px] text-[#12A472]">+50</span>
              </div>
            ))}
            <div className="flex items-center gap-2.5 rounded-[11px] bg-[#FBF3FE] px-2.5 py-2 shadow-[inset_3px_0_0_#C13AE0]">
              <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border-2 border-[#C13AE0] bg-white">
                <span className="h-[7px] w-[7px] rounded-full bg-[#C13AE0]" />
              </span>
              <span className="text-[13px] font-bold text-[#5A32D6]">What a pointer is</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 left-4 flex items-center gap-2.5 rounded-2xl border border-card-border-soft bg-white px-4 py-3 shadow-[0_16px_34px_rgba(60,40,120,0.16)] sm:-left-6">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[conic-gradient(from_200deg,#FFE08A,#FF8A4C,#FFD86B)]">
            <div className="flex h-[29px] w-[29px] items-center justify-center rounded-full bg-white text-[#E0900A]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.6 5.8 21 7 14 2 9.3 9 8.5 12 2" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-[12.5px] font-extrabold">Badge earned!</div>
            <div className="text-[11px] text-ink-muted">Memory Master</div>
          </div>
        </div>
      </div>
    </section>
  );
}
