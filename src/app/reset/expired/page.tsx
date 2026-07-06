"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Clock, AlertTriangle, RotateCcw } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";

export default function ResetExpiredPage() {
  const router = useRouter();
  const [email, setEmail] = useState("amine@example.com");

  return (
    <AuthSplitLayout
      icon={<Clock size={26} strokeWidth={2} />}
      title="That link timed out — no problem."
      subtitle="Reset links expire after 30 minutes to keep your account safe. Grab a fresh one and you'll be back in a moment."
      caption="Your streak & progress are untouched"
    >
      <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#FFF1EC] text-[#F0562F]">
        <Clock size={26} strokeWidth={2} />
      </div>
      <h2 className="mb-2 font-display text-[27px] font-extrabold tracking-[-0.03em]">This reset link expired</h2>
      <p className="mb-5 text-[15px] leading-relaxed text-ink-secondary">
        For your security, links are valid for 30 minutes. Enter your email to get a fresh one.
      </p>

      <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#FFE0D2] bg-[#FFF7F2] px-3.5 py-3">
        <AlertTriangle size={17} className="flex-none text-[#F0562F]" strokeWidth={2.2} />
        <span className="text-[13px] leading-relaxed text-[#9A5C4A]">
          This link was sent <b className="text-[#C22D24]">over 30 minutes ago</b>.
        </span>
      </div>

      <div className="mb-5">
        <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-[#E4E1EE] bg-[#FBFAFE] px-4 py-3 text-[15px] text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]"
        />
      </div>

      <button
        onClick={() => router.push("/reset")}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_14px_30px_rgba(123,77,255,0.4)] transition-transform hover:-translate-y-0.5"
      >
        <RotateCcw size={16} />
        Send a fresh link
      </button>
      <Link href="/signin" className="flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-ink-muted transition-colors hover:text-ink-secondary">
        <ChevronLeft size={16} />
        Back to sign in
      </Link>
    </AuthSplitLayout>
  );
}
