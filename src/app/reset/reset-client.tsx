"use client";

/**
 * Forgot-password request + check-inbox.
 * Flip RESET_EMAIL_ENABLED + wire submit when email is live.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, RefreshCw, ArrowRight } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import {
  authFieldErrorClass,
  authHintClass,
  authIconBadgeClass,
  authIconBadgeSuccessClass,
  authInfoBannerClass,
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
  RESET_LINK_TTL_MINUTES,
  RESET_NEW_PASSWORD_HREF,
  RESET_RESEND_COOLDOWN_SEC,
} from "@/lib/auth/reset-flow";
import { SIGNIN_HREF } from "@/lib/routes";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
        Reset email isn&apos;t wired yet — this screen is the final UI. Nothing is emailed or
        changed until we flip it on.
      </span>
    </div>
  );
}

export default function ResetRequestPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
    // When RESET_EMAIL_ENABLED: call requestPasswordResetAction(email) here.
    setSent(true);
    setCooldown(RESET_RESEND_COOLDOWN_SEC);
  }

  function resend() {
    if (cooldown > 0) return;
    // When RESET_EMAIL_ENABLED: call requestPasswordResetAction(email) again.
    setCooldown(RESET_RESEND_COOLDOWN_SEC);
  }

  if (sent) {
    return (
      <AuthSplitLayout
        icon={<Mail size={26} strokeWidth={2} />}
        title="Check your inbox."
        subtitle={
          RESET_EMAIL_ENABLED
            ? `We sent a reset link if an account exists for that address. It expires in ${RESET_LINK_TTL_MINUTES} minutes.`
            : "When email is live, this is the confirmation screen after someone requests a reset."
        }
        caption={
          RESET_EMAIL_ENABLED ? "Reset link sent" : "Coming soon · no email sent"
        }
        mobileLine="Reset link confirmation"
      >
        <div className={authIconBadgeSuccessClass}>
          <Mail size={26} strokeWidth={2} />
        </div>
        <h2 className={authTitleClass}>Check your inbox</h2>
        <p className={authLeadClass}>
          {RESET_EMAIL_ENABLED ? (
            <>
              If an account exists for <b className="text-ink">{email}</b>, you&apos;ll get a
              link shortly. Check spam if it&apos;s not there in a minute.
            </>
          ) : (
            <>
              Preview for <b className="text-ink">{email}</b>. No message was sent — flip{" "}
              <code className="font-mono text-[12px]">RESET_EMAIL_ENABLED</code> when the
              backend is ready.
            </>
          )}
        </p>

        <ComingSoonNote />

        <div className="mb-4 flex flex-col gap-2.5">
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={() => router.push(SIGNIN_HREF)}
          >
            Back to sign in
          </Button>
          {!RESET_EMAIL_ENABLED ? (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => router.push(RESET_NEW_PASSWORD_HREF)}
            >
              Preview set-new-password
              <ArrowRight size={16} />
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[13.5px] text-ink-muted">
          Didn&apos;t get it?
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0}
            className={cn(
              "inline-flex items-center gap-1 font-bold",
              cooldown > 0 ? "text-ink-fainter" : "text-brand-violet",
            )}
          >
            <RefreshCw size={12} />
            Resend
          </button>
          {cooldown > 0 ? (
            <span className="font-mono text-ink-faint">
              0:{String(cooldown).padStart(2, "0")}
            </span>
          ) : null}
        </div>

        <Link href={SIGNIN_HREF} className={cn(authMutedLinkClass, "mt-6")}>
          <ChevronLeft size={16} />
          Back to sign in
        </Link>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      icon={<Mail size={26} strokeWidth={2} />}
      title="Forgot your password?"
      subtitle="Enter your email and we’ll send a link to choose a new one. Your progress stays exactly where you left it."
      caption={
        RESET_EMAIL_ENABLED ? "Password reset" : "Coming soon · UI ready"
      }
      mobileLine="Reset your password"
    >
      <div className={authIconBadgeClass}>
        <Mail size={26} strokeWidth={2} />
      </div>
      <h2 className={authTitleClass}>Forgot your password?</h2>
      <p className={authLeadClass}>
        We&apos;ll email a secure link. Links expire after {RESET_LINK_TTL_MINUTES} minutes.
      </p>

      <ComingSoonNote />

      <form onSubmit={submit} noValidate>
        <div className="mb-5">
          <label className={authLabelClass} htmlFor="reset-email">
            Email address
          </label>
          <input
            id="reset-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputCn(touched && !emailValid)}
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            aria-describedby="reset-email-hint"
            aria-invalid={touched && !emailValid ? true : undefined}
          />
          {touched && !emailValid ? (
            <p className={authFieldErrorClass} id="reset-email-hint" role="alert">
              Enter a valid email address.
            </p>
          ) : (
            <p className={authHintClass} id="reset-email-hint">
              {RESET_EMAIL_ENABLED
                ? "Use the address on your Ascend account."
                : "Walk through the flow — nothing is emailed yet."}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" className="mb-4 w-full">
          {RESET_EMAIL_ENABLED ? "Send reset link" : "Continue to confirmation"}
        </Button>
      </form>

      <Link href={SIGNIN_HREF} className={authMutedLinkClass}>
        <ChevronLeft size={16} />
        Back to sign in
      </Link>

      <div className={authInfoBannerClass}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 flex-none text-brand-violet"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        Remembered it?{" "}
        <Link href={SIGNIN_HREF} className="font-semibold text-ink-secondary underline">
          Sign in with email
        </Link>
        .
      </div>
    </AuthSplitLayout>
  );
}
