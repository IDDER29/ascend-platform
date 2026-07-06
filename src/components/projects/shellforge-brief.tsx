"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, FileCode2, Play, GitBranch, Info, BookOpen, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const REQUIREMENTS = [
  { id: "repl", title: "A read–eval–print loop", detail: "Print a prompt, read a line, run it, repeat until EOF.", bonus: false },
  { id: "exec", title: "Run external programs", detail: "Locate the binary on $PATH and execute it in a child process.", bonus: false },
  { id: "builtins", title: "Built-in commands", detail: "Implement cd, exit and env inside the shell itself.", bonus: false },
  { id: "pipes", title: "Pipes", detail: "Support at least one pipe: cmd1 | cmd2, wiring stdout→stdin.", bonus: false },
  { id: "redirect", title: "Redirections", detail: "Handle >, < and >> to files.", bonus: false },
  { id: "signals", title: "Signal handling", detail: "Ctrl-C interrupts the running command, not your shell.", bonus: false },
  { id: "bonus", title: "Multiple pipes & quoting", detail: "Chain 3+ commands and respect \"quoted\" arguments.", bonus: true },
] as const;

const MILESTONES = [
  { title: "The prompt loop", time: "~45 min", detail: "Print a prompt, read a line with getline, echo it back. Exit cleanly on Ctrl-D." },
  { title: "Run one command", time: "~1 hr", detail: "Tokenize the line, fork, execve the binary, wait for it. Hello, ls." },
  { title: "Built-ins & PATH", time: "~1 hr", detail: "Search $PATH; special-case cd, exit, env before forking." },
  { title: "Pipes & redirection", time: "~2 hr", detail: "Set up pipe() and dup2() so output flows between commands and files." },
  { title: "Signals & polish", time: "~1 hr", detail: "Trap SIGINT, free everything, pass with no leaks under valgrind." },
];

const STARTER_FILES = [
  { name: "Makefile", note: "build & clean" },
  { name: "main.c", note: "the REPL loop" },
  { name: "parser.c", note: "tokenize input" },
  { name: "exec.c", note: "fork / execve" },
  { name: "README.md", note: "your notes" },
];

const RESOURCES = [
  {
    title: "fork(2) man page",
    meta: "Documentation",
    href: "https://man7.org/linux/man-pages/man2/fork.2.html",
    icon: BookOpen,
    bg: "bg-[#FFF1EC]",
    fg: "text-[#FF6B4A]",
  },
  {
    title: "execve(2) man page",
    meta: "Documentation",
    href: "https://man7.org/linux/man-pages/man2/execve.2.html",
    icon: FileCode2,
    bg: "bg-xp-bg",
    fg: "text-brand-violet",
  },
  {
    title: "dup2(2) man page",
    meta: "Documentation — pipes & redirection",
    href: "https://man7.org/linux/man-pages/man2/dup2.2.html",
    icon: FileText,
    bg: "bg-[#E7F8F0]",
    fg: "text-[#12A472]",
  },
];

