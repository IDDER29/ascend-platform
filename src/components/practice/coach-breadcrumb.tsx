import Link from "next/link";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";

export function CoachBreadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--coach-ink-muted)]">
      <Link href={PRACTICE_ROUTES.home} className="text-[var(--coach-ink-muted)] no-underline hover:text-[var(--coach-ink)]">
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
