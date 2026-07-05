"use client";

import Link from "next/link";
import { Home, Search, BookOpen, Swords, Trophy, MessageSquare, Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(130%_70%_at_50%_0%,#EAE4FB_0%,#F1F0F7_55%)] px-6 py-12 text-center">
      <div className="animate-blob pointer-events-none absolute -right-[8%] -top-[10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.22),transparent_66%)] blur-[14px]" />
      <div className="pointer-events-none absolute -bottom-[14%] -left-[6%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,107,74,0.16),transparent_66%)] blur-[14px]" />

      <div className="relative w-full max-w-[600px]">
        <Link href="/" className="mb-10 inline-flex items-center gap-2.5">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-brand-gradient shadow-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 15 6-6 6 6" />
              <path d="m6 9 6-6 6 6" opacity=".55" />
            </svg>
          </div>
          <span className="font-display text-[21px] font-extrabold tracking-tight text-ink">Ascend</span>
        </Link>

        <div className="mb-1.5 bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] bg-clip-text font-display text-[110px] font-extrabold leading-[0.9] tracking-[-0.04em] text-transparent sm:text-[150px]">
          404
        </div>

        <div className="mb-7 inline-block rounded-2xl bg-[#181428] px-4.5 py-3.5 text-left font-mono text-[13px] leading-[1.8] text-[#D8D4E6] shadow-[0_16px_34px_rgba(24,16,50,0.2)]">
          <span className="text-[#6BE3A3]">$</span> ./ascend --goto <span className="text-[#FFC06B]">&quot;this-page&quot;</span>
          <br />
          <span className="text-[#FF8A80]">Segmentation fault</span> <span className="text-[#6B6780]">(core dumped)</span>
          <br />
          <span className="text-[#6B6780]">// you followed a pointer that doesn&apos;t exist</span>
        </div>

        <h1 className="mb-3 font-display text-[28px] font-extrabold tracking-[-0.03em] text-ink sm:text-[34px]">
          This address points to nothing.
        </h1>
        <p className="mx-auto mb-8 max-w-[420px] text-[15.5px] leading-relaxed text-ink-secondary sm:text-[16.5px]">
          The page you&apos;re after moved, never existed, or you dereferenced a bad link. No harm done — let&apos;s
          get you back on the path.
        </p>

        <div className="mb-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-[13px] bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] px-7 py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_14px_30px_rgba(123,77,255,0.4)] transition-transform hover:-translate-y-0.5"
          >
            <Home size={17} strokeWidth={2.3} />
            Back to dashboard
          </Link>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("ascend:open-palette"))}
            className="inline-flex items-center gap-2 rounded-[13px] border border-[#E4E1EE] bg-white px-6.5 py-3.5 text-[15px] font-bold text-[#2A2540] transition-transform hover:-translate-y-0.5"
          >
            <Search size={16} strokeWidth={2.3} className="text-brand-violet" />
            Search Ascend
          </button>
        </div>

        <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-fainter">Or jump to</div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {[
            { href: "/curriculum", label: "Curriculum", icon: BookOpen },
            { href: "/practice", label: "Practice", icon: Swords },
            { href: "/achievements", label: "Achievements", icon: Trophy },
            { href: "/community", label: "Community", icon: MessageSquare },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center gap-2 rounded-xl border border-[#EDEBF4] bg-white px-4 py-2.5 text-sm font-semibold text-[#413D50] transition-colors hover:bg-[#FAF9FE]"
            >
              <l.icon size={15} className="text-brand-violet" strokeWidth={2.1} />
              {l.label}
            </Link>
          ))}
        </div>

        <div className="mt-9 inline-flex items-center gap-2 font-mono text-[12.5px] text-ink-muted">
          <Flame size={14} className="fill-current text-[#FF6B4A]" />
          Your 12-day streak is safe — this detour doesn&apos;t count against you.
        </div>
      </div>
    </div>
  );
}
