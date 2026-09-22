const POINTS = [
  {
    title: "Lessons as plain files",
    body: "Content lives as MDX in the curriculum folder — editable, reviewable, versioned. A public repo is on the roadmap.",
  },
  {
    title: "No account, no paywall",
    body: "The full path is free forever. Sign in when you want completed lessons saved. No fake XP wall between you and the material.",
  },
  {
    title: "No growth theater",
    body: "Ascend has no investors and no growth targets — just a curriculum we wanted to exist.",
  },
];

/** Full-bleed dark band — tonal break before the final CTA. */
export function OpenSourceStrip() {
  return (
    <section className="bg-[#181428] py-14 text-white sm:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <div className="animate-rise mb-9 text-center">
          <div className="mb-3 font-mono text-[12.5px] uppercase tracking-[0.14em] text-[#C6A6FF]">
            Open by design
          </div>
          <h2 className="mx-auto max-w-[560px] font-display text-[28px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[32px]">
            No gatekeeping.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {POINTS.map((p, i) => (
            <div
              key={p.title}
              className="animate-rise"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <h3 className="mb-2 font-display text-[17px] font-bold text-white">{p.title}</h3>
              <p className="text-[14px] leading-relaxed text-[#B9B3D0]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
