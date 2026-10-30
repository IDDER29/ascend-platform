"use client";

/**
 * Expired / invalid reset-link landing.
 * Shown when token is missing, used, or past TTL.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Clock, AlertTriangle, RotateCcw } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import {
  authFieldErrorClass,
  authHintClass,
  authIconBadgeClass,
  authInputCn,
  authLabelClass,
  authLeadClass,
  authMutedLinkClass,
  authTitleClass,
  authWarnBannerClass,
} from "@/components/auth/auth-styles";
import { Button } from "@/components/ui/button";
import {
  RESET_EMAIL_ENABLED,
  RESET_HREF,
  RESET_LINK_TTL_MINUTES,
} from "@/lib/auth/reset-flow";
import { SIGNIN_HREF } from "@/lib/routes";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ResetExpiredPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const emailValid = isValidEmail(email);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!emailValid) return;
    // When RESET_EMAIL_ENABLED: call requestPasswordResetAction(email), then go to /reset?sent=1
    // For now: hand off to request page with the email flow.
    router.push(RESET_HREF);
  }

  return (
    <AuthSplitLayout
      icon={<Clock size={26} strokeWidth={2} />}
      title="That link timed out — no problem."
      subtitle={`Reset links expire after ${RESET_LINK_TTL_MINUTES} minutes to keep your account safe. Grab a fresh one and you'll be back in a moment.`}
      caption={
        RESET_EMAIL_ENABLED
          ? "Link expired"
          : "Coming soon · UI ready"
      }
      mobileLine="Reset link expired"
    >
      <div className={authIconBadgeClass}>
        <Clock size={26} strokeWidth={2} />
      </div>
      <h2 className={authTitleClass}>This reset link expired</h2>
      <p className={authLeadClass}>
        For your security, links are valid for {RESET_LINK_TTL_MINUTES} minutes. Enter your
        email to get a fresh one.
      </p>

      {!RESET_EMAIL_ENABLED ? (
        <div className={authWarnBannerClass} role="status">
          <AlertTriangle size={17} className="mt-0.5 flex-none" strokeWidth={2.2} />
          <span>
            Email isn&apos;t wired yet — this is the expired-link screen. Continuing takes you
            to the request flow UI.
          </span>
        </div>
      ) : (
        <div className={authWarnBannerClass} role="status">
          <AlertTriangle size={17} className="mt-0.5 flex-none" strokeWidth={2.2} />
          <span>
            This link was sent{" "}
            <b>over {RESET_LINK_TTL_MINUTES} minutes ago</b>, or it was already used.
          </span>
        </div>
      )}

      <form onSubmit={submit} noValidate>
        <div className="mb-5">
          <label className={authLabelClass} htmlFor="expired-email">
            Email address
          </label>
          <input
            id="expired-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputCn(touched && !emailValid)}
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            aria-describedby="expired-email-hint"
            aria-invalid={touched && !emailValid ? true : undefined}
          />
          {touched && !emailValid ? (
            <p className={authFieldErrorClass} id="expired-email-hint" role="alert">
              Enter a valid email address.
            </p>
          ) : (
            <p className={authHintClass} id="expired-email-hint">
              We&apos;ll send a new link to this address when email is live.
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="mb-4 w-full">
          <RotateCcw size={16} />
          {RESET_EMAIL_ENABLED ? "Send a fresh link" : "Request a fresh link"}
        </Button>
      </form>

      <Link href={SIGNIN_HREF} className={authMutedLinkClass}>
        <ChevronLeft size={16} />
        Back to sign in
      </Link>
    </AuthSplitLayout>
  );
}
