"use client";

import { useState } from "react";
import Link from "next/link";
import { Share2, BookOpen, LayoutDashboard } from "lucide-react";
import { Confetti } from "./confetti";

interface Props {
  levelNumber: string;
  levelName: string;
  concepts: number;
  xpEarned: number;
  flavor: string;
  badgeGlyph: string;
  badgeLabel: string;
  nextHref: string;
  nextLabel: string;
  nextTitle: string;
  nextSubtitle: string;
  unlockBadge: string;
  unlockLabel: string;
}

export function LevelCompleteCard({
  levelNumber,
  levelName,
  concepts,
  xpEarned,
  flavor,
  badgeGlyph,
  badgeLabel,
  nextHref,
  nextLabel,
  nextTitle,
  nextSubtitle,
  unlockBadge,
  unlockLabel,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — silently no-op */
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_50%_-10%,#3A2A66_0%,#221C3A_42%,#141024_78%)] text-white">
      <div
        className="animate-ray-spin pointer-events-none absolute left-1/2 top-[38%] h-[1200px] w-[1200px] rounded-full"
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,.05) 0deg 8deg, transparent 8deg 22deg)",
        }}
      />
      <div className="animate-glow-pulse pointer-events-none absolute left-1/2 top-[38%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(154,52,214,0.5),rgba(109,70,242,0.22)_45%,transparent_70%)] blur-[14px]" />
      <Confetti />

      <div className="relative max-h-[94vh] w-[min(560px,92vw)] overflow-auto rounded-[28px] border border-white/[0.12] bg-gradient-to-b from-[rgba(38,32,60,0.86)] to-[rgba(26,22,42,0.92)] p-11 pb-8 text-center shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="animate-rise mb-5 font-mono text-xs uppercase tracking-[0.28em] text-[#C6A6FF]">
          Level Complete
        </div>

        <div className="animate-badge-spin relative mx-auto h-[168px] w-[168px]">
          <div
            className="absolute inset-0 rounded-full shadow-[0_20px_50px_rgba(193,58,224,0.5),0_0_0_1px_rgba(255,255,255,0.2)_inset]"
            style={{ background: "conic-gradient(from 210deg, #FFD86B, #FF6B4A, #C13AE0, #7B4DFF, #FFD86B)" }}
          />
          <div className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full border border-white/[0.12] bg-[radial-gradient(circle_at_38%_30%,#2E2650,#1A1630)]">
            <div className="font-mono text-[11px] tracking-[0.18em] text-[#C6A6FF]">LEVEL</div>
            <div className="bg-gradient-to-b from-white to-[#E7D6FF] bg-clip-text font-display text-[58px] font-extrabold leading-[0.9] text-transparent">
              {levelNumber}
            </div>
            <div className="mt-1 flex gap-1">
              {[0, 1, 2].map((i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#FFD86B" stroke="none">
                  <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.6 5.8 21 7 14 2 9.3 9 8.5 12 2" />
                </svg>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-[9px] overflow-hidden rounded-full">
            <div className="animate-badge-shine absolute left-0 top-0 h-full w-[40%] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>

        <h1 className="animate-rise mb-2.5 mt-6 font-display text-[34px] font-extrabold leading-[1.05] tracking-[-0.032em] sm:text-[38px]">
          {levelName},
          <br />
          mastered.
        </h1>
        <p className="animate-rise mx-auto mb-7 max-w-[390px] text-[16px] leading-relaxed text-[#B8B2CC]">
          You finished all {concepts} concepts — {flavor}
        </p>

        <div className="animate-rise mb-6">
          <div className="mb-3.5 flex items-center justify-center gap-3">
            <span className="font-display text-[30px] font-extrabold text-white">
              <span className="text-[#FFD86B]">+{xpEarned}</span> XP
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#12B981]/[0.35] bg-[#12B981]/[0.16] px-2.5 py-1 font-mono text-[13px] text-[#12E39E]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#12E39E" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 15 6-6 6 6" />
              </svg>
              Level 7 → 8
            </span>
          </div>
          <div className="mx-auto max-w-[400px]">
            <div className="mb-1.5 flex justify-between font-mono text-[11.5px] text-[#9990B8]">
              <span>Level 8</span>
              <span>1,800 / 2,000 XP</span>
            </div>
            <div className="h-[11px] overflow-hidden rounded-full bg-white/[0.12]">
              <div
                className="animate-grow h-full rounded-full bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] shadow-[0_0_14px_rgba(193,58,224,0.6)]"
                style={{ width: "90%" }}
              />
            </div>
          </div>
        </div>

        <div className="animate-rise mx-auto mb-6 flex max-w-[400px] gap-3">
          {[
            { icon: <BookOpen size={16} strokeWidth={2.3} />, value: String(concepts), label: "concepts", color: "text-white" },
            { icon: null, value: "100%", label: "quiz score", color: "text-[#12E39E]" },
            { icon: null, value: "12", label: "day streak", color: "text-[#FF9A5C]" },
          ].map((s, i) => (
            <div key={i} className="flex-1 rounded-[14px] border border-white/[0.1] bg-white/[0.05] px-2.5 py-[15px]">
              <div className="flex items-center justify-center gap-1.5">
                {i === 0 && s.icon}
                {i === 1 && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#12E39E" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                )}
                {i === 2 && <span className="animate-flame inline-block h-[19px] w-[15px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-[#FFCE4A] to-[#FF6B4A]" />}
                <span className={`font-display text-2xl font-extrabold leading-none ${s.color}`}>{s.value}</span>
              </div>
              <div className="mt-1.5 text-[11.5px] text-[#9990B8]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="animate-rise mx-auto mb-7 flex max-w-[440px] flex-col gap-3">
          <div className="flex items-center gap-3.5 rounded-2xl border border-white/[0.14] bg-gradient-to-r from-[#7B4DFF]/20 to-[#FF6B4A]/[0.14] p-4 text-left">
            <div className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-xl bg-gradient-to-br from-[#8A8698] to-[#B7B3C4] font-display text-[15px] font-extrabold">
              {unlockBadge}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 font-mono text-[10.5px] tracking-[0.1em] text-[#12E39E]">{unlockLabel}</div>
              <div className="text-[15.5px] font-bold">{nextTitle}</div>
              <div className="text-xs text-[#B8B2CC]">{nextSubtitle}</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6A6FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 7.5-2" />
            </svg>
          </div>
          <div className="flex items-center gap-3.5 rounded-2xl border border-white/[0.1] bg-white/[0.05] p-3.5 text-left">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[#C6A6FF]/40 bg-[#7B4DFF]/20 text-xl text-[#C6A6FF]">
              {badgeGlyph}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 font-mono text-[10.5px] tracking-[0.1em] text-[#FFD86B]">BADGE EARNED</div>
              <div className="text-[15.5px] font-bold">{badgeLabel}</div>
            </div>
            <span className="whitespace-nowrap rounded-full bg-[#12B981]/[0.16] px-2.5 py-1 font-mono text-xs text-[#12E39E]">+50 XP</span>
          </div>
        </div>

        <div className="animate-rise mx-auto flex max-w-[440px] flex-col gap-2.5">
          <Link
            href={nextHref}
            className="flex items-center justify-center gap-2.5 rounded-[14px] bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] py-[17px] text-[16px] font-extrabold text-white shadow-[0_16px_36px_rgba(193,58,224,0.45)] transition-transform hover:-translate-y-0.5"
          >
            {nextLabel}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <div className="flex gap-2.5">
            <button
              onClick={share}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.07] py-3.5 text-sm font-bold text-[#EDE9F7] transition-transform hover:-translate-y-0.5"
            >
              <Share2 size={15} strokeWidth={2.2} />
              {copied ? "Link copied!" : "Share"}
            </button>
            <Link
              href="/dashboard"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.07] py-3.5 text-sm font-bold text-[#EDE9F7] transition-transform hover:-translate-y-0.5"
            >
              <LayoutDashboard size={15} strokeWidth={2.2} />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
