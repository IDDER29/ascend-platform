"use client";

import { useActionState } from "react";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Flame, ArrowRight } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { cn } from "@/lib/cn";
import { signInAction, signUpAction, type AuthActionState } from "./actions";

type Mode = "signin" | "signup";

const INITIAL_STATE: AuthActionState = { error: null };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#181528">
      <path d="M12 1C5.9 1 1 5.9 1 12c0 4.9 3.2 9 7.6 10.5.6.1.8-.2.8-.5v-1.8c-3.1.7-3.7-1.5-3.7-1.5-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1.9-.2 1.8-.4 2.7-.4.9 0 1.8.1 2.7.4 2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.3.8 1 .8 2.1v3.1c0 .3.2.6.8.5C19.8 21 23 16.9 23 12c0-6.1-4.9-11-11-11z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.6-.2-2.3H12v4.4h5.9c-.3 1.4-1 2.5-2.2 3.3v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2z" />
      <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.9C4.1 20.6 7.8 23 12 23z" />
      <path fill="#FBBC05" d="M6 14.3c-.2-.7-.4-1.4-.4-2.3s.1-1.6.4-2.3V6.8H2.3C1.5 8.4 1 10.1 1 12s.5 3.6 1.3 5.2L6 14.3z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 2.1 14.9 1 12 1 7.8 1 4.1 3.4 2.3 6.8L6 9.7c.9-2.5 3.2-4.3 6-4.3z" />
    </svg>
  );
}