export function ShellforgeBrief() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [cloneNotice, setCloneNotice] = useState(false);

  const requiredDone = REQUIREMENTS.filter((r) => !r.bonus && checked[r.id]).length;
  const requiredTotal = REQUIREMENTS.filter((r) => !r.bonus).length;
  const pct = Math.round((requiredDone / requiredTotal) * 100);

  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="min-w-0 flex-[100_1_520px] space-y-6">
        <Card hover={false} className="p-6">
          <div className="mb-4 font-display text-[19px] font-extrabold tracking-tight">What you&apos;ll build</div>
          <p className="mb-[18px] text-[15.5px] leading-relaxed text-ink-secondary">
            A shell is the program that reads what you type and makes the operating system do it.
            You&apos;ll build a small but real one — the same fetch, parse, spawn, wait loop behind
            bash. When it runs your first{" "}
            <span className="rounded-md bg-[#F3F1FA] px-1.5 py-0.5 font-mono text-[13.5px] text-[#41395E]">
              ls | grep .c
            </span>
            , every concept from this level clicks into place.
          </p>
          <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-fainter">
            By the end you&apos;ll be able to
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              "Parse a command line into a program and its arguments",
              "Create child processes with fork() and run them via execve()",
              "Connect commands with pipes ( | ) and file redirections",
              "Handle built-ins (cd, exit) and Ctrl-C without dying",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] bg-xp-bg text-brand-violet">
                  <Check size={13} strokeWidth={2.6} />
                </span>
                <span className="text-[15px] leading-relaxed text-ink-secondary">{line}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card hover={false} className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-display text-[19px] font-extrabold tracking-tight">Requirements</div>
            <span className="font-mono text-[12.5px] text-ink-fainter">
              {requiredTotal} required · 1 bonus
            </span>
          </div>
          <p className="mb-4 text-[12.5px] text-ink-fainter">
            This is a self-tracked checklist for your own use — checking a box here doesn&apos;t
            verify or grade anything.
          </p>
          <div className="overflow-hidden rounded-2xl border border-[#F0EEF6]">
            {REQUIREMENTS.map((req, i) => (
              <button
                key={req.id}
                type="button"
                onClick={() => setChecked((c) => ({ ...c, [req.id]: !c[req.id] }))}
                className={cn(
                  "flex w-full items-start gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-[#FAF9FE]",
                  i > 0 && "border-t border-[#F4F2FA]",
                  req.bonus && "bg-[#FBFAFE]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border-2",
                    checked[req.id]
                      ? "border-transparent bg-brand-violet text-white"
                      : req.bonus
                        ? "border-[#E0C7F0]"
                        : "border-[#D8D3E6]",
                  )}
                >
                  {checked[req.id] && <Check size={13} strokeWidth={3} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14.5px] font-bold text-[#2A2540]">{req.title}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-mono text-[10px] font-extrabold",
                        req.bonus ? "bg-[#FBEBFA] text-[#C13AE0]" : "bg-[#F3F1F8] text-ink-fainter",
                      )}
                    >
                      {req.bonus ? "BONUS" : "REQUIRED"}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[13px] leading-relaxed text-ink-fainter">{req.detail}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card hover={false} className="p-6">
          <div className="mb-4 font-display text-[19px] font-extrabold tracking-tight">Suggested milestones</div>
          <div className="flex flex-col">
            {MILESTONES.map((m, i) => (
              <div key={m.title} className="flex gap-4">
                <div className="flex flex-none flex-col items-center">
                  <div
                    className={cn(
                      "flex h-[38px] w-[38px] items-center justify-center rounded-[11px] font-mono text-[13px] font-bold",
                      i === 0 ? "bg-brand-gradient text-white" : "bg-xp-bg text-brand-violet",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {i < MILESTONES.length - 1 && <div className="my-1 min-h-[26px] w-[2px] flex-1 bg-[#EEECF6]" />}
                </div>
                <div className={cn("flex-1", i < MILESTONES.length - 1 && "pb-5")}>
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <span className="text-[15.5px] font-bold text-[#2A2540]">{m.title}</span>
                    <span className="font-mono text-[11.5px] text-ink-fainter">{m.time}</span>
                  </div>
                  <div className="mt-0.5 text-[13.5px] leading-relaxed text-ink-fainter">{m.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card hover={false} className="relative overflow-hidden p-6">
          <div className="mb-4 font-display text-[19px] font-extrabold tracking-tight">Peer solutions</div>
          <div className="relative">
            <div className="pointer-events-none flex select-none flex-col gap-3 blur-[5px]">
              {[
                { i: "E", n: "elena", xp: "892 XP", note: "clean two-file parser, elegant pipe recursion" },
                { i: "M", n: "marc", xp: "1.2k XP", note: "single-pass tokenizer, handles nested quotes" },
                { i: "K", n: "kenji", xp: "640 XP", note: "heavily commented — great for a first read" },
              ].map((p) => (
                <div key={p.n} className="flex items-center gap-3.5 rounded-[13px] border border-[#F0EEF6] p-3.5">
                  <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-brand-gradient font-bold text-white">
                    {p.i}
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-bold">{p.n} · {p.xp}</div>
                    <div className="text-[12.5px] text-ink-fainter">{p.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/40 to-white/90 text-center">
              <div className="mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-ink text-white shadow-[0_12px_26px_rgba(24,21,40,0.3)]">
                <GitBranch size={22} strokeWidth={2.2} />
              </div>
              <div className="mb-1.5 font-display text-[19px] font-extrabold">Submit to unlock</div>
              <p className="max-w-[320px] text-[14px] leading-relaxed text-ink-secondary">
                Pass the project first, then compare your approach with <b>2,140</b> peer solutions.
                No spoilers before you&apos;ve built it yourself.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex w-full min-w-[280px] max-w-[344px] flex-1 flex-col gap-5">
        <Card hover={false} className="sticky top-[100px] p-[22px] shadow-card-hover">
          <div className="mb-3.5 flex items-center gap-2.5">
            <span className={cn("h-[9px] w-[9px] flex-none rounded-full", requiredDone === 0 ? "bg-[#F59E0B]" : requiredDone === requiredTotal ? "bg-[#12B981]" : "bg-brand-violet")} />
            <span className={cn("text-[13px] font-bold", requiredDone === 0 ? "text-[#B0770B]" : requiredDone === requiredTotal ? "text-[#0E9E6E]" : "text-brand-violet")}>
              {requiredDone === 0 ? "Not started" : requiredDone === requiredTotal ? "Ready to submit" : "In progress"}
            </span>
          </div>
          <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-[#F0EEF7]">
            <div className="h-full rounded-full bg-gradient-to-r from-[#7B4DFF] to-[#C13AE0] transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mb-[18px] font-mono text-[12px] text-ink-fainter">
            {requiredDone} of {requiredTotal} requirements
          </div>
          <Link
            href="/projects/shellforge/submit"
            className="mb-2.5 flex items-center justify-center gap-2 rounded-[13px] bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] px-4 py-4 text-[15.5px] font-extrabold text-white shadow-[0_14px_30px_rgba(193,58,224,0.4)] transition-transform hover:-translate-y-0.5"
          >
            <Play size={16} className="fill-current" />
            Start project
          </Link>
          <button
            type="button"
            onClick={() => setCloneNotice((v) => !v)}
            className="mb-1 flex items-center justify-center gap-2 rounded-xl border border-card-border px-4 py-3 text-[14px] font-bold text-ink-secondary transition-transform hover:-translate-y-0.5"
          >
            <GitBranch size={15} strokeWidth={2.2} />
            Clone starter repo
          </button>
          {cloneNotice && (
            <div className="mb-1 flex items-start gap-2 rounded-xl border border-card-border-soft bg-[#F3F1FA] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink-secondary">
              <Info size={15} className="mt-0.5 flex-none text-brand-violet" strokeWidth={2.2} />
              This is a demo preview — there&apos;s no real starter repo to clone.
            </div>
          )}
          <div className="flex items-start gap-2 border-t border-[#F0EEF6] pt-4 text-[12.5px] leading-relaxed text-ink-fainter">
            <Info size={15} className="mt-0.5 flex-none text-brand-violet" strokeWidth={2.2} />
            Submit a Git repo link when done — auto-checked in ~30s.
          </div>
        </Card>

        <Card hover={false} className="p-5">
          <div className="mb-3.5 font-display text-base font-extrabold">Starter files</div>
          <div className="rounded-xl bg-[#181428] p-2.5 font-mono">
            {STARTER_FILES.map((f) => (
              <div key={f.name} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[#D8D4E6] transition-colors hover:bg-white/5">
                <FileCode2 size={14} className="flex-none text-[#7B6FA8]" />
                <span className="flex-1 text-[12.5px]">{f.name}</span>
                <span className="text-[11px] text-[#5E5878]">{f.note}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card hover={false} className="p-5">
          <div className="mb-3.5 font-display text-base font-extrabold">Helpful resources</div>
          <div className="flex flex-col gap-2">
            {RESOURCES.map((r) => (
              <a
                key={r.title}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#EEECF6] px-3.5 py-2.5 transition-colors hover:bg-[#FAF9FE]"
              >
                <span className={cn("flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px]", r.bg, r.fg)}>
                  <r.icon size={15} strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-bold text-[#2A2540]">{r.title}</div>
                  <div className="text-[11.5px] text-ink-fainter">{r.meta}</div>
                </div>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
