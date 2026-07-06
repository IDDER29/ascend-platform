"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, KeyRound, Eye, EyeOff, Check, Flame, ArrowRight } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { cn } from "@/lib/cn";

const DEMO_EMAIL = "amine@example.com";

function checkStrength(pw: string) {
  const hasLength = pw.length >= 12;
  const hasNumberAndSymbol = /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  const hasMixedCase = /[a-z]/.test(pw) && /[A-Z]/.test(pw);
  const passed = [hasLength, hasNumberAndSymbol, hasMixedCase].filter(Boolean).length;
  return { hasLength, hasNumberAndSymbol, hasMixedCase, passed };
}

export default function SetNewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const strength = checkStrength(password);
  const confirmMatches = confirm.length > 0 && confirm === password;
  const canSubmit = strength.passed === 3 && confirmMatches;
  const strengthLabel = strength.passed === 3 ? "Strong" : strength.passed >= 1 ? "Weak" : "Too short";
  const strengthColor = strength.passed === 3 ? "text-brand-violet" : strength.passed >= 1 ? "text-[#E0900A]" : "text-ink-faint";

  if (done) {
    return (
      <AuthSplitLayout
        icon={<Check size={26} strokeWidth={2.6} />}
        title="One strong password and you're back in."
        subtitle="Your password is updated. Your streak and everything you learned are exactly where you left them."
        caption="Password updated just now"
      >
        <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#E7F8F0] text-[#12A472]">
          <Check size={28} strokeWidth={2.6} />
        </div>
        <h2 className="mb-2 font-display text-[27px] font-extrabold tracking-[-0.03em]">You&apos;re all set</h2>
        <p className="mb-6 text-[15px] leading-relaxed text-ink-secondary">
          Your password is updated. Your 12-day streak and everything you&apos;ve learned are exactly where you left
          them.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_14px_30px_rgba(123,77,255,0.4)] transition-transform hover:-translate-y-0.5"
        >
          Continue to Ascend
          <ArrowRight size={16} />
        </button>
        <div className="flex items-center justify-center gap-2 font-mono text-[12.5px] text-ink-muted">
          <Flame size={16} className="fill-current text-[#FF6B4A]" />
          Welcome back — streak still alive
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      icon={<KeyRound size={26} strokeWidth={2} />}
      title="One strong password and you're back in."
      subtitle="Choose something you'll remember. Your streak, XP and everything you've built are waiting exactly where you left them."
      caption="Secured reset link · expires in 30 min"
      decoration={
        <div className="mt-8 flex max-w-[360px] items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.06] px-4.5 py-4 backdrop-blur-sm">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-[#7B4DFF] to-[#C13AE0] font-display text-lg font-extrabold">
            A
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold">{DEMO_EMAIL}</div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#B9B3D0]">
              Level 8 · 12-day streak
              <Flame size={12} className="fill-current text-[#FF6B4A]" />
            </div>
          </div>
        </div>
      }
    >
      <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#FBEBFA] text-[#C13AE0]">
        <KeyRound size={26} strokeWidth={2} />
      </div>
      <h2 className="mb-2 font-display text-[27px] font-extrabold tracking-[-0.03em]">Set a new password</h2>
      <p className="mb-6 text-[15px] leading-relaxed text-ink-secondary">
        For <b className="text-[#2A2540]">{DEMO_EMAIL}</b>. Make it strong — it protects everything you&apos;ve built.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) setDone(true);
        }}
      >
        <div className="mb-4">
          <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">New password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#E4E1EE] bg-[#FBFAFE] px-4 py-3 pr-11 text-[15px] text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="my-3 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i < strength.passed ? "bg-gradient-to-r from-[#7B4DFF] to-[#C13AE0]" : "bg-[#EDEAF6]",
                )}
              />
            ))}
          </div>
          <div className="mb-3.5 flex items-center justify-between">
            <span className="text-xs text-ink-muted">Password strength</span>
            <span className={cn("font-mono text-xs font-bold", strengthColor)}>
              {password ? strengthLabel : "—"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { ok: strength.hasLength, label: "At least 12 characters" },
              { ok: strength.hasNumberAndSymbol, label: "A number and a symbol" },
              { ok: strength.hasMixedCase, label: "Mixed-case letters" },
            ].map((req) => (
              <div key={req.label} className={cn("flex items-center gap-2 text-[12.5px]", req.ok ? "text-[#12A472]" : "text-ink-faint")}>
                <span className={cn("flex h-4 w-4 flex-none items-center justify-center rounded-full", req.ok ? "bg-[#12B981]" : "border border-[#DCD7E8]")}>
                  {req.ok && <Check size={10} strokeWidth={3.4} className="text-white" />}
                </span>
                {req.label}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Confirm password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-[#E4E1EE] bg-[#FBFAFE] px-4 py-3 pr-11 text-[15px] text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirm.length > 0 && (
            <div className={cn("mt-2 flex items-center gap-1.5 text-[12.5px]", confirmMatches ? "text-[#12A472]" : "text-[#F0562F]")}>
              <Check size={14} strokeWidth={2.8} />
              {confirmMatches ? "Passwords match" : "Passwords don't match yet"}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_14px_30px_rgba(123,77,255,0.4)] transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-40"
        >
          Reset password &amp; sign in
          <ArrowRight size={16} />
        </button>
      </form>
      <Link href="/signin" className="flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-ink-muted">
        <ChevronLeft size={16} />
        Back to sign in
      </Link>
    </AuthSplitLayout>
  );
}
