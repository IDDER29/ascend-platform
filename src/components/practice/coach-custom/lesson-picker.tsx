import type { CustomLesson, CustomPath, QuickPick } from "@/lib/practice/coach-custom-model";

const STRENGTHS = [
  { key: "new", label: "New", color: "bg-[var(--coach-scale-1)]" },
  { key: "learning", label: "Learning", color: "bg-[var(--coach-scale-2)]" },
  { key: "solid", label: "Solid", color: "bg-[var(--coach-scale-3)]" },
  { key: "mastered", label: "Mastered", color: "bg-[var(--coach-scale-4)]" },
] as const;

const QUICK_PICKS: { value: QuickPick; label: string }[] = [
  { value: "needs-work", label: "Needs work" },
  { value: "due", label: "Has due cards" },
  { value: "not-started", label: "Not started" },
];

function cards(n: number): string {
  return `${n} ${n === 1 ? "card" : "cards"}`;
}

function lessonMeta(lesson: CustomLesson): string {
  if (lesson.seen === 0) return `${cards(lesson.total)} · none seen yet`;
  return `${cards(lesson.total)} · ${lesson.due > 0 ? `${lesson.due} due` : "none due"}`;
}

function StrengthBar({ lesson }: { lesson: CustomLesson }) {
  const label = STRENGTHS.map((s) => `${s.label} ${lesson.strength[s.key]}`).join(", ");
  return (
    <span
      role="img"
      aria-label={label}
      className="flex h-1.5 w-16 shrink-0 gap-px overflow-hidden rounded-full bg-[var(--coach-scale-empty)]"
    >
      {STRENGTHS.filter((s) => lesson.strength[s.key] > 0).map((s) => (
        <span key={s.key} className={s.color} style={{ flex: `${lesson.strength[s.key]} 1 0` }} />
      ))}
    </span>
  );
}

function Tag({ tag }: { tag: CustomLesson["tag"] }) {
  if (!tag) return null;
  return (
    <span
      className={`inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-[11.5px] font-semibold ${
        tag === "needs-work"
          ? "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]"
          : "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-secondary)]"
      }`}
    >
      {tag === "needs-work" ? "Needs work" : "Not started"}
    </span>
  );
}

export function LessonPicker({
  paths,
  selected,
  quickPickCounts,
  onToggle,
  onSetMany,
  onQuickPick,
}: {
  paths: CustomPath[];
  selected: Set<string>;
  quickPickCounts: Record<QuickPick, number>;
  onToggle: (key: string) => void;
  onSetMany: (keys: string[], on: boolean) => void;
  onQuickPick: (pick: QuickPick) => void;
}) {
  return (
    <section
      aria-label="Lessons"
      className="flex min-w-0 flex-col gap-5 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[13px] font-semibold text-[var(--coach-ink-secondary)]">Quick picks</span>
        {QUICK_PICKS.map((pick) => (
          <button
            key={pick.value}
            type="button"
            disabled={quickPickCounts[pick.value] === 0}
            onClick={() => onQuickPick(pick.value)}
            className="flex h-9 items-center gap-1.5 rounded-full border-2 border-[var(--coach-border)] px-3 text-[13px] font-semibold text-[var(--coach-ink)] hover:border-[var(--coach-border-strong)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {pick.label}
            <span className="font-mono text-[11px] font-medium text-[var(--coach-ink-muted)]">
              {quickPickCounts[pick.value]}
            </span>
          </button>
        ))}
      </div>

      {paths.map((path) => {
        const allOn = path.lessonKeys.every((key) => selected.has(key));
        return (
          <div key={path.pathSlug} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3 border-b border-[var(--coach-divider)] pb-2">
              <h2 className="m-0 text-base font-semibold">
                {path.title}
                <span className="ml-2 text-[13px] font-normal text-[var(--coach-ink-muted)]">
                  {path.lessonKeys.length} {path.lessonKeys.length === 1 ? "lesson" : "lessons"} ·{" "}
                  {cards(path.cardCount)}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => onSetMany(path.lessonKeys, !allOn)}
                className="h-8 shrink-0 text-[13px] font-semibold text-[var(--coach-ink)] underline decoration-[var(--coach-border-strong)] underline-offset-4"
              >
                {allOn ? "Clear" : "Select all"}
              </button>
            </div>
            {path.sections.map((section) => (
              <div key={section.id} className="flex flex-col gap-1">
                <h3 className="m-0 text-[11.5px] font-semibold tracking-[0.06em] text-[var(--coach-ink-muted)] uppercase">
                  {section.title}
                </h3>
                <ul className="m-0 flex list-none flex-col p-0">
                  {section.lessons.map((lesson) => {
                    const checked = selected.has(lesson.key);
                    return (
                      <li key={lesson.key}>
                        <label
                          className={`-mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 ${
                            checked ? "bg-[var(--coach-selected-bg)]" : "hover:bg-[var(--coach-well)]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => onToggle(lesson.key)}
                            className="size-[18px] shrink-0 cursor-pointer accent-[var(--coach-blue)]"
                          />
                          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="text-[14.5px] font-medium [overflow-wrap:anywhere]">{lesson.title}</span>
                              <Tag tag={lesson.tag} />
                            </span>
                            <span className="text-[12.5px] text-[var(--coach-ink-muted)]">{lessonMeta(lesson)}</span>
                          </span>
                          <StrengthBar lesson={lesson} />
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--coach-divider)] pt-4 text-[12px] text-[var(--coach-ink-muted)]">
        <span>Finish more lessons to add their cards.</span>
        <span className="flex flex-wrap gap-3">
          {STRENGTHS.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-[2px] ${s.color}`} />
              {s.label}
            </span>
          ))}
        </span>
      </div>
    </section>
  );
}
