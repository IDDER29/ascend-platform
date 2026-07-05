const FEATURES = [
  { color: "#FF6B4A", text: "Daily streaks that reward showing up" },
  { color: "#C6A6FF", text: "XP and levels for every concept mastered" },
  { color: "#FFD86B", text: "Badges for milestones worth remembering" },
];

export function MotivationBanner() {
  return (
    <section className="animate-rise relative my-16 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1B1730] via-[#2A2440] to-[#3A2A55] px-6 py-12 text-white sm:my-[70px] sm:px-12 sm:py-[52px]">
      <div className="animate-blob pointer-events-none absolute -right-10 -top-[90px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.4),transparent_66%)] blur-[12px]" />
      <div className="relative grid items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-3.5 font-mono text-[12.5px] uppercase tracking-[0.14em] text-[#C6A6FF]">
            Built to keep you going
          </div>
          <h2 className="mb-4 font-display text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[38px]">
            Motivation is a feature, not an afterthought.
          </h2>
          <p className="mb-6 max-w-[440px] text-base leading-relaxed text-[#C4BEDA]">
            Most people quit CS not from lack of ability, but lack of
            momentum. Ascend turns progress into something you can see and
            feel — every single day.
          </p>
          <div className="flex flex-col gap-3.5">
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-[15px] text-[#E7E2F2]">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-white/10">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {f.text}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-4 rounded-[18px] border border-white/10 bg-white/[0.06] p-5">
            <span className="animate-flame inline-block h-[35px] w-7 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-[#FFCE4A] to-[#FF6B4A]" />
            <div>
              <div className="font-display text-2xl font-extrabold leading-none">12-day streak</div>
              <div className="mt-0.5 text-[13px] text-[#B9B3D0]">Personal best · keep it alive</div>
            </div>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-white/[0.06] p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold">Level 8</span>
              <span className="font-mono text-xs text-[#B9B3D0]">1,800 / 2,000 XP</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.14]">
              <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] shadow-[0_0_12px_rgba(193,58,224,0.6)]" />
            </div>
          </div>
          <div className="flex gap-3">
            {[
              { grad: "from-[#FFE08A] to-[#FF8A4C]", glyph: "◈", color: "#FFD86B" },
              { grad: "from-[#9A6BF0] to-[#C13AE0]", glyph: "◆", color: "#C6A6FF" },
              { grad: "from-[#12B981] to-[#3BC6F0]", glyph: "▲", color: "#7BE3B0" },
            ].map((b, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${b.grad}`}>
                  <div
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#211B38] text-base"
                    style={{ color: b.color }}
                  >
                    {b.glyph}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
