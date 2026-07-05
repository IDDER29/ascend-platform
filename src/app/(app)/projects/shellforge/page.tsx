import Link from "next/link";
import { LabeledSidebar } from "@/components/ui/labeled-sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";
import { ShellforgeBrief } from "@/components/projects/shellforge-brief";

export const metadata = {
  title: "Build your own shell — Ascend",
  description: "The Shellforge capstone project brief.",
};

export default function ShellforgeBriefPage() {
  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <LabeledSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-5 py-8 sm:px-10">
          <div className="mx-auto w-full max-w-[1160px]">
            <div className="mb-4.5 font-mono text-xs text-ink-fainter">
              <Link href="/curriculum" className="hover:text-ink-secondary">Curriculum</Link>{" "}
              <span className="text-[#C6C1D4]">/</span> Level 03 · Systems{" "}
              <span className="text-[#C6C1D4]">/</span> <span className="text-brand-violet">Project</span>
            </div>

            <div className="relative mb-6 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1B1730] via-[#2A2440] to-[#3A2A55] p-8 text-white shadow-[0_24px_50px_rgba(23,20,31,0.3)] sm:p-9">
              <div className="animate-blob pointer-events-none absolute -right-10 -top-20 h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.42),transparent_66%)] blur-[10px]" />
              <div className="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 font-mono text-[150px] font-bold leading-none text-white/5 sm:block">
                $_
              </div>
              <div className="relative">
                <div className="mb-4 flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6A6FF]/30 bg-[#C6A6FF]/[0.14] px-3 py-1.5 font-mono text-[11px] tracking-[0.06em] text-[#C6A6FF]">
                    CAPSTONE PROJECT
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF9A5C]/30 bg-[#FF9A5C]/[0.14] px-3 py-1.5 text-xs font-bold text-[#FF9A5C]">
                    <span className="tracking-[2px]">◆◆◆</span> Advanced
                  </span>
                </div>
                <h1 className="mb-3 font-display text-[32px] font-extrabold leading-[1.03] tracking-[-0.032em] sm:text-[41px]">
                  Build your own shell
                </h1>
                <p className="mb-6 max-w-[560px] text-[16px] leading-relaxed text-[#C4BEDA] sm:text-[16.5px]">
                  Write a working command-line shell in C — parse input, spawn processes with{" "}
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[14px]">fork</span> &amp;{" "}
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[14px]">execve</span>, wire up
                  pipes and redirections, and handle signals. Everything you&apos;ve learned, in one real program.
                </p>
                <div className="flex flex-wrap rounded-[14px] border border-white/10 bg-white/[0.05]">
                  {[
                    { label: "REWARD", value: "+800 XP", color: "text-[#FFD86B]" },
                    { label: "EST. TIME", value: "~6 hours", color: "text-white" },
                    { label: "LANGUAGE", value: "C", color: "text-white" },
                    { label: "COMPLETED", value: "2,140", color: "text-white" },
                  ].map((s, i) => (
                    <div
                      key={s.label}
                      className={`min-w-[120px] flex-1 px-4.5 py-3.5 ${i > 0 ? "border-l border-white/10" : ""}`}
                    >
                      <div className="mb-1 font-mono text-[10.5px] tracking-[0.06em] text-[#9990B8]">{s.label}</div>
                      <div className={`font-display text-[19px] font-extrabold ${s.color}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ShellforgeBrief />
          </div>
        </main>
      </div>
    </div>
  );
}
