export function LearningOutcomes({
  title,
  outcomes,
}: {
  title: string;
  outcomes: string[];
}) {
  return (
    <div className="my-2 rounded-[18px] border border-card-border bg-white px-6 py-6 shadow-card-rest">
      <div className="mb-1.5 flex items-center gap-2.5">
        <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg bg-[#E7F8F0] text-[#12A472]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        </span>
        <h2 className="font-display text-lg font-extrabold tracking-tight">
          By the end, you&apos;ll be able to
        </h2>
      </div>
      <p className="mb-4 text-[13.5px] text-ink-muted">
        This is what mastering &ldquo;{title}&rdquo; actually means — the Knowledge
        Check maps straight back to these.
      </p>
      <div className="flex flex-col gap-2.5">
        {outcomes.map((o, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-[6px] bg-xp-bg text-brand-violet">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span className="text-[14.5px] leading-relaxed text-[#413D50]">{o}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
