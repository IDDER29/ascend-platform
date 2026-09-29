import Link from "next/link";

export function CoachBreadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--coach-ink-muted)]">
      <Link href="/practicev2" className="text-[var(--coach-ink-muted)] no-underline hover:text-[var(--coach-ink)]">
        Practice
      </Link>
      <span aria-hidden="true" className="mx-1.5">
        /
      </span>
      <span aria-current="page" className="text-[var(--coach-ink)]">
        {current}
      </span>
    </nav>
  );
}
