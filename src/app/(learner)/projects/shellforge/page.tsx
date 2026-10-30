import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Terminal } from "lucide-react";
import { MILESTONES, RESOURCES } from "@/lib/projects/shellforge-brief-data";
import { RequirementsChecklist } from "@/components/projects-v2/requirements-checklist";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { buildAchievementsModel } from "@/lib/achievements/achievements-model";
import { loadAchievementsInput } from "@/lib/achievements/server-page-data";
import { SIGNIN_HREF } from "@/lib/routes";

export const metadata: Metadata = {
  title: "ShellForge — Build your own shell — Ascend",
  description: "The capstone of Systems Programmer: a working shell in C.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";
const CARD =
  "flex flex-col gap-3 rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6";
const H2 = "m-0 text-[19px] font-bold";

const OUTCOMES = [
  "Parse a command line into a program and its arguments",
  "Create child processes with fork() and run them with execve()",
  "Connect commands with pipes ( | ) and file redirections",
  "Handle built-ins (cd, exit) and Ctrl-C without dying",
];

const LAYOUT = [
  { name: "main.c", note: "the loop" },
  { name: "parser.c", note: "line → words" },
  { name: "exec.c", note: "fork, execve" },
  { name: "Makefile", note: "build" },
];

/** ShellForge, the Systems Programmer capstone: what to build, how it's shipped (for real), and how to get there. */
export default async function ShellForgePage() {
  const loaded = await loadAchievementsInput();
  const shipIt = loaded ? buildAchievementsModel(loaded.input).parts.find((p) => p.id === "ship-it") : undefined;
  const steps = shipIt?.criteria ?? [];
  const shipped = Boolean(shipIt?.earned);

  return (
    <main className={MAIN}>
      <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-6`}>
        <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--coach-ink-muted)]">
          <Link
            href="/paths/systems-programmer"
            className="text-[var(--coach-ink-muted)] no-underline hover:text-[var(--coach-ink)]"
          >
            Systems Programmer
          </Link>
          <span aria-hidden className="mx-1.5">
            /
          </span>
          <span className="text-[var(--coach-ink)]">ShellForge</span>
        </nav>

        <section
          aria-labelledby="sf-title"
          className="flex flex-col gap-5 rounded-[20px] bg-[var(--coach-hero-bg)] p-6 text-[var(--coach-hero-ink)] sm:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]">
              <Terminal size={24} strokeWidth={2.2} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="m-0 text-[13px] text-[var(--coach-hero-muted)]">Capstone of Systems Programmer</p>
              <h1
                id="sf-title"
                className="m-0 font-display text-[30px] font-extrabold leading-tight tracking-[-0.025em] sm:text-[38px]"
              >
                Build your own shell
              </h1>
            </div>
            {shipped && (
              <span className="ml-auto shrink-0 rounded-full bg-[var(--coach-lime)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--coach-lime-ink)]">
                Shipped
              </span>
            )}
          </div>
          <p className="m-0 max-w-[64ch] text-[15.5px] leading-relaxed text-[var(--coach-hero-muted)] [text-wrap:pretty]">
            Write a working command-line shell in C: read what you type, run programs with fork and execve, wire up
            pipes and redirections, and survive Ctrl-C. Everything from Systems Programmer, in one real program.
          </p>
          <p className="m-0 text-[13.5px] text-[var(--coach-hero-muted)]">
            About 6 hours · C · You build it on your own machine and share the repo — there&apos;s no automatic grader.
          </p>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-5">
            <section aria-labelledby="build-title" className={CARD}>
              <h2 id="build-title" className={H2}>
                What you&apos;ll build
              </h2>
              <p className="m-0 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
                A shell is the program that reads what you type and asks the operating system to do it. Yours will be
                small but real — the same read, parse, start, wait loop as bash. The moment it runs{" "}
                <code className="rounded bg-[var(--coach-tint-neutral-bg)] px-1.5 py-0.5 font-[family-name:var(--font-plex-mono)] text-[13.5px]">
                  ls | grep .c
                </code>
                , processes, pipes and file descriptors stop being theory.
              </p>
              <p className="m-0 mt-1 text-[14px] font-semibold">By the end, you&apos;ll be able to</p>
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                {OUTCOMES.map((o) => (
                  <li key={o} className="flex gap-2.5 text-[14.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--coach-ink)]" />
                    {o}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="req-title" className={CARD}>
              <h2 id="req-title" className={H2}>
                Requirements
              </h2>
              <RequirementsChecklist />
            </section>

            <section aria-labelledby="ms-title" className={CARD}>
              <h2 id="ms-title" className={H2}>
                A way to get there
              </h2>
              <p className="m-0 text-[14px] text-[var(--coach-ink-muted)]">
                Five steps, each one working before the next. Times are rough.
              </p>
              <ol className="m-0 flex list-none flex-col gap-3 p-0">
                {MILESTONES.map((m, i) => (
                  <li key={m.title} className="flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--coach-tint-neutral-bg)] text-[13px] font-bold tabular-nums">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold leading-snug">
                        {m.title}{" "}
                        <span className="text-[12.5px] font-medium text-[var(--coach-ink-muted)]">{m.time}</span>
                      </span>
                      <span className="block text-[14px] leading-snug text-[var(--coach-ink-secondary)]">
                        {m.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <section aria-labelledby="ship-title" className={CARD}>
              <h2 id="ship-title" className="m-0 text-[17px] font-bold">
                {shipped ? "Shipped" : "How it's shipped"}
              </h2>
              <p className="m-0 text-[13.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
                {shipped
                  ? "It's on your profile, and it earned you Shell Smith."
                  : "Two real steps — then it shows on your profile and earns Shell Smith."}
              </p>
              {loaded ? (
                <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
                  {steps.map((s) => (
                    <li key={s.text} className="flex gap-2.5">
                      <span
                        aria-hidden
                        className={`mt-px flex size-5 shrink-0 items-center justify-center rounded-md ${
                          s.done
                            ? "bg-[var(--coach-ink)] text-[var(--coach-surface)]"
                            : "border-2 border-[var(--coach-border-strong)]"
                        }`}
                      >
                        {s.done && <Check size={13} strokeWidth={3} />}
                      </span>
                      <span className="min-w-0 text-[14px] leading-snug">
                        <span className={s.done ? "text-[var(--coach-ink-muted)]" : "font-semibold"}>{s.text}</span>
                        {s.progress && !s.done && (
                          <span className="block text-[12.5px] tabular-nums text-[var(--coach-ink-muted)]">
                            {s.progress.done} of {s.progress.total}
                          </span>
                        )}
                        {s.action && !s.done && (
                          <Link
                            href={s.action.href}
                            className="mt-0.5 block text-[13px] font-semibold text-[var(--coach-ink)] underline underline-offset-2"
                          >
                            {s.action.label}
                          </Link>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="m-0 text-[13.5px] text-[var(--coach-ink-secondary)]">
                  Finish every Systems &amp; Software lesson, then link your repo on your profile.{" "}
                  <Link
                    href={SIGNIN_HREF}
                    className="font-semibold text-[var(--coach-ink)] underline underline-offset-2"
                  >
                    Sign in
                  </Link>{" "}
                  to track it.
                </p>
              )}
            </section>

            <section aria-labelledby="layout-title" className={CARD}>
              <h2 id="layout-title" className="m-0 text-[17px] font-bold">
                A layout that works
              </h2>
              <p className="m-0 text-[13px] text-[var(--coach-ink-muted)]">
                A suggestion — there&apos;s no starter repo to clone.
              </p>
              <ul className="m-0 flex list-none flex-col gap-1 rounded-xl bg-[var(--coach-code-bg)] p-3 font-[family-name:var(--font-plex-mono)] text-[13px] text-[var(--coach-code-ink)]">
                {LAYOUT.map((f) => (
                  <li key={f.name} className="flex justify-between gap-3">
                    {f.name}
                    <span className="opacity-60">{f.note}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="ref-title" className={CARD}>
              <h2 id="ref-title" className="m-0 text-[17px] font-bold">
                Keep these open
              </h2>
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {RESOURCES.map((r) => (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noreferrer"
                      className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-[14px] font-semibold text-[var(--coach-ink)] no-underline hover:bg-[var(--coach-tint-neutral-bg)]"
                    >
                      <span className="min-w-0">
                        {r.title}
                        <span className="block text-[12.5px] font-normal text-[var(--coach-ink-muted)]">{r.meta}</span>
                      </span>
                      <ArrowUpRight size={15} aria-hidden className="shrink-0 text-[var(--coach-ink-muted)]" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
