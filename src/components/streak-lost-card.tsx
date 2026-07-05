"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function StreakLostCard({
  nextHref,
  nextTitle,
  nextTime,
}: {
  nextHref: string;
  nextTitle: string;
  nextTime: number;
}) {
  const [freezeOn, setFreezeOn] = useState(true);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-auto bg-[radial-gradient(120%_90%_at_50%_-10%,#3A2A66_0%,#221C3A_44%,#141024_80%)] p-6 text-white">
      <div className="pointer-events-none absolute left-1/2 top-[34%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,107,74,0.28),rgba(109,70,242,0.16)_46%,transparent_70%)] blur-[16px]" />

      <div className="relative w-full max-w-[500px] rounded-[28px] border border-white/10 bg-gradient-to-b from-[rgba(38,32,60,0.9)] to-[rgba(26,22,42,0.94)] p-9 pb-8 text-center shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="mb-5 flex justify-center">
          <div className="relative flex h-[104px] w-[104px] items-center justify-center rounded-full border border-white/12 bg-white/[0.05]">
            <span className="relative inline-block h-[33px] w-[26px]">
              <span className="absolute bottom-0 left-0 h-[33px] w-[26px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-[#8A6A55] to-[#5E4740] opacity-50" />
            </span>
            <span className="absolute bottom-3.5 right-4 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-[#3A2A55] bg-[#241B3A]">
              <X size={15} className="text-[#FF8A80]" strokeWidth={2.6} />
            </span>
          </div>
        </div>

        <div className="mb-3.5 font-mono text-xs uppercase tracking-[0.24em] text-[#FF9A5C]">Streak reset</div>
        <h1 className="mb-3 font-display text-[30px] font-extrabold leading-tight tracking-[-0.03em]">
          Your 12-day streak went out.
        </h1>
        <p className="mx-auto mb-7 max-w-[380px] text-[15.5px] leading-relaxed text-[#B8B2CC]">
          Life happens — three days off, and the flame cooled. The good news:{" "}
          <b className="text-white">nothing you learned is gone.</b> Let&apos;s relight it today.
        </p>

        <div className="mb-6 flex gap-3">
          {[
            { value: "1,440", label: "XP kept", color: "text-[#C6A6FF]" },
            { value: "19", label: "concepts", color: "text-[#7BE3B0]" },
            { value: "9", label: "badges", color: "text-[#FFD86B]" },
          ].map((s) => (
            <div key={s.label} className="flex-1 rounded-2xl border border-white/10 bg-white/[0.05] p-3.5">
              <div className={`font-display text-[23px] font-extrabold leading-none ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-[11.5px] text-[#9990B8]">{s.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setFreezeOn((f) => !f)}
          className="mb-3.5 flex w-full items-center gap-3.5 rounded-2xl border border-[#C6A6FF]/30 bg-[#7B4DFF]/[0.14] p-4 text-left"
        >
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white/[0.08]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8FD6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14.5px] font-bold">Use a Streak Freeze?</span>
            <span className="block text-[12.5px] leading-relaxed text-[#B8B2CC]">
              You have <b className="text-white">2 freezes</b>. Protect your next streak from a missed day.
            </span>
          </span>
          <span
            className={`flex h-[26px] w-[44px] flex-none items-center rounded-full p-[3px] transition-colors ${
              freezeOn ? "justify-end bg-gradient-to-r from-[#7B4DFF] to-[#C13AE0]" : "justify-start bg-white/15"
            }`}
          >
            <span className="h-5 w-5 rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.3)]" />
          </span>
        </button>

        <div className="flex flex-col gap-2.5">
          <Link
            href={nextHref}
            className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] py-4 text-[16px] font-extrabold text-white shadow-[0_16px_36px_rgba(193,58,224,0.45)] transition-transform hover:-translate-y-0.5"
          >
            Relight my streak — one lesson
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <div className="flex items-center justify-center gap-2 font-mono text-[12.5px] text-[#9990B8]">
            Next up: {nextTitle} · {nextTime} min
          </div>
          <Link href="/dashboard" className="py-3 text-sm font-semibold text-[#B8B2CC]">
            Maybe later
          </Link>
        </div>
      </div>
    </div>
  );
}
