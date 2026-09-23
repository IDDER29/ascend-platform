"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import {
  authErrorBannerClass,
  authFieldErrorClass,
  authHintClass,
  authInputCn,
  authLabelClass,
  authLeadClass,
  authTitleClass,
} from "@/components/auth/auth-styles";
import { Button } from "@/components/ui/button";
import { AuthOAuthButtons } from "@/components/auth/auth-oauth";
import { PATH_STEPS } from "@/components/homepage/path-ladder";
import { cn } from "@/lib/cn";
import { RESET_HREF, SIGNIN_HREF, SIGNUP_HREF } from "@/lib/routes";
import { signInAction, signUpAction, type AuthActionState } from "./actions";

type Mode = "signin" | "signup";

const INITIAL_STATE: AuthActionState = { error: null };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function CaptionCheck({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[color:var(--brand-violet)]"
        aria-hidden
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {children}
    </span>
  );
}

function modeFromSearchParams(params: URLSearchParams): Mode {
  const raw = params.get("mode");
  return raw === "signup" || raw === "register" || raw === "create" ? "signup" : "signin";
}

export function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = modeFromSearchParams(searchParams);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
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

  function switchMode(next: Mode) {
    setTouched(false);
    router.replace(next === "signup" ? SIGNUP_HREF : SIGNIN_HREF, { scroll: false });
  }

  function validateOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    setTouched(true);
    if (!canSubmit) e.preventDefault();
  }

  return (
    <AuthSplitLayout
      icon={
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M15 3h6v18h-6" />
          <path d="m10 17 5-5-5-5" />
          <path d="M15 12H3" />
        </svg>
      }
      title="Pick up right where you left off."
      subtitle="Sign in to save completed lessons and continue the path. Free forever — no credit card."
      mobileLine="Save your place on the path"
      caption={
        <>
          <CaptionCheck>Free forever</CaptionCheck>
          <CaptionCheck>Open source</CaptionCheck>
          <CaptionCheck>No credit card</CaptionCheck>
        </>
      }
      decoration={
        <div className="mt-8 max-w-[360px] rounded-2xl border border-white/12 bg-white/[0.06] p-4.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
          <div className="mb-3.5">
            <div className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45">
              The ascent
            </div>
            <div className="font-display text-[16px] font-extrabold leading-tight tracking-[-0.02em]">
              Until the machine makes sense
            </div>
          </div>
          <ol className="flex list-none flex-col gap-2 border-t border-white/10 pt-3.5">
            {PATH_STEPS.map((step, i, arr) => (
              <li
                key={step.mark}
                className="flex items-baseline gap-2.5"
                style={{ opacity: 0.75 + (i / Math.max(arr.length - 1, 1)) * 0.25 }}
              >
                <span className="w-5 shrink-0 font-mono text-[12px] tabular-nums text-white/45">
                  {`0${i}`}
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[12px] text-white/80">
                    {step.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-white/50 text-pretty">
                    {step.gain}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3.5 border-t border-white/10 pt-3 text-[12px] leading-snug text-white/50 text-pretty">
            Curriculum stays open. Signing in only saves what you&apos;ve finished.
          </p>
        </div>
      }
    >
      {/* w-fit: flex column parent would otherwise stretch this full width */}
      <div
        className="mb-6 flex w-fit max-w-full shrink-0 flex-wrap gap-0.5 rounded-full border border-card-border bg-elevated p-1 dark:bg-paper"
        role="tablist"
        aria-label="Account mode"
      >
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors sm:px-4 sm:py-2 sm:text-[13.5px]",
              mode === m
                ? "bg-brand-gradient text-white shadow-[0_4px_12px_rgba(13,159,110,0.2)]"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <h2 className={authTitleClass}>
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h2>
      <p className={cn(authLeadClass, "mb-5")}>
        {mode === "signin"
          ? "Email and password — curriculum stays open either way."
          : "Free forever. Accounts only save progress."}
      </p>

      <form
        action={mode === "signin" ? signInFormAction : signUpFormAction}
        onSubmit={validateOnSubmit}
        noValidate
      >
        {mode === "signup" ? (
          <div className="mb-4">
            <label className={authLabelClass} htmlFor="auth-name">
              Name
            </label>
            <input
              id="auth-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              className={authInputCn(touched && !nameValid)}
              autoComplete="name"
              autoCapitalize="words"
              spellCheck={false}
              aria-describedby="auth-name-hint"
              aria-invalid={touched && !nameValid ? true : undefined}
            />
            {touched && !nameValid ? (
              <p className={authFieldErrorClass} id="auth-name-hint" role="alert">
                Enter the name you want on your profile.
              </p>
            ) : (
              <p className={authHintClass} id="auth-name-hint">
                Shown on your profile — first name is fine.
              </p>
            )}
          </div>
        ) : null}

        <div className="mb-4">
          <label className={authLabelClass} htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={authInputCn(touched && !emailValid)}
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            aria-describedby="auth-email-hint"
            aria-invalid={touched && !emailValid ? true : undefined}
          />
          {touched && !emailValid ? (
            <p className={authFieldErrorClass} id="auth-email-hint" role="alert">
              Use a valid email, like you@example.com.
            </p>
          ) : (
            <p className={authHintClass} id="auth-email-hint">
              {mode === "signin"
                ? "The address you used when you signed up."
                : "We’ll use this to sign you in — no spam."}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className={authLabelClass} htmlFor="auth-password">
            Password
          </label>
          <div className="relative">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
              className={authInputCn(touched && !passwordValid, "pr-11")}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              spellCheck={false}
              aria-describedby="auth-password-hint"
              aria-invalid={touched && !passwordValid ? true : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {touched && !passwordValid ? (
            <p className={authFieldErrorClass} id="auth-password-hint" role="alert">
              Password must be at least 6 characters.
            </p>
          ) : mode === "signup" ? (
            <p className={authHintClass} id="auth-password-hint">
              {password.length === 0
                ? "Minimum 6 characters. Longer is safer."
                : password.length < 6
                  ? `${6 - password.length} more character${6 - password.length === 1 ? "" : "s"} to go.`
                  : "Looks good — you can create the account."}
            </p>
          ) : (
            <div
              className="mt-1.5 flex items-center justify-between gap-3"
              id="auth-password-hint"
            >
              <p className="text-[12px] leading-snug text-ink-faint text-pretty">
                Keep this somewhere safe.
              </p>
              <Link
                href={RESET_HREF}
                className="shrink-0 text-[12.5px] font-bold text-brand-violet transition-colors hover:text-brand-magenta"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </div>

        {mode === "signup" ? (
          <div className="mb-4">
            <label className={authLabelClass} htmlFor="auth-confirm">
              Confirm password
            </label>
            <input
              id="auth-confirm"
              type={showPassword ? "text" : "password"}
              name="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Type it again"
              className={authInputCn(touched && !confirmValid)}
              autoComplete="new-password"
              spellCheck={false}
              aria-describedby="auth-confirm-hint"
              aria-invalid={touched && !confirmValid ? true : undefined}
            />
            {touched && !confirmValid ? (
              <p className={authFieldErrorClass} id="auth-confirm-hint" role="alert">
                Passwords don&apos;t match yet.
              </p>
            ) : confirm.length > 0 && confirmValid ? (
              <p className={cn(authHintClass, "text-xp-text")} id="auth-confirm-hint">
                Passwords match.
              </p>
            ) : (
              <p className={authHintClass} id="auth-confirm-hint">
                Re-enter the same password to avoid typos.
              </p>
            )}
          </div>
        ) : null}

        <input type="hidden" name="keepSignedIn" value={keepSignedIn ? "true" : "false"} />
        <label className="mb-5 flex cursor-pointer items-center gap-2.5">
          <button
            type="button"
            onClick={() => setKeepSignedIn((k) => !k)}
            className={cn(
              "flex h-5 w-5 flex-none items-center justify-center rounded-[6px] transition-colors",
              keepSignedIn
                ? "bg-brand-gradient"
                : "border-2 border-card-border bg-elevated dark:bg-paper",
            )}
            aria-pressed={keepSignedIn}
            aria-label="Keep me signed in"
          >
            {keepSignedIn ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : null}
          </button>
          <span className="text-[13.5px] text-ink-secondary">Keep me signed in</span>
        </label>

        {actionState.error ? (
          <div className={authErrorBannerClass} role="alert">
            {actionState.error}
          </div>
        ) : null}

        <Button type="submit" disabled={pending} size="lg" className="mb-5 w-full">
          {pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          {!pending ? <ArrowRight size={16} /> : null}
        </Button>
      </form>

      {/* Placeholder OAuth — enable via OAUTH_ENABLED in auth-oauth.tsx */}
      <AuthOAuthButtons className="mb-6" />

      <p className="text-center text-[11.5px] leading-relaxed text-ink-faint">
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
