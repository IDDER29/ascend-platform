"use client";

import Link from "next/link";
import { CONTENT_REPO_URL } from "@/lib/brand/repo";
import { Home, RotateCw, LogIn, MessageSquare } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 py-12 text-center">
      <div className="animate-blob pointer-events-none absolute -right-[8%] -top-[10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(212,160,23,0.16),transparent_66%)] blur-[14px]" />
      <div className="pointer-events-none absolute -bottom-[14%] -left-[6%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(13,159,110,0.14),transparent_66%)] blur-[14px]" />

      <div className="relative w-full max-w-[560px]">
        <Link href="/" className="mb-10 inline-flex items-center gap-2.5">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-brand-gradient shadow-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 15 6-6 6 6" />
              <path d="m6 9 6-6 6 6" opacity=".55" />
            </svg>
          </div>
          <span className="font-display text-[21px] font-extrabold tracking-tight text-ink">Ascend</span>
        </Link>

        <div className="mb-7 inline-block rounded-2xl bg-[#181428] px-4.5 py-3.5 text-left font-mono text-[13px] leading-[1.8] text-ink-fainter shadow-[0_16px_34px_rgba(24,16,50,0.2)]">
          <span className="text-[#FF8A80]">$</span> ./ascend --render <span className="text-[#FFC06B]">&quot;this-page&quot;</span>
          <br />
          <span className="text-[#FF8A80]">Segmentation fault</span> <span className="text-ink-secondary">(core dumped)</span>
          <br />
          <span className="text-ink-secondary">
            {"// " + (error.digest ? `ref ${error.digest}` : "something threw while rendering")}
          </span>
        </div>

        <h1 className="mb-3 font-display text-[28px] font-extrabold tracking-[-0.03em] text-ink sm:text-[34px]">
          Something broke on our end.
        </h1>
        <p className="mx-auto mb-8 max-w-[440px] text-[15.5px] leading-relaxed text-ink-secondary sm:text-[16.5px]">
          Not you — this page hit a real server error. Your account and progress are untouched.
          Try again, or use one of these to get back on track.
        </p>

        <div className="mb-9 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-[13px] bg-brand-gradient px-7 py-3.5 text-[15.5px] font-extrabold text-white shadow-[var(--brand-glow)] transition-transform hover:-translate-y-0.5"
          >
            <RotateCw size={16} strokeWidth={2.3} />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-[13px] border border-card-border bg-white px-6.5 py-3.5 text-[15px] font-bold text-ink transition-transform hover:-translate-y-0.5"
          >
            <Home size={16} strokeWidth={2.3} className="text-brand-violet" />
            Today
          </Link>
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 rounded-[13px] border border-card-border bg-white px-6.5 py-3.5 text-[15px] font-bold text-ink transition-transform hover:-translate-y-0.5"
          >
            <LogIn size={16} strokeWidth={2.3} className="text-brand-violet" />
            Sign in
          </Link>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-divider bg-paper px-4 py-2.5 text-sm font-semibold text-ink-secondary">
          <MessageSquare size={15} className="text-brand-violet" strokeWidth={2.1} />
          Keeps happening?{" "}
          <a href={`${CONTENT_REPO_URL}/issues`} target="_blank" rel="noreferrer" className="text-brand-violet underline">
            Report it on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
