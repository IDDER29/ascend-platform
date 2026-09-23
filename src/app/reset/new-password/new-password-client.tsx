"use client";

/**
 * Set-new-password (token link landing) + success.
 * Flip RESET_EMAIL_ENABLED + validate token + update password when live.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  Flame,
  ArrowRight,
} from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import {
  authFieldErrorClass,
  authHintClass,
  authIconBadgeClass,
  authIconBadgeSuccessClass,
  authInputCn,
  authLabelClass,
  authLeadClass,
  authMutedLinkClass,
  authTitleClass,
  authWarnBannerClass,
} from "@/components/auth/auth-styles";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  RESET_EMAIL_ENABLED,
  RESET_EXPIRED_HREF,
  RESET_HREF,
} from "@/lib/auth/reset-flow";
import { SIGNIN_HREF } from "@/lib/routes";

const PREVIEW_EMAIL = "you@example.com";

function checkStrength(pw: string) {
  const hasLength = pw.length >= 12;
  const hasNumberAndSymbol = /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  const hasMixedCase = /[a-z]/.test(pw) && /[A-Z]/.test(pw);
  const passed = [hasLength, hasNumberAndSymbol, hasMixedCase].filter(Boolean).length;
  return { hasLength, hasNumberAndSymbol, hasMixedCase, passed };
}

function ComingSoonNote() {
  if (RESET_EMAIL_ENABLED) return null;
  return (
    <div className={authWarnBannerClass} role="status">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 flex-none"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <span>
        Password isn&apos;t updated yet — final UI only. When live, this page reads{" "}
        <code className="font-mono text-[12px]">?token=</code> from the email link.
      </span>
    </div>
  );
}

export function NewPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);

  const accountEmail = PREVIEW_EMAIL;
  const strength = checkStrength(password);
  const confirmMatches = confirm.length > 0 && confirm === password;
  const canSubmit = strength.passed === 3 && confirmMatches;
  const strengthLabel =
    strength.passed === 3 ? "Strong" : strength.passed >= 1 ? "Weak" : "Too short";
  const strengthColor =
    strength.passed === 3
      ? "text-xp-text"
      : strength.passed >= 1
        ? "text-streak-text"
        : "text-ink-faint";

  useEffect(() => {
    // When enabled: missing token → expired. Stub allows preview without token.
    if (RESET_EMAIL_ENABLED && !token) {
      router.replace(RESET_EXPIRED_HREF);
    }
  }, [token, router]);

  if (done) {
    return (
      <AuthSplitLayout
        icon={<Check size={26} strokeWidth={2.6} />}
        title="You're back in."
        subtitle="Your password is ready. Pick up exactly where you left off."
        caption={
          RESET_EMAIL_ENABLED ? "Password updated" : "Coming soon · UI preview"
        }
        mobileLine="Password updated"
      >
        <div className={authIconBadgeSuccessClass}>
          <Check size={28} strokeWidth={2.6} />
        </div>
        <h2 className={authTitleClass}>
          {RESET_EMAIL_ENABLED ? "Password updated" : "Flow complete (preview)"}
        </h2>
        <p className={authLeadClass}>
          {RESET_EMAIL_ENABLED
            ? "Sign in with your new password. Your curriculum progress is untouched."
            : "No password was changed. When email is wired, this is the success screen after a real reset."}
        </p>
        <Button
          type="button"
          size="lg"
          className="mb-4 w-full"
          onClick={() => router.push(SIGNIN_HREF)}
        >
          Sign in
          <ArrowRight size={16} />
        </Button>
        {!RESET_EMAIL_ENABLED ? (
          <Link href={RESET_EXPIRED_HREF} className={authMutedLinkClass}>
            Preview expired-link screen
          </Link>
        ) : null}
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      icon={<KeyRound size={26} strokeWidth={2} />}
      title="One strong password and you're back in."
      subtitle="Choose something you'll remember. Your progress is waiting exactly where you left it."
      caption={
        RESET_EMAIL_ENABLED ? "Set a new password" : "Coming soon · UI ready"
      }
      mobileLine="Set a new password"
      decoration={
        <div className="mt-8 flex max-w-[360px] items-center gap-3.5 rounded-2xl border border-white/15 bg-white/[0.07] px-4.5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-brand-gradient font-display text-lg font-extrabold">
            A
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold">{accountEmail}</div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-white/55">
              {RESET_EMAIL_ENABLED ? "Resetting password" : "Preview account"}
              <Flame size={12} className="fill-current text-[color:var(--brand-orange)]" />
            </div>
          </div>
        </div>
      }
    >
      <div className={authIconBadgeClass}>
        <KeyRound size={26} strokeWidth={2} />
      </div>
      <h2 className={authTitleClass}>Set a new password</h2>
      <p className={authLeadClass}>
        For <b className="text-ink">{accountEmail}</b>. Make it strong — it protects everything
        you&apos;ve built.
      </p>

      <ComingSoonNote />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (!canSubmit) return;
          // When RESET_EMAIL_ENABLED: call resetPasswordAction({ token, password }).
          setDone(true);
        }}
        noValidate
      >
        <div className="mb-4">
          <label className={authLabelClass} htmlFor="new-password">
            New password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={authInputCn(touched && strength.passed < 3, "pr-11")}
              autoComplete="new-password"
              spellCheck={false}
              aria-describedby="new-password-hint"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="my-3 flex gap-1.5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i < strength.passed ? "bg-brand-gradient" : "bg-card-border",
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

          <div className="flex flex-col gap-2" id="new-password-hint">
            {[
              { ok: strength.hasLength, label: "At least 12 characters" },
              { ok: strength.hasNumberAndSymbol, label: "A number and a symbol" },
              { ok: strength.hasMixedCase, label: "Mixed-case letters" },
            ].map((req) => (
              <div
                key={req.label}
                className={cn(
                  "flex items-center gap-2 text-[12.5px]",
                  req.ok ? "text-xp-text" : "text-ink-faint",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 flex-none items-center justify-center rounded-full",
                    req.ok ? "bg-brand-violet" : "border border-card-border",
                  )}
                >
                  {req.ok ? <Check size={10} strokeWidth={3.4} className="text-white" /> : null}
                </span>
                {req.label}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className={authLabelClass} htmlFor="confirm-password">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={authInputCn(touched && confirm.length > 0 && !confirmMatches, "pr-11")}
              autoComplete="new-password"
              spellCheck={false}
              aria-describedby="confirm-password-hint"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirm.length > 0 ? (
            <p
              className={cn(
                "mt-2 flex items-center gap-1.5 text-[12.5px]",
                confirmMatches ? "text-xp-text" : "text-red-600 dark:text-red-400",
              )}
              id="confirm-password-hint"
              role={confirmMatches ? undefined : "alert"}
            >
              <Check size={14} strokeWidth={2.8} />
              {confirmMatches ? "Passwords match" : "Passwords don't match yet"}
            </p>
          ) : touched && !confirm ? (
            <p className={authFieldErrorClass} id="confirm-password-hint" role="alert">
              Confirm your new password.
            </p>
          ) : (
            <p className={authHintClass} id="confirm-password-hint">
              Re-enter the same password to avoid typos.
            </p>
          )}
        </div>

        <Button type="submit" size="lg" disabled={!canSubmit} className="mb-4 w-full">
          {RESET_EMAIL_ENABLED ? "Reset password & sign in" : "Complete preview"}
          <ArrowRight size={16} />
        </Button>
      </form>

      <Link href={RESET_HREF} className={authMutedLinkClass}>
        <ChevronLeft size={16} />
        Request a different link
      </Link>
    </AuthSplitLayout>
  );
}
