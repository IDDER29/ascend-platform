import Link from "next/link";
import { Check, X, MessageSquare, GitBranch, RefreshCw, BookOpen, Trophy } from "lucide-react";
import { AppSidebar } from "@/components/ui/sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";
import { Card } from "@/components/ui/card";
import { PeerSolutions } from "@/components/projects/peer-solutions";
import { cn } from "@/lib/cn";

interface Check {
  label: string;
  pass: boolean;
  note?: string;
  optional?: boolean;
}

interface CheckGroup {
  title: string;
  checks: Check[];
  bonus?: boolean;
}

const PASSED_GROUPS: CheckGroup[] = [
  { title: "Read–eval–print loop", checks: [
    { label: "Prompt renders and reads a line", pass: true },
    { label: "Exits cleanly on Ctrl-D (EOF)", pass: true },
    { label: "Empty line does nothing", pass: true },
  ]},
  { title: "Running programs", checks: [
    { label: "Finds binaries on $PATH", pass: true },
    { label: "Passes argv correctly", pass: true },
    { label: "Reports command not found", pass: true },
  ]},
  { title: "Built-ins", checks: [
    { label: "cd changes directory", pass: true },
    { label: "exit returns status", pass: true },
    { label: "env prints environment", pass: true },
  ]},
  { title: "Pipes & redirection", checks: [
    { label: "ls | grep .c pipes output", pass: true },
    { label: "> and >> write files", pass: true },
    { label: "< reads from a file", pass: true },
  ]},
  { title: "Signals", checks: [
    { label: "Ctrl-C interrupts child, not shell", pass: true },
  ]},
  { title: "Memory", checks: [
    { label: "No leaks under valgrind", pass: true },
    { label: "No invalid reads/writes", pass: true },
  ]},
  { title: "Bonus — multi-pipe & quoting", bonus: true, checks: [
    { label: "Chains 3+ commands", pass: true },
    { label: "Respects \"quoted\" arguments", pass: false, optional: true },
  ]},
];

const FAILED_GROUPS: CheckGroup[] = [
  { title: "Read–eval–print loop", checks: [
    { label: "Prompt renders and reads a line", pass: true },
    { label: "Exits cleanly on Ctrl-D", pass: true },
    { label: "Empty line does nothing", pass: true },
  ]},
  { title: "Running programs", checks: [
    { label: "Finds binaries on $PATH", pass: true },
    { label: "Passes argv correctly", pass: true },
    { label: "Reports command not found", pass: true },
  ]},
  { title: "Built-ins", checks: [
    { label: "cd changes directory", pass: true },
    { label: "exit returns status", pass: true },
    { label: "env prints environment", pass: true },
  ]},
  { title: "Pipes & redirection", checks: [
    { label: "> and >> write files", pass: true },
    { label: "< reads from a file", pass: true },
    {
      label: "ls | grep .c pipes output",
      pass: false,
      note: "Expected \"main.c\" in output, got empty. The write end of the pipe isn't closed in the parent, so grep never sees EOF.",
    },
  ]},
  { title: "Signals", checks: [
    {
      label: "Ctrl-C interrupts child, not shell",
      pass: false,
      note: "Ctrl-C killed the shell itself. Install a SIGINT handler and reset it in the child after fork().",
    },
  ]},
  { title: "Memory", checks: [
    { label: "No leaks under valgrind", pass: true },
    { label: "No invalid reads/writes", pass: true },
  ]},
];

function countChecks(groups: CheckGroup[]) {
  const flat = groups.flatMap((g) => g.checks);
  return { passed: flat.filter((c) => c.pass).length, total: flat.length };
}

function countRequiredGroups(groups: CheckGroup[]) {
  const required = groups.filter((g) => !g.bonus);
  const passed = required.filter((g) => g.checks.every((c) => c.pass)).length;
  return { passed, total: required.length };
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative h-[120px] w-[120px] flex-none">
      <svg viewBox="0 0 120 120" width="120" height="120" className="-rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="9" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[30px] font-extrabold leading-none">{score}</span>
        <span className="font-mono text-[10px] opacity-85">/ 100</span>
      </div>
    </div>
  );
}

