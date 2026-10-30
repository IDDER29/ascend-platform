const FEATURES = [
  { color: "#0D9F6E", text: "Progress saved when you sign in" },
  { color: "#1A9B8E", text: "A clear path from bit to shell" },
  { color: "#D4A017", text: "Knowledge checks after every concept" },
];

export function MotivationBanner() {
  return (
    <section className="scroll-mt-[88px] py-16 sm:py-[70px]">
      <div className="animate-rise overflow-hidden rounded-[28px] bg-landing-ink px-7 py-10 text-white sm:px-10 sm:py-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-3.5 font-mono text-[12.5px] uppercase tracking-[0.14em] text-brand-orange">
              Built for focus
            </div>
            <h2 className="mb-4 max-w-[420px] font-display text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[36px]">
              Stay with the path — not twelve open tabs.
            </h2>
            <div className="flex flex-col gap-3">
              {FEATURES.map((f) => (
                <div key={f.text} className="flex items-center gap-3 text-[14.5px] text-white/80">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-white/50">
              <span>Bits &amp; Logic</span>
              <span>2 / 6</span>
            </div>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[34%] rounded-full bg-brand-gradient" />
            </div>
            <div className="flex gap-2">
              {[
                { grad: "from-[#0D9F6E] to-[#1A9B8E]", glyph: "◇" },
                { grad: "from-[#1A9B8E] to-[#D4A017]", glyph: "◆" },
                { grad: "from-[#D4A017] to-[#C46A2B]", glyph: "⬢" },
              ].map((b) => (
                <div
                  key={b.glyph}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${b.grad} text-lg text-white`}
                >
                  {b.glyph}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
