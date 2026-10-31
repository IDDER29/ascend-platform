export function KeyIdea({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-r-xl border-l-4 border-brand-violet bg-xp-bg/45 px-5 py-4 dark:bg-xp-bg/35">
      <div className="mb-1 text-sm font-extrabold text-xp-text">Key idea</div>
      <div className="text-[15.5px] leading-relaxed text-ink-secondary">{children}</div>
    </div>
  );
}
