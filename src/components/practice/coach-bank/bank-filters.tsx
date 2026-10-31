import type { MasterySkill } from "@/lib/practice/mastery";
import type {
  BankFilters as Filters,
  BankFormat,
  BankStrength,
  CoachBankModel,
} from "@/lib/practice/coach-bank-model";

export const EMPTY_BANK_FILTERS: Filters = {
  query: "",
  lesson: null,
  format: null,
  strength: null,
  skill: null,
};

export function hasBankFilters(filters: Filters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.lesson !== null ||
    filters.format !== null ||
    filters.strength !== null ||
    Boolean(filters.skill)
  );
}

const STRENGTHS: { value: BankStrength | null; label: string }[] = [
  { value: null, label: "All" },
  { value: "new", label: "New" },
  { value: "learning", label: "Learning" },
  { value: "solid", label: "Solid" },
  { value: "mastered", label: "Mastered" },
];

const FIELD =
  "h-11 rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-3 text-sm text-[var(--coach-ink)] outline-none focus-visible:border-[var(--coach-focus)]";

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[var(--coach-ink-muted)]"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function BankFilters({
  model,
  filters,
  onChange,
}: {
  model: CoachBankModel;
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const total = model.total;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,1fr)_190px_160px_150px] sm:gap-3">
        <label className="relative col-span-2 sm:col-span-1">
          <span className="sr-only">Search cards</span>
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--coach-ink-muted)]"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            placeholder="Search cards or lessons"
            className={`${FIELD} w-full pl-10 placeholder:text-[var(--coach-ink-muted)]`}
          />
        </label>
        <label className="relative min-w-0">
          <span className="sr-only">Lesson</span>
          <select
            value={filters.lesson ?? ""}
            onChange={(event) => onChange({ ...filters, lesson: event.target.value || null })}
            className={`${FIELD} w-full appearance-none truncate pr-9`}
          >
            <option value="">All lessons</option>
            {model.lessons.map((lesson) => (
              <option key={lesson.key} value={lesson.key}>
                {lesson.title}
              </option>
            ))}
          </select>
          <ChevronDown />
        </label>
        <label className="relative min-w-0">
          <span className="sr-only">Format</span>
          <select
            value={filters.format ?? ""}
            onChange={(event) =>
              onChange({ ...filters, format: (event.target.value || null) as BankFormat | null })
            }
            className={`${FIELD} w-full appearance-none pr-9`}
          >
            <option value="">All formats</option>
            {model.formats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
          <ChevronDown />
        </label>
        <label className="relative col-span-2 min-w-0 sm:col-span-1">
          <span className="sr-only">Skill</span>
          <select
            value={filters.skill ?? ""}
            onChange={(event) =>
              onChange({ ...filters, skill: (event.target.value || null) as MasterySkill | null })
            }
            className={`${FIELD} w-full appearance-none pr-9`}
          >
            <option value="">All skills</option>
            {model.skills.map((skill) => (
              <option key={skill.value} value={skill.value}>
                {skill.label} ({skill.count})
              </option>
            ))}
          </select>
          <ChevronDown />
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="radiogroup"
          aria-label="Card strength"
          className="grid w-full grid-cols-5 gap-0.5 rounded-xl bg-[var(--coach-well)] p-1 sm:flex sm:w-auto"
        >
          {STRENGTHS.map((option) => {
            const active = filters.strength === option.value;
            const count = option.value ? model.strengthCounts[option.value] : total;
            return (
              <button
                key={option.label}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange({ ...filters, strength: option.value })}
                className={`flex h-12 min-w-0 flex-col items-center justify-center rounded-lg px-1 text-[13px] font-semibold sm:h-9 sm:flex-row sm:gap-1.5 sm:px-3 ${
                  active
                    ? "bg-[var(--coach-segment-active)] text-[var(--coach-ink)] shadow-[var(--coach-segment-shadow)]"
                    : "text-[var(--coach-ink-secondary)] hover:text-[var(--coach-ink)]"
                }`}
              >
                {option.label}
                <span className="font-mono text-[11px] font-medium text-[var(--coach-ink-muted)]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        {hasBankFilters(filters) ? (
          <button
            type="button"
            onClick={() => onChange(EMPTY_BANK_FILTERS)}
            className="h-9 px-1 text-[13px] font-semibold text-[var(--coach-ink)] underline decoration-[var(--coach-border-strong)] underline-offset-4"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