export default function SignInPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [oauthNotice, setOauthNotice] = useState(false);
  const [touched, setTouched] = useState(false);

  const [signInState, signInFormAction, signInPending] = useActionState(signInAction, INITIAL_STATE);
  const [signUpState, signUpFormAction, signUpPending] = useActionState(signUpAction, INITIAL_STATE);
  const actionState = mode === "signin" ? signInState : signUpState;
  const pending = mode === "signin" ? signInPending : signUpPending;

  const nameValid = mode === "signin" || name.trim().length > 0;
  const emailValid = isValidEmail(email);
  const passwordValid = password.length >= 6;
  const confirmValid = mode === "signin" || confirm === password;
  const canSubmit = nameValid && emailValid && passwordValid && confirmValid;

  function validateOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    setTouched(true);
    if (!canSubmit) e.preventDefault();
  }

  return (
    <AuthSplitLayout
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h6v18h-6" />
          <path d="m10 17 5-5-5-5" />
          <path d="M15 12H3" />
        </svg>
      }
      title="Pick up right where you left off."
      subtitle="Your streak, XP and progress are waiting. Sign in and keep climbing — one concept at a time."
      caption={
        <>
          {["Free forever", "Open source", "No credit card"].map((f) => (
            <span key={f} className="inline-flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12E39E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {f}
            </span>
          ))}
        </>
      }
      decoration={
        <div className="mt-8 max-w-[380px] rounded-[20px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3.5">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B4DFF] to-[#C13AE0] font-display text-[19px] font-extrabold">
              A
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-bold">Welcome back, Amine</div>
              <div className="font-mono text-[12.5px] text-[#B9B3D0]">Level 8 · The Craft tier</div>
            </div>
            <div className="flex flex-none items-center gap-1.5 rounded-full border border-[#FF6B4A]/30 bg-[#FF6B4A]/[0.16] px-2.5 py-1">
              <Flame size={13} className="fill-current text-[#FF9A5C]" />
              <span className="text-xs font-extrabold text-[#FF9A5C]">12</span>
            </div>
          </div>
          <div className="mb-1.5 flex justify-between font-mono text-[11.5px] text-[#B9B3D0]">
            <span>Next: What a pointer really is</span>
            <span>62%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.14]">
            <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A]" />
          </div>
        </div>
      }
    >
      <div className="mb-7 inline-flex rounded-xl bg-[#EAE7F4] p-[3px]">
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setTouched(false);
            }}
            className={cn(
              "rounded-[9px] px-5 py-2.5 text-sm font-bold transition-colors",
              mode === m ? "bg-white text-[#5A32D6] shadow-[0_2px_6px_rgba(24,21,40,0.08)]" : "text-ink-muted",
            )}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <h2 className="mb-2 font-display text-[27px] font-extrabold tracking-[-0.03em]">
        {mode === "signin" ? "Welcome back" : "Start climbing"}
      </h2>
      <p className="mb-6 text-[15px] text-ink-secondary">
        {mode === "signin" ? "Sign in to keep your streak alive." : "Create a free account — no credit card, ever."}
      </p>

      <div className="mb-5 flex gap-3">
        {[
          { label: "GitHub", icon: <GitHubIcon /> },
          { label: "Google", icon: <GoogleIcon /> },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setOauthNotice(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E4E1EE] bg-white py-3 text-sm font-bold text-[#2A2540] transition-transform hover:-translate-y-0.5"
          >
            {p.icon}
            {p.label}
          </button>
        ))}
      </div>
      {oauthNotice && (
        <div className="mb-5 rounded-xl border border-[#E4DBFB] bg-[#F1EDFE] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-[#5A32D6]">
          OAuth isn&apos;t wired up in this preview — continue with email below instead.
        </div>
      )}

      <div className="mb-5 flex items-center gap-3.5">
        <div className="h-px flex-1 bg-[#E7E4F2]" />
        <span className="font-mono text-xs text-ink-faint">or with email</span>
        <div className="h-px flex-1 bg-[#E7E4F2]" />
      </div>

      <form action={mode === "signin" ? signInFormAction : signUpFormAction} onSubmit={validateOnSubmit} noValidate>
        {mode === "signup" && (
          <div className="mb-4">
            <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Name</label>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "w-full rounded-xl border bg-[#FBFAFE] px-4 py-3 text-[15px] text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]",
                touched && !nameValid ? "border-[#F0562F]" : "border-[#E4E1EE]",
              )}
            />
            {touched && !nameValid && <p className="mt-1.5 text-xs text-[#F0562F]">Enter your name.</p>}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "w-full rounded-xl border bg-[#FBFAFE] px-4 py-3 text-[15px] text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]",
              touched && !emailValid ? "border-[#F0562F]" : "border-[#E4E1EE]",
            )}
          />
          {touched && !emailValid && <p className="mt-1.5 text-xs text-[#F0562F]">Enter a valid email address.</p>}
        </div>

        <div className="mb-4.5">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-[12.5px] font-bold text-ink-secondary">Password</label>
            {mode === "signin" && (
              <Link href="/reset" className="text-[12.5px] font-semibold text-brand-violet">
                Forgot?
              </Link>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "At least 6 characters" : undefined}
              className={cn(
                "w-full rounded-xl border bg-[#FBFAFE] px-4 py-3 pr-11 text-[15px] text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]",
                touched && !passwordValid ? "border-[#F0562F]" : "border-[#E4E1EE]",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {touched && !passwordValid && <p className="mt-1.5 text-xs text-[#F0562F]">Password must be at least 6 characters.</p>}
        </div>

        {mode === "signup" && (
          <div className="mb-4.5">
            <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Confirm password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={cn(
                "w-full rounded-xl border bg-[#FBFAFE] px-4 py-3 text-[15px] text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]",
                touched && !confirmValid ? "border-[#F0562F]" : "border-[#E4E1EE]",
              )}
            />
            {touched && !confirmValid && <p className="mt-1.5 text-xs text-[#F0562F]">Passwords don&apos;t match.</p>}
          </div>
        )}

        <input type="hidden" name="keepSignedIn" value={keepSignedIn ? "true" : "false"} />
        <label className="mb-5 flex cursor-pointer items-center gap-2.5">
          <button
            type="button"
            onClick={() => setKeepSignedIn((k) => !k)}
            className={cn(
              "flex h-5 w-5 flex-none items-center justify-center rounded-[6px]",
              keepSignedIn ? "bg-gradient-to-br from-[#7B4DFF] to-[#C13AE0]" : "border-2 border-[#DCD7E8]",
            )}
          >
            {keepSignedIn && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </button>
          <span className="text-[13.5px] text-ink-secondary">Keep me signed in</span>
        </label>

        {actionState.error && (
          <div className="mb-4 rounded-xl border border-[#F0C4C0] bg-[#FFF7F5] px-3.5 py-2.5 text-[13px] font-semibold text-[#C22D24]">
            {actionState.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_14px_30px_rgba(123,77,255,0.4)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          {!pending && <ArrowRight size={16} />}
        </button>
      </form>

      <div className="text-center text-sm text-ink-secondary">
        {mode === "signin" ? (
          <>
            New to Ascend?{" "}
            <button onClick={() => setMode("signup")} className="font-bold text-brand-violet">
              Create a free account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => setMode("signin")} className="font-bold text-brand-violet">
              Sign in
            </button>
          </>
        )}
      </div>
      <p className="mt-6 text-center text-[11.5px] leading-relaxed text-ink-faint">
        This creates a real account in this preview&apos;s database (Supabase in production, a local
        SQLite file here) — OAuth is the only part that&apos;s not wired up.
      </p>
      <p className="mt-3 text-center text-[11.5px] leading-relaxed text-ink-faint">
        By continuing you agree to our{" "}
        <Link href="/terms" className="font-semibold text-ink-secondary underline">
          Terms
        </Link>{" "}
        &amp;{" "}
        <Link href="/privacy" className="font-semibold text-ink-secondary underline">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthSplitLayout>
  );
}
