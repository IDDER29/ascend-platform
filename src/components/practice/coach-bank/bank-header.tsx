import Link from "next/link";

export function BankHeader({ total, dueToday }: { total: number; dueToday: number }) {
  return (
    <div className="flex flex-col gap-3">
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--coach-ink-muted)]">
        <Link href="/practicev2" className="text-[var(--coach-ink-muted)] no-underline hover:text-[var(--coach-ink)]">
          Practice
        </Link>
        <span aria-hidden="true" className="mx-1.5">
          /
        </span>
        <span aria-current="page" className="text-[var(--coach-ink)]">
          Card bank
        </span>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="m-0 font-display text-[28px] font-extrabold leading-tight tracking-[-0.032em] sm:text-[32px]">
            Card bank
          </h1>
          <p className="m-0 max-w-[560px] text-[15px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
            Every card you&apos;ve unlocked, how well you know it, and when it comes back.
          </p>
        </div>
        <p className="m-0 text-sm text-[var(--coach-ink-secondary)]">
          <strong className="font-mono font-semibold text-[var(--coach-ink)]">{total}</strong>{" "}
          {total === 1 ? "card" : "cards"} ·{" "}
          <strong
            className={`font-mono font-semibold ${
              dueToday > 0 ? "text-[var(--coach-tint-orange-ink)]" : "text-[var(--coach-ink)]"
            }`}
          >
            {dueToday}
          </strong>{" "}
          due today
        </p>
      </div>
    </div>
  );
}
