import { CoachBreadcrumb } from "@/components/practice/coach-breadcrumb";
import { PageHeader } from "@/components/ui/page-header";

export function BankHeader({ total, dueToday }: { total: number; dueToday: number }) {
  return (
    <PageHeader
      breadcrumb={<CoachBreadcrumb current="Card bank" />}
      title="Card bank"
      lead="Every card you've unlocked, how well you know it, and when it comes back."
      aside={
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
      }
    />
  );
}
