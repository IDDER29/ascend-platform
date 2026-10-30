import { CoachBreadcrumb } from "@/components/practice/coach-breadcrumb";
import { PageHeader } from "@/components/ui/page-header";

export function BankHeader({ total, dueNow }: { total: number; dueNow: { reviews: number; fresh: number } }) {
  const num = (n: number, warn = false) => (
    <strong
      className={`font-mono font-semibold ${warn && n > 0 ? "text-[var(--coach-tint-orange-ink)]" : "text-[var(--coach-ink)]"}`}
    >
      {n}
    </strong>
  );
  return (
    <PageHeader
      breadcrumb={<CoachBreadcrumb current="Card bank" />}
      title="Card bank"
      lead="Every card you've unlocked, how well you know it, and when it comes back."
      aside={
        <p className="m-0 text-sm text-[var(--coach-ink-secondary)]">
          {num(total)} {total === 1 ? "card" : "cards"} · due now: {num(dueNow.reviews, true)}{" "}
          {dueNow.reviews === 1 ? "review" : "reviews"} + {num(dueNow.fresh)} new
        </p>
      }
    />
  );
}
