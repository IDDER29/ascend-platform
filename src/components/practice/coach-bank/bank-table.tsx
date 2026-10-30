import Link from "next/link";
import { practiceCardHref } from "@/lib/practice/routes";
import { useEffect, useRef } from "react";
import type { BankFormat, BankRow, BankStrength } from "@/lib/practice/coach-bank-model";

const FORMAT_TINTS: Record<BankFormat, string> = {
  mcq: "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]",
  flashcard: "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]",
  typed: "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]",
  cloze: "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-secondary)]",
  output: "bg-[var(--coach-code-bg)] text-[var(--coach-code-ink)]",
  bug: "bg-[var(--coach-wrong-bg)] text-[var(--coach-wrong-title)]",
};

const STRENGTH_LEVELS: Record<BankStrength, { label: string; filled: number; color: string }> = {
  new: { label: "New", filled: 1, color: "bg-[var(--coach-scale-1)]" },
  learning: { label: "Learning", filled: 2, color: "bg-[var(--coach-scale-2)]" },
  solid: { label: "Solid", filled: 3, color: "bg-[var(--coach-scale-3)]" },
  mastered: { label: "Mastered", filled: 4, color: "bg-[var(--coach-scale-4)]" },
};

const CHECKBOX =
  "size-[18px] shrink-0 cursor-pointer accent-[var(--coach-blue)] disabled:cursor-not-allowed disabled:opacity-40";

type RowProps = {
  row: BankRow;
  href: string | undefined;
  checked: boolean;
  disabled: boolean;
  onToggle: (id: string) => void;
};