export default async function ShellforgeResultPage({
  searchParams,
}: {
  searchParams: Promise<{ outcome?: string }>;
}) {
  const { outcome } = await searchParams;
  const passed = outcome !== "failed";

  const groups = passed ? PASSED_GROUPS : FAILED_GROUPS;
  const { passed: checksPassed, total: checksTotal } = countChecks(groups);
  const { passed: reqPassed, total: reqTotal } = countRequiredGroups(groups);
  const score = passed ? 90 : 68;

  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-5 py-8 sm:px-10">
          <div className="mx-auto w-full max-w-[1160px]">
            <div className="mb-4.5 font-mono text-xs text-ink-fainter">
              <Link href="/curriculum" className="hover:text-ink-secondary">Curriculum</Link>{" "}
              <span className="text-[#C6C1D4]">/</span> Level 03{" "}
              <span className="text-[#C6C1D4]">/</span>{" "}
              <Link href="/projects/shellforge" className="hover:text-ink-secondary">Build your own shell</Link>{" "}
              <span className="text-[#C6C1D4]">/</span> <span className="text-brand-violet">Submission</span>
            </div>

            <div
              className={cn(
                "relative mb-6 overflow-hidden rounded-[24px] p-8 text-white shadow-[0_24px_50px_rgba(23,20,31,0.3)] sm:p-9",
                passed
                  ? "bg-gradient-to-br from-[#0E7D57] via-[#12B981] to-[#3BC6F0] shadow-[0_24px_50px_rgba(18,185,129,0.32)]"
                  : "bg-gradient-to-br from-[#1B1730] via-[#2A2440] to-[#3A2A55]",
              )}
            >
              <div className="animate-blob pointer-events-none absolute -right-8 -top-16 h-[300px] w-[300px] rounded-full bg-white/[0.14] blur-[8px]" />
              <div className="relative flex flex-wrap items-center gap-7">
                <ScoreRing score={score} color={passed ? "#ffffff" : "#FFB020"} />
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "mb-3.5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-[0.1em]",
                      passed
                        ? "border-white/30 bg-white/20 text-white"
                        : "border-[#FFB020]/40 bg-[#FFB020]/[0.18] text-[#FFCE72]",
                    )}
                  >
                    {passed ? "ALL REQUIRED CHECKS PASSED" : `${reqPassed} OF ${reqTotal} REQUIRED CHECKS PASSED`}
                  </div>
                  <h1 className="mb-2 font-display text-[32px] font-extrabold leading-[1.03] tracking-[-0.032em] sm:text-[38px]">
                    {passed ? "Project passed 🎉" : "Almost there — two to fix."}
                  </h1>
                  <p className="max-w-[520px] text-[15.5px] leading-relaxed opacity-95">
                    {passed
                      ? "Your shell builds clean, runs commands, pipes, redirects and survives Ctrl-C — with zero leaks under valgrind. Beautiful work."
                      : "You're close. Pipes and signal handling need another pass — the details are below, and your progress is saved. Everyone resubmits; that's the job."}
                  </p>
                </div>
                {passed && (
                  <div className="flex-none text-right">
                    <div className="mb-0.5 font-mono text-[11px] opacity-80">EARNED</div>
                    <div className="font-display text-[32px] font-extrabold">+800 XP</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-start gap-6">
              <div className="min-w-0 flex-[100_1_520px] space-y-6">
                <Card hover={false} className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="font-display text-[19px] font-extrabold tracking-tight">Test results</div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 font-mono text-xs",
                        passed ? "bg-[#E7F8F0] text-[#0E9E6E]" : "bg-[#FEF2F1] text-[#C22D24]",
                      )}
                    >
                      {checksPassed} / {checksTotal} checks
                    </span>
                  </div>
                  <div className="space-y-3">
                    {groups.map((g) => {
                      const groupPassed = g.checks.filter((c) => c.pass).length;
                      const groupOk = groupPassed === g.checks.length;
                      return (
                        <div
                          key={g.title}
                          className={cn(
                            "overflow-hidden rounded-2xl border",
                            groupOk ? "border-[#F0EEF6]" : g.bonus ? "border-[#F0EEF6]" : "border-[#F6D9D6]",
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-3 px-4 py-3.5",
                              groupOk ? "bg-[#F3FBF7]" : g.bonus ? "bg-[#FBFAFE]" : "bg-[#FEF2F1]",
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg font-mono text-xs font-extrabold text-white",
                                groupOk ? "bg-[#12B981]" : g.bonus ? "bg-[#F59E0B]" : "bg-[#E5544A]",
                              )}
                            >
                              {g.bonus ? `${groupPassed}/${g.checks.length}` : groupOk ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
                            </span>
                            <span className="flex-1 text-[15px] font-bold text-[#2A2540]">
                              {g.title}
                            </span>
                            <span
                              className={cn(
                                "font-mono text-xs",
                                groupOk ? "text-[#0E9E6E]" : g.bonus ? "text-[#B0770B]" : "text-[#C22D24]",
                              )}
                            >
                              {groupPassed}/{g.checks.length} passed
                            </span>
                          </div>
                          <div className="space-y-0.5 px-4 py-2.5">
                            {g.checks.map((c) => (
                              <div key={c.label}>
                                <div className="flex items-center gap-2.5 py-1.5">
                                  <span
                                    className={cn(
                                      "flex h-5 w-5 flex-none items-center justify-center rounded-full",
                                      c.pass ? "bg-[#12B981]" : "border-[1.5px] border-[#F3B5B5] bg-[#FDECEA]",
                                    )}
                                  >
                                    {c.pass ? (
                                      <Check size={11} className="text-white" strokeWidth={3} />
                                    ) : (
                                      <X size={10} className="text-[#E0564E]" strokeWidth={3.2} />
                                    )}
                                  </span>
                                  <span
                                    className={cn(
                                      "font-mono text-[13.5px]",
                                      c.pass ? "text-[#55516A]" : "font-bold text-[#C22D24]",
                                    )}
                                  >
                                    {c.label}
                                  </span>
                                  {c.optional && (
                                    <span className="ml-auto text-[11px] font-bold text-[#E0564E]">optional</span>
                                  )}
                                </div>
                                {c.note && (
                                  <div className="ml-[30px] mb-2 rounded-r-[10px] border border-[#F6D9D6] border-l-[3px] border-l-[#E5544A] bg-[#FEF2F1] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#8A5A56]">
                                    {c.note}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {passed ? (
                    <div className="mt-3.5 text-[12.5px] leading-relaxed text-ink-fainter">
                      All required checks passed. The one failing check is a{" "}
                      <b className="text-[#C13AE0]">bonus</b> — quoting edge cases — and doesn&apos;t affect your grade.
                    </div>
                  ) : null}
                </Card>

                {passed ? (
                  <Card hover={false} className="p-6">
                    <div className="mb-4 font-display text-[19px] font-extrabold tracking-tight">Build output</div>
                    <div className="space-y-1.5 rounded-xl bg-[#181428] px-4.5 py-4 font-mono text-[12.5px] leading-relaxed text-[#D8D4E6]">
                      <div><span className="text-[#4E4869]">{"›"} </span><span className="text-[#8FCf9A]">$ make</span></div>
                      <div><span className="text-[#4E4869]">{"›"} </span>cc -Wall -Wextra -Werror -c main.c parser.c exec.c</div>
                      <div><span className="text-[#4E4869]">{"›"} </span>cc -o minishell main.o parser.o exec.o</div>
                      <div><span className="text-[#4E4869]">{"›"} </span><span className="text-[#8FCf9A]">✓ built with no warnings</span></div>
                      <div><span className="text-[#4E4869]">{"›"} </span><span className="text-[#8FCf9A]">$ valgrind --leak-check=full ./minishell</span></div>
                      <div><span className="text-[#4E4869]">{"›"} </span>HEAP SUMMARY: all heap blocks were freed</div>
                      <div><span className="text-[#4E4869]">{"›"} </span><span className="text-[#8FCf9A]">✓ 0 leaks · 0 errors</span></div>
                      <div className="mt-2 border-t border-white/10 pt-2">
                        <span className="text-[#4E4869]">{"›"} </span>
                        <span className="text-[#12E39E]">15 checks run · 14 passed · 1 optional skipped · 8.2s</span>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card hover={false} className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="font-display text-[19px] font-extrabold tracking-tight">Closest fix</div>
                      <span className="rounded-full bg-xp-bg px-2.5 py-1 font-mono text-[11px] text-brand-violet">exec.c · line 48</span>
                    </div>
                    <p className="mb-4 text-[14px] leading-relaxed text-ink-secondary">
                      Your pipe works, but the parent keeps the write end open — so{" "}
                      <span className="rounded-md bg-[#F3F1FA] px-1.5 py-0.5 font-mono text-[13px]">grep</span> waits
                      forever for EOF. Close it after forking:
                    </p>
                    <div className="space-y-0.5 rounded-2xl bg-[#181428] px-3.5 py-3 font-mono text-[13px] leading-loose">
                      <div className="text-[#D8D4E6]">dup2(fd[1], STDOUT_FILENO);</div>
                      <div className="bg-[#E5544A]/15 px-1 text-[#E7A9A3]">- close(fd[1]);</div>
                      <div className="bg-[#12B981]/15 px-1 text-[#A6E6CC]">+ close(fd[1]);  // parent: close write end</div>
                      <div className="text-[#D8D4E6]">waitpid(pid, &amp;status, 0);</div>
                    </div>
                  </Card>
                )}
              </div>

              <div className="flex w-full min-w-[280px] max-w-[344px] flex-1 flex-col gap-5">
                {passed ? (
                  <Card hover={false} className="relative overflow-hidden bg-gradient-to-br from-[#1B1730] to-[#2C2548] p-[22px] text-white">
                    <div className="pointer-events-none absolute -right-8 -top-10 h-[150px] w-[150px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.45),transparent_68%)] blur-[6px]" />
                    <div className="relative">
                      <div className="mb-3.5 font-mono text-[10.5px] tracking-[0.1em] text-[#C6A6FF]">REWARDS</div>
                      <div className="mb-3.5 flex items-center gap-3">
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-brand-gradient">
                          <span className="font-display text-lg">↗</span>
                        </div>
                        <div>
                          <div className="font-display text-2xl font-extrabold leading-none text-[#FFD86B]">+800 XP</div>
                          <div className="mt-1 text-xs text-[#B9B3D0]">2,600 XP total · Level 8</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 border-t border-white/10 pt-3.5">
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[#FF9A5C]/40 bg-[#FF9A5C]/20 text-[#FF9A5C]">
                          ◆
                        </div>
                        <div>
                          <div className="font-mono text-[10.5px] tracking-[0.08em] text-[#FFD86B]">BADGE EARNED</div>
                          <div className="text-[15px] font-bold">Shell Architect</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card hover={false} className="p-[22px]">
                    <div className="mb-3.5 flex items-center gap-2.5">
                      <span className="h-[9px] w-[9px] flex-none rounded-full bg-[#E5544A]" />
                      <span className="text-[13px] font-bold text-[#C22D24]">Not passed yet</span>
                    </div>
                    <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-[#F0EEF7]">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#FF9A5C] to-[#FFB020]" style={{ width: `${(reqPassed / reqTotal) * 100}%` }} />
                    </div>
                    <div className="mb-[18px] font-mono text-xs text-ink-fainter">{reqPassed} of {reqTotal} requirements</div>
                    <Link
                      href="/projects/shellforge/submit"
                      className="mb-2.5 flex items-center justify-center gap-2 rounded-[13px] bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] px-4 py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_14px_30px_rgba(193,58,224,0.4)] transition-transform hover:-translate-y-0.5"
                    >
                      <RefreshCw size={16} strokeWidth={2.3} />
                      Fix &amp; resubmit
                    </Link>
                    <Link
                      href="/curriculum/level-03-systems-software/pipes-and-inter-process-communication"
                      className="flex items-center justify-center gap-2 rounded-xl border border-card-border px-4 py-3 text-sm font-bold text-ink-secondary transition-transform hover:-translate-y-0.5"
                    >
                      <BookOpen size={15} strokeWidth={2.2} />
                      Review pipes lesson
                    </Link>
                    <div className="mt-4 flex items-start gap-2 border-t border-[#F0EEF6] pt-4 text-[12.5px] leading-relaxed text-ink-fainter">
                      No penalty for resubmitting — retry as many times as you need.
                    </div>
                  </Card>
                )}

                <Card hover={false} className="p-5">
                  <div className="mb-3.5 font-display text-base font-extrabold">Submission</div>
                  <div className="flex flex-col gap-3 text-[13.5px]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg bg-xp-bg text-brand-violet">
                        <GitBranch size={15} strokeWidth={2.1} />
                      </span>
                      <span className="truncate font-mono text-[12.5px] font-bold text-brand-violet">
                        github.com/you/shellforge
                      </span>
                    </div>
                    <div className="flex justify-between text-ink-fainter">
                      <span>Commit</span>
                      <span className="font-mono text-[#2A2540]">{passed ? "a3f9c1d" : "7c2e0b4"}</span>
                    </div>
                    <div className="flex justify-between text-ink-fainter">
                      <span>Submitted</span>
                      <span className="text-[#2A2540]">{passed ? "Jul 4, 14:22" : "Jul 4, 15:08"}</span>
                    </div>
                    <div className="flex justify-between text-ink-fainter">
                      <span>Attempt</span>
                      <span className="text-[#2A2540]">{passed ? "#2" : "#1"}</span>
                    </div>
                  </div>
                  {passed && (
                    <Link
                      href="/projects/shellforge/submit"
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-card-border px-4 py-2.5 text-[13.5px] font-bold text-ink-secondary transition-transform hover:-translate-y-0.5"
                    >
                      <RefreshCw size={15} strokeWidth={2.2} />
                      Re-submit
                    </Link>
                  )}
                </Card>

                {passed && (
                  <Card hover={false} className="p-5">
                    <div className="mb-1.5 font-display text-base font-extrabold">What&apos;s next</div>
                    <p className="mb-3.5 text-[13.5px] leading-relaxed text-ink-secondary">
                      Shellforge was the last project in the curriculum. You&apos;ve finished all four levels.
                    </p>
                    <Link
                      href="/achievements"
                      className="flex items-center gap-3 rounded-xl border border-[#EEECF6] p-3.5 transition-colors hover:border-[#D8D2EC] hover:bg-[#FAF9FE]"
                    >
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-gradient-to-br from-[#FFE08A] via-[#FF8A4C] to-[#FFD86B] text-white">
                        <Trophy size={16} strokeWidth={2.2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-bold text-[#2A2540]">See your badges</span>
                        <span className="block text-xs text-ink-fainter">Shell Architect · +800 XP</span>
                      </span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C6C1D4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    </Link>
                  </Card>
                )}

                {!passed && (
                  <Card hover={false} className="relative overflow-hidden bg-gradient-to-br from-[#1B1730] to-[#2C2548] p-[22px] text-white">
                    <div className="pointer-events-none absolute -right-6 -top-8 h-[120px] w-[120px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.4),transparent_68%)] blur-[6px]" />
                    <div className="relative">
                      <div className="mb-2 font-mono text-[10.5px] tracking-[0.1em] text-[#C6A6FF]">STUCK?</div>
                      <p className="mb-3.5 text-[14px] leading-relaxed text-[#E7E2F2]">
                        Two failing checks, one root cause each. Re-read the pipe &amp; signal sections, or ask the
                        community — someone hit the exact same wall.
                      </p>
                      <Link
                        href="/community"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-white/20"
                      >
                        <MessageSquare size={15} strokeWidth={2.2} />
                        Ask the community
                      </Link>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {passed && <PeerSolutions />}
          </div>
        </main>
      </div>
    </div>
  );
}
