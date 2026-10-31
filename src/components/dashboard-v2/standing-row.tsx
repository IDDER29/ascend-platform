import Link from "next/link";
import type { ReactNode } from "react";
import { BadgeMark } from "@/components/achievements/marks";
import { ProgressBar } from "@/components/achievements/progress-bar";
import type { BadgeView, Criterion } from "@/lib/achievements/achievements-model";
import type { Standing } from "@/lib/dashboard/today-model";
import { SIGNIN_HREF } from "@/lib/routes";

const CARD =
  "flex min-w-0 flex-col gap-2.5 rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 no-underline text-[var(--coach-ink)] transition-colors hover:border-[var(--coach-border-strong)]";

function Step({ step }: { step: Criterion | null }) {
  if (!step) return null;
  return (
    <div className="mt-auto flex flex-col gap-1.5 border-t-2 border-[var(--coach-divider)] pt-2.5">
      <span className="flex items-baseline justify-between gap-3 text-[13px] leading-snug text-[var(--coach-ink-secondary)]">
        {step.text}
        {step.progress && (
          <span className="shrink-0 tabular-nums text-[var(--coach-ink-muted)]">
            {step.progress.done}/{step.progress.total}
          </span>
        )}
      </span>
      {step.progress && <ProgressBar done={step.progress.done} total={step.progress.total} />}
    </div>
  );
}

const PROJECT_NAME: Record<string, string> = { "code-maker": "Codebook", cartographer: "Machine Atlas", converter: "Number workbench", "byte-detective": "Byte Lab", "gate-builder": "Half-adder", "nand-maker": "Gate workbench", "alu-architect": "8-bit ALU", clockmaker: "Register lab", "memory-keeper": "Memory board", conductor: "Sequencer", "bus-driver": "Datapath", microcoder: "Control unit", "efficiency-expert": "Two designs", "puzzle-solver": "Assembly puzzles", assembler: "Assembler", librarian: "Subroutine library", "memory-watcher": "Memory visualizer", translator: "Translator", "compiler-reader": "Real C", "cross-compiler": "Two targets", "boundary-walker": "OS boundary", "system-tracer": "End to end", "trap-setter": "System calls", "signal-keeper": "Noisy channel", "format-maker": "File format", minimizer: "Smaller circuit", "game-maker": "Guessing game", "cpu-tracer": "Tiny CPU", "ship-it": "ShellForge" };

/** "1 of 2 steps done" for a badge not earned yet (its "means" reads as if it were). */
function stepsDone(view: BadgeView): string {
  const done = view.criteria.filter((c) => c.done).length;
  return `${done} of ${view.criteria.length} ${view.criteria.length === 1 ? "step" : "steps"} done`;
}

function Card({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link href={href} className={CARD}>
      <span className="text-[13px] font-semibold text-[var(--coach-ink-muted)]">{label}</span>
      {children}
    </Link>
  );
}

/** Where the learner stands — title, badges, project — each card opening its page. */
export function StandingRow({ standing }: { standing: Standing | null }) {
  if (!standing) {
    return (
      <section className="flex flex-col gap-2 rounded-[20px] border-2 border-dashed border-[var(--coach-border-strong)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-[14.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
          Sign in to keep your progress, earn badges and titles, and get a profile.
        </p>
        <Link
          href={SIGNIN_HREF}
          className="inline-flex h-10 w-fit shrink-0 items-center rounded-full bg-[var(--coach-solid-btn-bg)] px-5 text-[14px] font-bold text-[var(--coach-solid-btn-ink)] no-underline"
        >
          Sign in
        </Link>
      </section>
    );
  }

  const { title, nextTitle, badge, project } = standing;
  return (
    <section aria-label="Where you stand" className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <Card href="/achievements" label="Title">
        <span className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-hero-bg)] font-display text-[24px] font-extrabold text-[var(--coach-lime)]"
          >
            {title ? title.kanji.slice(0, 1) : "–"}
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[20px] font-extrabold leading-tight">
              {title ? title.label : "No title yet"}
            </span>
            <span className="block text-[13px] text-[var(--coach-ink-muted)]">
              {title ? title.gloss : "Your first comes with the headband"}
            </span>
          </span>
        </span>
        {nextTitle && (
          <>
            <span className="mt-1 text-[13px] text-[var(--coach-ink-secondary)]">Next: {nextTitle.label}</span>
            <Step step={nextTitle.step} />
          </>
        )}
      </Card>

      <Card href="/achievements" label={badge?.earned ? "Latest badge" : "Closest badge"}>
        {badge ? (
          <>
            <span className="flex items-center gap-3">
              <BadgeMark badge={badge.view} />
              <span className="min-w-0">
                <span className="block text-[16px] font-bold leading-tight">{badge.view.label}</span>
                <span className="block text-[13px] text-[var(--coach-ink-muted)]">
                  {badge.earned
                    ? badge.view.earnedLabel
                      ? `Earned ${badge.view.earnedLabel}`
                      : badge.view.means
                    : stepsDone(badge.view)}
                </span>
              </span>
            </span>
            <span className="text-[13px] text-[var(--coach-ink-secondary)]">
              {standing.earnedCount} of {standing.total} badges earned
            </span>
            <Step step={badge.step} />
          </>
        ) : (
          <span className="text-[14px] text-[var(--coach-ink-secondary)]">Finish a lesson for your first badge.</span>
        )}
      </Card>

      <Card href={project?.step?.action?.href ?? "/profile"} label="Project">
        {project ? (
          <>
            <span className="flex items-center gap-3">
              <BadgeMark badge={project.view} />
              <span className="min-w-0">
                <span className="block text-[16px] font-bold leading-tight">
                  {PROJECT_NAME[project.view.id] ?? project.view.label}
                </span>
                <span className="block text-[13px] text-[var(--coach-ink-muted)]">{stepsDone(project.view)}</span>
              </span>
            </span>
            <Step step={project.step} />
          </>
        ) : (
          <span className="text-[14px] text-[var(--coach-ink-secondary)]">
            {standing.shippedBoth ? "Both projects shipped. They're on your profile." : "No project open."}
          </span>
        )}
      </Card>
    </section>
  );
}
