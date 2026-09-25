import Link from "next/link";
import { ChevronRight, ClipboardCheck, Sparkles } from "lucide-react";
import { DEMO_MONTH_PULSE } from "@/lib/dashboard/mock-standing";
import { PathMarkRing } from "@/components/paths/path-catalog";
import {
  pathHref,
  pathMark,
  pathSkillsCounts,
  pathTypeMeta,
  type PathDef,
} from "@/lib/paths/catalog";
import { cn } from "@/lib/cn";
import { formatPathTenure } from "@/lib/dashboard/tenure";
import { unselectPathAction } from "@/lib/paths/actions";

/**
 * Quiet footer standing — reputation, exams, extras (demo).
 * Kept for when real APIs exist; do not mount on /dashboard until then.
 */
export function MonthPulseStrip() {
  const s = DEMO_MONTH_PULSE;
  const max = Math.max(...s.months.map((m) => m.rate), 1);

  return (
    <section className="mt-2 space-y-4">
      <div className="overflow-hidden rounded-[18px] border border-card-border bg-elevated/40">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-divider px-5 py-3.5 sm:px-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
              Your space · demo
            </p>
            <h2 className="mt-0.5 font-display text-[16px] font-extrabold text-ink">
              Standing
            </h2>
          </div>
          <span className="font-mono text-[11px] text-ink-fainter">
            Fake data · replace later
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap gap-5">
            <PulseStat
              value={String(s.reputation)}
              label={`${s.reputationLabel} rep`}
            />
            <PulseStat value={`${s.activeDays}d`} label="Active days" />
            <PulseStat value={String(s.reviewsCount)} label="Reviews" />
            <PulseStat
              value={String(s.exams.filter((e) => e.status === "passed").length)}
              label="Exams passed"
            />
          </div>
          <div
            className="ml-auto flex h-10 items-end gap-1"
            aria-label="Monthly active-day trend"
          >
            {s.months.map((m) => (
              <div key={m.label} className="flex w-3.5 flex-col items-center">
                <div
                  className={cn(
                    "w-full rounded-sm",
                    m.rate >= 65 ? "bg-brand-violet" : "bg-xp-border",
                  )}
                  style={{
                    height: `${Math.max(6, Math.round((m.rate / max) * 32))}px`,
                  }}
                  title={`${m.label}: ${m.rate}%`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[18px] border border-card-border bg-elevated/40">
          <div className="flex items-center gap-2 border-b border-divider px-5 py-3.5 sm:px-6">
            <ClipboardCheck
              size={16}
              className="text-brand-violet"
              aria-hidden
            />
            <h3 className="font-display text-[15px] font-extrabold text-ink">
              Exams
            </h3>
          </div>
          <ul className="divide-y divide-divider">
            {s.exams.map((exam) => (
              <li key={exam.id}>
                <Link
                  href={exam.href}
                  className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-elevated/60 sm:px-6"
                >
                  <span
                    className={cn(
                      "mt-0.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em]",
                      exam.status === "due" && "bg-xp-bg text-xp-text",
                      exam.status === "upcoming" &&
                        "bg-elevated text-ink-fainter",
                      exam.status === "passed" &&
                        "bg-brand-gradient text-white",
                      exam.status === "retry" &&
                        "border border-card-border text-ink-secondary",
                    )}
                  >
                    {exam.status}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-bold text-ink">
                      {exam.title}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-ink-fainter">
                      {exam.pathLabel} · {exam.when}
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="mt-1 flex-none text-ink-fainter"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-card-border bg-elevated/40">
          <div className="flex items-center gap-2 border-b border-divider px-5 py-3.5 sm:px-6">
            <Sparkles size={16} className="text-brand-violet" aria-hidden />
            <h3 className="font-display text-[15px] font-extrabold text-ink">
              Extras to do
            </h3>
          </div>
          <ul className="divide-y divide-divider">
            {s.extras.map((extra) => (
              <li key={extra.id}>
                <Link
                  href={extra.href}
                  className="block px-5 py-3.5 transition-colors hover:bg-elevated/60 sm:px-6"
                >
                  <div className="text-[13.5px] font-bold text-ink">
                    {extra.title}
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-secondary">
                    {extra.why}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PulseStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-lg font-extrabold leading-none text-ink">
        {value}
      </div>
      <div className="mt-1 text-[11.5px] text-ink-fainter">{label}</div>
    </div>
  );
}

export type EnrolledPathRow = {
  path: PathDef;
  progress: number | null;
  active: boolean;
  /** Days since first completed lesson on this path; null if none. */
  daysOnPath?: number | null;
};

/** Quiet aside list of followed paths — same mark ring as /paths. */
export function EnrolledPathsPanel({ rows }: { rows: EnrolledPathRow[] }) {
  if (rows.length === 0) return null;

  const plural = rows.length > 1;

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
            {plural ? "Paths" : "Path"}
          </p>
          <h2 className="mt-0.5 font-display text-[16px] font-extrabold text-ink">
            {plural ? "Your paths" : "Your path"}
          </h2>
        </div>
        <Link
          href="/paths"
          className="flex items-center gap-1 text-[12.5px] font-bold text-brand-violet transition-colors hover:text-ink"
        >
          All
          <ChevronRight size={13} aria-hidden />
        </Link>
      </div>
      <ul className="flex flex-col gap-1">
        {rows.map(({ path, progress, active, daysOnPath }) => {
          const meta = pathTypeMeta(path);
          const skills = pathSkillsCounts(path);
          const pct =
            progress != null
              ? Math.round(Math.min(1, Math.max(0, progress)) * 100)
              : null;
          const tenure =
            daysOnPath != null && daysOnPath > 0
              ? formatPathTenure(daysOnPath)
              : null;
          return (
            <li key={path.slug}>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-[14px] border border-transparent px-2.5 py-2.5 transition-colors duration-150 hover:bg-elevated/80",
                  active && "border-divider bg-elevated/40 hover:bg-elevated/70",
                )}
              >
                <Link
                  href={pathHref(path.slug)}
                  className="flex min-w-0 flex-1 items-center gap-3.5"
                >
                  <PathMarkRing
                    mark={pathMark(path)}
                    slug={path.slug}
                    progress={progress}
                    gradientId={`dash-ring-${path.slug}`}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-display text-[15px] font-extrabold text-ink">
                        {path.title}
                      </span>
                      {active ? (
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-xp-text">
                          Active
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
                      {meta.typeLabel}
                      <span className="mx-1.5 text-divider">·</span>
                      {skills.lessons} lessons
                      {skills.projects > 0
                        ? ` · ${skills.projects} project${skills.projects === 1 ? "" : "s"}`
                        : null}
                    </p>
                  </div>
                  {pct != null ? (
                    <div className="flex-none text-right">
                      <div className="font-display text-[15px] font-extrabold text-ink">
                        {pct}%
                      </div>
                      {tenure ? (
                        <div className="mt-0.5 max-w-[7.5rem] font-mono text-[10px] leading-snug text-ink-fainter normal-case tracking-normal">
                          {tenure}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex-none font-mono text-[11px] text-ink-fainter">
                      Soon
                    </div>
                  )}
                </Link>
                <form action={unselectPathAction} className="flex-none">
                  <input type="hidden" name="slug" value={path.slug} />
                  <button
                    type="submit"
                    className="rounded-lg px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-ink-fainter transition-colors hover:bg-elevated hover:text-ink"
                  >
                    Unselect
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
