import Link from "next/link";

export function SelectionBar({
  count,
  href,
  full,
  max,
  onClear,
}: {
  count: number;
  href: string;
  full: boolean;
  max: number;
  onClear: () => void;
}) {
  return (
    <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl bg-[var(--coach-hero-bg)] px-5 py-3.5 text-[var(--coach-hero-ink)] shadow-[0_12px_32px_rgba(22,24,29,0.24)]">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[14.5px] font-semibold whitespace-nowrap" aria-live="polite">
          {count} selected
        </span>
        {full ? (
          <span className="text-[12.5px] text-[var(--coach-hero-muted)]">
            {max} is the most one session can hold.
          </span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClear}
        className="h-11 px-2 text-sm font-semibold text-[var(--coach-hero-muted)] hover:text-[var(--coach-hero-ink)]"
      >
        Clear
      </button>
      <Link
        href={href}
        className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--coach-lime)] px-5 sm:w-auto text-[14.5px] font-bold tracking-[0.02em] text-[var(--coach-lime-ink)] uppercase no-underline shadow-[0_4px_0_var(--coach-lime-shadow)]"
      >
        Practice {count === 1 ? "this card" : `these ${count}`}
      </Link>
    </div>
  );
}