function FormatBadge({ row }: { row: BankRow }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-md px-2 text-[12px] font-semibold whitespace-nowrap ${FORMAT_TINTS[row.format]}`}
    >
      {row.formatLabel}
    </span>
  );
}

function StrengthMeter({ strength }: { strength: BankStrength }) {
  const level = STRENGTH_LEVELS[strength];
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span aria-hidden="true" className="flex items-end gap-0.5">
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={`w-1.5 rounded-sm ${step <= level.filled ? level.color : "bg-[var(--coach-scale-empty)]"}`}
            style={{ height: 6 + step * 2 }}
          />
        ))}
      </span>
      {level.label}
    </span>
  );
}

function DueLabel({ row }: { row: BankRow }) {
  return (
    <span
      className={
        row.dueToday
          ? "font-semibold text-[var(--coach-tint-orange-ink)]"
          : row.strength === "new"
            ? "text-[var(--coach-ink-muted)]"
            : undefined
      }
    >
      {row.dueLabel}
    </span>
  );
}

function Score({ row }: { row: BankRow }) {
  return row.seen > 0 ? (
    <span className="font-mono">
      {row.correct}/{row.seen}
    </span>
  ) : (
    <span className="text-[var(--coach-ink-muted)]" aria-label="Not answered yet">
      —
    </span>
  );
}

function LessonLink({ row, href }: { row: BankRow; href: string | undefined }) {
  return href ? (
    <Link
      href={href}
      className="text-[var(--coach-ink-secondary)] underline decoration-[var(--coach-border-strong)] underline-offset-2 hover:text-[var(--coach-ink)]"
    >
      {row.lessonTitle}
    </Link>
  ) : (
    <span className="text-[var(--coach-ink-secondary)]">{row.lessonTitle}</span>
  );
}

function RowCheckbox({ row, checked, disabled, onToggle }: Omit<RowProps, "href">) {
  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled && !checked}
      onChange={() => onToggle(row.id)}
      aria-label={`Select “${row.text}”`}
      className={CHECKBOX}
    />
  );
}

function TableRow(props: RowProps) {
  const { row, href, checked } = props;
  return (
    <tr
      className={`border-t border-[var(--coach-divider)] align-middle ${
        checked ? "bg-[var(--coach-selected-bg)]" : ""
      }`}
    >
      <td className="py-3 pr-2 pl-4">
        <RowCheckbox {...props} />
      </td>
      <td className="max-w-0 py-3 pr-4">
        <Link
          href={practiceCardHref(row.id)}
          className="line-clamp-2 text-sm font-medium text-[var(--coach-ink)] no-underline [overflow-wrap:anywhere] hover:underline"
        >
          {row.text}
        </Link>
        <span className="mt-0.5 block truncate text-[12.5px]">
          <LessonLink row={row} href={href} />
        </span>
      </td>
      <td className="py-3 pr-4">
        <FormatBadge row={row} />
      </td>
      <td className="py-3 pr-4 text-[13px]">
        <StrengthMeter strength={row.strength} />
      </td>
      <td className="py-3 pr-4 text-[13px] whitespace-nowrap">
        <DueLabel row={row} />
      </td>
      <td className="py-3 pr-4 text-right text-[13px]">
        <Score row={row} />
      </td>
    </tr>
  );
}

function StackedRow(props: RowProps) {
  const { row, href, checked } = props;
  return (
    <li
      className={`flex gap-3 border-t border-[var(--coach-divider)] px-4 py-3.5 first:border-t-0 ${
        checked ? "bg-[var(--coach-selected-bg)]" : ""
      }`}
    >
      <span className="pt-0.5">
        <RowCheckbox {...props} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Link
          href={practiceCardHref(row.id)}
          className="text-sm font-medium text-[var(--coach-ink)] no-underline [overflow-wrap:anywhere] hover:underline"
        >
          {row.text}
        </Link>
        <span className="truncate text-[12.5px]">
          <LessonLink row={row} href={href} />
        </span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px]">
          <FormatBadge row={row} />
          <StrengthMeter strength={row.strength} />
          <DueLabel row={row} />
          <span className="ml-auto">
            <Score row={row} />
          </span>
        </span>
      </div>
    </li>
  );
}

function SelectAll({
  rows,
  selected,
  full,
  onToggleAll,
}: {
  rows: BankRow[];
  selected: Set<string>;
  full: boolean;
  onToggleAll: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const picked = rows.filter((row) => selected.has(row.id)).length;
  const all = rows.length > 0 && picked === rows.length;
  const some = picked > 0 && !all;

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = some;
  }, [some]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={all}
      disabled={rows.length === 0 || (full && picked === 0)}
      onChange={onToggleAll}
      aria-label={all || some ? "Clear selection of shown cards" : "Select shown cards"}
      className={CHECKBOX}
    />
  );
}

export function BankTable({
  rows,
  selected,
  full,
  reviewHrefs,
  onToggle,
  onToggleAll,
  onClearFilters,
}: {
  rows: BankRow[];
  selected: Set<string>;
  full: boolean;
  reviewHrefs: Record<string, string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onClearFilters: () => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[var(--coach-border)] px-6 py-12 text-center">
        <p className="m-0 text-[15px] text-[var(--coach-ink-secondary)]">No cards match these filters.</p>
        <button
          type="button"
          onClick={onClearFilters}
          className="h-10 rounded-xl border-2 border-[var(--coach-border-strong)] px-4 text-sm font-semibold text-[var(--coach-ink)]"
        >
          Clear filters
        </button>
      </div>
    );
  }

  const rowProps = (row: BankRow): RowProps => ({
    row,
    href: reviewHrefs[row.id],
    checked: selected.has(row.id),
    disabled: full,
    onToggle,
  });

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]">
      <table className="hidden w-full border-collapse text-left sm:table">
        <thead>
          <tr className="text-[12px] font-semibold tracking-[0.04em] text-[var(--coach-ink-muted)] uppercase">
            <th scope="col" className="w-10 py-3 pr-2 pl-4">
              <SelectAll rows={rows} selected={selected} full={full} onToggleAll={onToggleAll} />
            </th>
            <th scope="col" className="w-full py-3 pr-4 font-semibold">
              Card
            </th>
            <th scope="col" className="py-3 pr-4 font-semibold">
              Format
            </th>
            <th scope="col" className="py-3 pr-4 font-semibold">
              Strength
            </th>
            <th scope="col" className="py-3 pr-4 font-semibold">
              Next due
            </th>
            <th scope="col" className="py-3 pr-4 text-right font-semibold">
              Correct
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <TableRow key={row.id} {...rowProps(row)} />
          ))}
        </tbody>
      </table>
      <div className="sm:hidden">
        <label className="flex items-center gap-3 border-b border-[var(--coach-divider)] px-4 py-3 text-[13px] font-semibold text-[var(--coach-ink-secondary)]">
          <SelectAll rows={rows} selected={selected} full={full} onToggleAll={onToggleAll} />
          Select shown cards
        </label>
        <ul className="m-0 list-none p-0">
          {rows.map((row) => (
            <StackedRow key={row.id} {...rowProps(row)} />
          ))}
        </ul>
      </div>
    </div>
  );
}
