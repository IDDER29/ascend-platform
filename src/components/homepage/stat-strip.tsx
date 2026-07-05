const STATS = [
  { value: "4", label: "Levels, bottom-up" },
  { value: "24", label: "Concept lessons" },
  { value: "3", label: "Real projects to ship" },
  { value: "100%", label: "Free & open source" },
];

export function StatStrip() {
  return (
    <section className="animate-rise grid grid-cols-2 gap-3.5 py-2 sm:gap-4 lg:grid-cols-4">
      {STATS.map((s) => (
        <div
          key={s.label}
          className="rounded-[18px] border border-card-border bg-white px-5 py-6 text-center shadow-card-rest"
        >
          <div className="bg-gradient-to-r from-[#7B4DFF] to-[#C13AE0] bg-clip-text font-display text-3xl font-extrabold leading-none tracking-tight text-transparent sm:text-[38px]">
            {s.value}
          </div>
          <div className="mt-1.5 text-[13.5px] font-medium text-ink-secondary">{s.label}</div>
        </div>
      ))}
    </section>
  );
}
