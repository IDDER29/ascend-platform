"use client";

import { useState } from "react";
import { Plus, Bookmark, ShieldCheck } from "lucide-react";
import { AppSidebar } from "@/components/ui/sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { SNIPPETS, DEFAULT_FILES, findSnippetByCode } from "@/lib/playground-snippets";

const FILE_META: Record<string, { badge: string; badgeColor: string }> = {
  "main.c": { badge: "C", badgeColor: "bg-brand-violet text-white" },
  "scratch.c": { badge: "C", badgeColor: "bg-[#F2F0F8] text-ink-muted" },
  "bitwise_test.c": { badge: "C", badgeColor: "bg-[#F2F0F8] text-ink-muted" },
  "notes.md": { badge: "·", badgeColor: "bg-[#F2F0F8] text-ink-muted" },
};

export default function PlaygroundPage() {
  const [files, setFiles] = useState<Record<string, string>>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState("main.c");
  const [openTabs, setOpenTabs] = useState(["main.c"]);
  const [output, setOutput] = useState<{ file: string; text: string; ok: boolean } | null>(null);

  const code = files[activeFile] ?? "";
  const isMarkdown = activeFile.endsWith(".md");

  function openFile(name: string) {
    setActiveFile(name);
    setOpenTabs((tabs) => (tabs.includes(name) ? tabs : [...tabs, name]));
  }

  function updateCode(value: string) {
    setFiles((prev) => ({ ...prev, [activeFile]: value }));
    setOutput(null);
  }

  function loadSnippet(snippetId: string) {
    const snippet = SNIPPETS.find((s) => s.id === snippetId);
    if (!snippet) return;
    setFiles((prev) => ({ ...prev, [activeFile]: snippet.code }));
    setOutput(null);
  }

  function run() {
    const matched = findSnippetByCode(code);
    if (isMarkdown) {
      setOutput({ file: activeFile, text: "Notes files don't run.", ok: false });
    } else if (matched) {
      setOutput({ file: activeFile, text: matched.output, ok: true });
    } else {
      setOutput({
        file: activeFile,
        text: "Can't compile custom edits in this preview — try a Quick start snippet, or the runnable labs inside lesson pages for real compiled output.",
        ok: false,
      });
    }
  }

  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-5 py-8 sm:px-10">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <div className="mb-2.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8A6AF2]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                  Playground
                </div>
                <h1 className="mb-1.5 font-display text-[26px] font-extrabold leading-tight tracking-[-0.028em] sm:text-[29px]">
                  Write and run C, freely.
                </h1>
                <p className="max-w-[520px] text-[14.5px] text-ink-secondary">
                  No lesson, no grading — just a scratchpad to test an idea, poke at
                  a concept, or debug something from a lesson.
                </p>
              </div>
              <Button variant="dark" disabled title="Not available in this preview">
                <Plus size={15} strokeWidth={2.4} />
                New file
              </Button>
            </div>

            <div className="flex flex-wrap items-start gap-5">
              {/* Left column */}
              <div className="flex w-full max-w-[290px] flex-1 flex-col gap-5">
                <Card hover={false}>
                  <div className="p-4.5">
                    <div className="mb-3 font-display text-[14.5px] font-extrabold">Your files</div>
                    <div className="flex flex-col gap-0.5">
                      {Object.keys(files).map((name) => {
                        const meta = FILE_META[name];
                        const active = name === activeFile;
                        return (
                          <button
                            key={name}
                            onClick={() => openFile(name)}
                            className={cn(
                              "-mx-1.5 flex items-center gap-2.5 rounded-[10px] px-2.5 py-2.5 text-left transition-colors",
                              active ? "bg-xp-bg" : "hover:bg-[#FAF9FE]",
                            )}
                          >
                            <span className={cn("flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg font-mono text-[10.5px] font-bold", meta.badgeColor)}>
                              {meta.badge}
                            </span>
                            <span className={cn("flex-1 text-[13.5px]", active ? "font-bold text-[#2A2540]" : "font-semibold text-[#413D50]")}>
                              {name}
                            </span>
                            {active && <span className="h-1.5 w-1.5 rounded-full bg-brand-magenta" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                <Card hover={false}>
                  <div className="p-4.5">
                    <div className="mb-0.5 font-display text-[14.5px] font-extrabold">Quick start</div>
                    <div className="mb-3 text-xs text-ink-muted">
                      Drop a starter into {activeFile}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {SNIPPETS.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => loadSnippet(s.id)}
                          className="-mx-1.5 flex items-center gap-2.5 rounded-[10px] px-2.5 py-2.5 text-left text-[13.5px] font-semibold text-[#413D50] transition-colors hover:bg-[#FAF9FE]"
                        >
                          <span>{s.emoji}</span>
                          <span className="flex-1">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>

                <div className="rounded-2xl border border-dashed border-[#DCD7EC] bg-[#FAF9FD] p-4">
                  <p className="text-[12.5px] leading-relaxed text-ink-secondary">
                    <b className="text-[#2A2540]">Tip —</b> anything you run here is
                    scratch only. Nothing counts toward XP or streaks; it&apos;s just
                    for you.
                  </p>
                </div>
              </div>

              {/* Right column: editor */}
              <div className="flex min-w-0 flex-[3_1_560px] flex-col gap-5">
                <div className="overflow-hidden rounded-[20px] border border-[#E7E3F2] shadow-[0_10px_28px_rgba(28,18,64,0.08)]">
                  <div className="flex items-center gap-0.5 overflow-x-auto border-b border-[#EEECF6] bg-[#FBFAFE] px-2.5">
                    {openTabs.map((name) => (
                      <button
                        key={name}
                        onClick={() => setActiveFile(name)}
                        className={cn(
                          "relative top-px flex flex-none items-center gap-2 rounded-t-[10px] border px-4 py-2.5 text-[13px] font-bold transition-colors",
                          name === activeFile
                            ? "border-[#EEECF6] border-b-white bg-white text-[#2A2540]"
                            : "border-transparent text-ink-muted hover:text-ink-secondary",
                        )}
                      >
                        <span className={cn("flex h-4 w-4 items-center justify-center rounded-[5px] font-mono text-[9px] font-bold", FILE_META[name].badgeColor)}>
                          {FILE_META[name].badge}
                        </span>
                        {name}
                      </button>
                    ))}
                    <div className="ml-auto flex flex-none items-center gap-2 py-2">
                      <span className="hidden font-mono text-[11px] text-ink-faint sm:inline">
                        stdin: none
                      </span>
                      <button
                        onClick={run}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#12B981] px-4 py-2 text-[12.5px] font-extrabold text-[#06231A] shadow-[0_8px_16px_rgba(18,185,129,0.28)] transition-transform hover:-translate-y-0.5"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#06231A">
                          <polygon points="6 3 20 12 6 21 6 3" />
                        </svg>
                        Run
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => updateCode(e.target.value)}
                    spellCheck={false}
                    className="block h-[340px] w-full resize-none border-0 bg-[#181428] p-4.5 font-mono text-[13px] leading-[1.8] text-[#D8D4E6] outline-none"
                  />
                  <div
                    className={cn(
                      "border-t px-4.5 py-3 font-mono text-[12.5px]",
                      output
                        ? output.ok
                          ? "border-white/[0.07] bg-[#12101F] text-[#8FCF9A]"
                          : "border-white/[0.07] bg-[#12101F] text-[#F0A090]"
                        : "border-white/[0.07] bg-[#12101F] text-[#5E5878]",
                    )}
                  >
                    <span className="text-[#5E5878]">output › </span>
                    {output ? output.text : "press Run to see output"}
                  </div>
                </div>

                <div className="flex flex-wrap gap-5">
                  <Card className="flex-1 basis-[260px] p-5">
                    <div className="mb-2 flex items-center gap-2.5">
                      <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg bg-xp-bg text-brand-violet">
                        <ShieldCheck size={15} strokeWidth={2.2} />
                      </span>
                      <div className="text-[13.5px] font-bold">Runs in a sandbox</div>
                    </div>
                    <div className="text-[12.5px] leading-relaxed text-ink-muted">
                      Known snippets show their real compiled output. Custom edits
                      are honest about not being live-compiled in this preview.
                    </div>
                  </Card>
                  <Card className="flex-1 basis-[260px] p-5">
                    <div className="mb-2 flex items-center gap-2.5">
                      <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg bg-[#FFF1EC] text-[#F0562F]">
                        <Bookmark size={15} strokeWidth={2.2} />
                      </span>
                      <div className="text-[13.5px] font-bold">Save to Bookmarks</div>
                    </div>
                    <div className="text-[12.5px] leading-relaxed text-ink-muted">
                      Keep a snippet you&apos;re proud of, or one you&apos;ll want to
                      revisit later.
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
