"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, RefreshCw } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { cn } from "@/lib/cn";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const RESEND_COOLDOWN = 30;

export default function ResetRequestPage() {
  const router = useRouter();
  const [email, setEmail] = useState("amine@example.com");
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const emailValid = isValidEmail(email);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!emailValid) return;
    setSent(true);
    setCooldown(RESEND_COOLDOWN);
  }

  if (sent) {
    return (
      <AuthSplitLayout
        icon={<Mail size={26} strokeWidth={2} />}
        title="Happens to everyone. Let's get you back in."
        subtitle="We sent a secure link to set a new password. Your streak and progress stay untouched."
        caption="Reset links expire after 30 minutes"
      >
        <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#E7F8F0] text-[#12A472]">
          <Mail size={26} strokeWidth={2} />
        </div>
        <h2 className="mb-2 font-display text-[27px] font-extrabold tracking-[-0.03em]">Check your inbox</h2>
        <p className="mb-6 text-[15px] leading-relaxed text-ink-secondary">
          We sent a reset link to <b className="text-[#2A2540]">{email}</b>. It expires in 30 minutes.
        </p>

        <div className="mb-3.5 flex flex-col gap-2.5">
          <button
            onClick={() => router.push("/reset/new-password")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] py-3.5 text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(123,77,255,0.4)] transition-transform hover:-translate-y-0.5"
          >
            Continue (open the emailed link)
          </button>
          <button
            onClick={() => router.push("/reset/expired")}
            className="w-full rounded-xl border border-[#E4E1EE] bg-white py-3 text-[13.5px] font-semibold text-ink-secondary transition-transform hover:-translate-y-0.5"
          >
            Simulate an expired link instead
          </button>
        </div>
        <p className="mb-5 text-center text-[11.5px] leading-relaxed text-ink-faint">
          This preview can&apos;t send real email — pick either real path above to see how each one behaves.
        </p>

        <div className="flex items-center justify-center gap-1.5 text-[13.5px] text-ink-muted">
          Didn&apos;t get it?
          <button
            onClick={() => setCooldown(RESEND_COOLDOWN)}
            disabled={cooldown > 0}
            className={cn("inline-flex items-center gap-1 font-bold", cooldown > 0 ? "text-ink-fainter" : "text-brand-violet")}
          >
            <RefreshCw size={12} />
            Resend
          </button>
          {cooldown > 0 && <span className="font-mono text-ink-faint">0:{String(cooldown).padStart(2, "0")}</span>}
        </div>

        <Link href="/signin" className="mt-6 flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-ink-muted">
          <ChevronLeft size={16} />
          Back to sign in
        </Link>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      icon={<Mail size={26} strokeWidth={2} />}
      title="Happens to everyone. Let's get you back in."
      subtitle="Enter the email on your account and we'll send a secure link to set a new password. Your streak and progress stay untouched."
      caption="Reset links expire after 30 minutes"
    >
      <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#F1EDFE] text-brand-violet">
        <Mail size={26} strokeWidth={2} />
      </div>
      <h2 className="mb-2 font-display text-[27px] font-extrabold tracking-[-0.03em]">Forgot your password?</h2>
      <p className="mb-6 text-[15px] leading-relaxed text-ink-secondary">
        No worries — enter your email and we&apos;ll send a reset link.
      </p>

      <form onSubmit={submit} noValidate>
        <div className="mb-5">
          <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "w-full rounded-xl border bg-[#FBFAFE] px-4 py-3 text-[15px] text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]",
              touched && !emailValid ? "border-[#F0562F]" : "border-[#E4E1EE]",
            )}
          />
          {touched && !emailValid && <p className="mt-1.5 text-xs text-[#F0562F]">Enter a valid email address.</p>}
        </div>
        <button
          type="submit"
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_14px_30px_rgba(123,77,255,0.4)] transition-transform hover:-translate-y-0.5"
        >
          Send reset link
        </button>
      </form>
      <Link href="/signin" className="flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-ink-muted">
        <ChevronLeft size={16} />
        Back to sign in
      </Link>

      <div className="mt-6 flex items-start gap-2.5 border-t border-[#EAE7F2] pt-5 text-[12.5px] leading-relaxed text-ink-muted">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6D46F2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        Signed up with GitHub or Google? Use that button on the sign-in page instead.
      </div>
    </AuthSplitLayout>
  );
}
