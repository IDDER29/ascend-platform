import Link from "next/link";
import type { CoachCompleteLink } from "@/lib/practice/coach-complete-model";

export function CompleteActions({
  primary,
  secondary,
}: {
  primary: CoachCompleteLink;
  secondary: CoachCompleteLink | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href={primary.href}
        className="mb-1 flex h-11 items-center justify-center gap-2.5 rounded-xl bg-[var(--coach-lime)] px-5 text-[14.5px] font-bold tracking-[0.02em] text-[var(--coach-lime-ink)] no-underline shadow-[0_4px_0_var(--coach-lime-shadow)]"
      >
        {primary.label}
        <kbd className="hidden h-[22px] items-center rounded-md border border-b-2 border-[var(--coach-lime-shadow)] bg-[var(--coach-lime-soft)] px-1.5 font-mono text-[11px] font-medium normal-case tracking-normal sm:inline-flex">
          Enter
        </kbd>
      </Link>
      {secondary ? (
        <Link
          href={secondary.href}
          className="flex h-11 items-center justify-center rounded-xl border-2 border-[var(--coach-border-strong)] text-sm font-semibold text-[var(--coach-ink)] no-underline"
        >
          {secondary.label}
        </Link>
      ) : null}
    </div>
  );
}
