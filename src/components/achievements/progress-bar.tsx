export function ProgressBar({ done, total, label }: { done: number; total: number; label?: string }) {
  return (
    <span role="img" aria-label={label ?? `${done} of ${total}`} className="block h-1.5 w-full overflow-hidden rounded-full bg-[var(--coach-scale-empty)]">
      <span className="block h-full rounded-full bg-[var(--coach-blue)]" style={{ width: `${Math.round((done / Math.max(1, total)) * 100)}%` }} />
    </span>
  );
}
