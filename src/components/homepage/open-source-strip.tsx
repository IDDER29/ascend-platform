const POINTS = [
  {
    title: "Every lesson is a file you can edit",
    body: "Content lives as plain files in the repo. Spot a typo or a better explanation? Open a pull request.",
  },
  {
    title: "No account, no paywall",
    body: "The full curriculum is free forever. Progress saves locally — sign in only if you want it synced.",
  },
  {
    title: "Built in public, from day one",
    body: "Ascend has no investors and no growth targets — just a curriculum we wanted to exist.",
  },
];

export function OpenSourceStrip() {
  return (
    <section className="py-16 sm:py-[70px]">
      <div className="animate-rise mb-11 text-center">
        <div className="mb-3.5 font-mono text-[12.5px] uppercase tracking-[0.14em] text-brand-violet">
          Open source
        </div>
        <h2 className="mx-auto max-w-[640px] font-display text-[32px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[42px]">
          No gatekeeping, by design.
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {POINTS.map((p, i) => (
          <div
            key={p.title}
            className="animate-rise rounded-[20px] border border-card-border bg-white p-7 shadow-card-rest"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <h3 className="mb-2 font-display text-[17px] font-bold">{p.title}</h3>
            <p className="text-[14px] leading-relaxed text-ink-secondary">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
