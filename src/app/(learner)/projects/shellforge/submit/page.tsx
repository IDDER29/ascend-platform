"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitBranch, Info, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ShellforgeSubmitPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");

  const canSubmit = repoUrl.trim().length > 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-auto bg-radial-wash p-6 text-ink">
      <Card hover={false} className="w-full max-w-[520px] p-8">
        <Link
          href="/projects/shellforge"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-fainter hover:text-ink-secondary"
        >
          <ArrowLeft size={14} strokeWidth={2.3} />
          Back to project brief
        </Link>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white">
          <GitBranch size={22} strokeWidth={2.2} />
        </div>
        <h1 className="mb-2 font-display text-2xl font-extrabold tracking-tight">Submit Shellforge</h1>
        <p className="mb-6 text-[14.5px] leading-relaxed text-ink-secondary">
          Paste your repo link below. In a real submission this would be cloned, built and run
          against an automated test suite.
        </p>

        <label className="mb-1.5 block text-[13px] font-bold text-ink-secondary">Repository URL</label>
        <input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="github.com/you/shellforge"
          className="mb-6 w-full rounded-xl border border-card-border bg-white px-4 py-3 text-[14.5px] outline-none focus:border-brand-violet"
        />

        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-card-border-soft bg-[#F3F1FA] px-4 py-3.5 text-[13px] leading-relaxed text-ink-secondary">
          <Info size={16} className="mt-0.5 flex-none text-brand-violet" strokeWidth={2.2} />
          This is a demo preview — there&apos;s no real auto-grader here. Nothing is actually cloned
          or compiled. Pick which outcome you want to see below.
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => router.push("/projects/shellforge/result?outcome=passed")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#12B981] to-[#3BC6F0] px-5 py-3.5 text-[14.5px] font-bold text-white shadow-[0_10px_24px_rgba(18,185,129,0.32)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
          >
            Simulate: all checks pass
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => router.push("/projects/shellforge/result?outcome=failed")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-card-border px-5 py-3.5 text-[14.5px] font-bold text-ink-secondary transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
          >
            Simulate: needs fixes
          </button>
        </div>
      </Card>
    </div>
  );
}
