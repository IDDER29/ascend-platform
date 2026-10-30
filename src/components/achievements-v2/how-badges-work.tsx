const RULES = [
  "Every badge comes from something you did: finishing lessons, shipping projects, holding cards solid in Practice.",
  "Nothing rewards the time of day or how fast you go.",
  "Memory badges stay while their cards stay solid. Review to keep them.",
  "Earned badges show on your profile, with the date you earned them.",
];

export function HowBadgesWork() {
  return (
    <section
      aria-labelledby="how-title"
      className="flex min-w-0 flex-col gap-3 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
    >
      <h2 id="how-title" className="m-0 text-base font-semibold">
        How badges are earned
      </h2>
      <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-[13.5px] leading-relaxed text-[var(--coach-ink-secondary)] marker:text-[var(--coach-ink-muted)]">
        {RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </section>
  );
}
