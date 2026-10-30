"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Clock, KeyRound, Mail } from "lucide-react";
import { CONTENT_REPO_URL } from "@/lib/brand/repo";
import {
  MIN_PASSWORD_LENGTH,
  RESET_EMAIL_ENABLED,
  RESET_HREF,
  RESET_LINK_TTL_MINUTES,
  RESET_RESEND_COOLDOWN_SEC,
} from "@/lib/auth/reset-flow";
import { requestPasswordResetAction, resetPasswordAction, type ResetActionState } from "@/lib/auth/reset-actions";
import { FIRST_LESSON_HREF, SIGNIN_HREF, SIGNUP_HREF } from "@/lib/routes";

const INITIAL: ResetActionState = {};
const LIME =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--coach-lime)] px-6 text-[16px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_3px_0_var(--coach-lime-shadow)] disabled:cursor-wait disabled:opacity-70";
const OUTLINE =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full border-2 border-[var(--coach-border)] px-6 text-[15px] font-semibold text-[var(--coach-ink)] no-underline hover:border-[var(--coach-border-strong)]";
const LINK = "font-semibold text-[var(--coach-ink)] underline underline-offset-2";
const input = (invalid: boolean) =>
  `block h-12 w-full rounded-xl border-2 bg-[var(--coach-surface)] px-4 text-[16px] text-[var(--coach-ink)] placeholder:text-[var(--coach-ink-muted)] focus:border-[var(--coach-ink)] focus:outline-none ${
    invalid ? "border-[var(--coach-wrong-border)]" : "border-[var(--coach-border)]"
  }`;
const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** The card every reset screen sits in: an icon, a title, what's going on, then the content. */
function ResetCard({
  icon: Icon,
  title,
  lead,
  children,
}: {
  icon: typeof Mail;
  title: string;
  lead: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[520px] rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-6 sm:p-8">
      <span
        aria-hidden
        className="flex size-12 items-center justify-center rounded-xl bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]"
      >
        <Icon size={22} strokeWidth={2.2} />
      </span>
      <h1 className="m-0 mt-5 font-display text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:balance]">
        {title}
      </h1>
      <p className="m-0 mt-2 text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)]">{lead}</p>
      <div className="mt-6 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 flex items-start gap-2.5 rounded-xl border-2 border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-bg)] px-4 py-3 text-[14.5px] font-semibold text-[var(--coach-wrong-ink)]">
      <AlertCircle size={18} strokeWidth={2.4} className="mt-0.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

/** What to do while email reset isn't switched on. */
function NotYet() {
  return (
    <ResetCard
      icon={KeyRound}
      title="Password reset is coming"
      lead="Ascend can't send reset emails yet. Until it can, here's what you can do."
    >
      <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
        <li>
          <span className="font-semibold text-[var(--coach-ink)]">Try again.</span> Passwords are case-sensitive, and a
          password manager may have saved it.
        </li>
        <li>
          <span className="font-semibold text-[var(--coach-ink)]">Keep learning without an account.</span> Every lesson
          is open.
        </li>
        <li>
          <span className="font-semibold text-[var(--coach-ink)]">Need your old account back?</span>{" "}
          <a href={`${CONTENT_REPO_URL}/issues/new`} target="_blank" rel="noopener noreferrer" className={LINK}>
            Open an issue on GitHub
          </a>{" "}
          and we&apos;ll help. Don&apos;t post your email publicly; we&apos;ll ask for it privately.
        </li>
      </ul>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Link href={SIGNIN_HREF} className={LIME}>
          Back to sign in
        </Link>
        <Link href={FIRST_LESSON_HREF} className={OUTLINE}>
          Read a lesson
        </Link>
      </div>
    </ResetCard>
  );
}

/** /reset: ask for a link by email, then "check your inbox" with a resend timer. */
export function ResetRequest() {
  const [email, setEmail] = useState("");
  const [tried, setTried] = useState(false);
  const [state, action, pending] = useActionState(requestPasswordResetAction, INITIAL);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!RESET_EMAIL_ENABLED) return <NotYet />;

  if (state.ok) {
    return (
      <ResetCard
        icon={Mail}
        title="Check your inbox"
        lead={
          <>
            If there&apos;s an account for <span className="font-semibold text-[var(--coach-ink)]">{email}</span>, a
            link to choose a new password is on its way. It works for {RESET_LINK_TTL_MINUTES} minutes.
          </>
        }
      >
        <p className="m-0 text-[14.5px] text-[var(--coach-ink-secondary)]">
          Nothing after a minute? Check spam, or send it again.
        </p>
        <form action={action} onSubmit={() => setCooldown(RESET_RESEND_COOLDOWN_SEC)}>
          <input type="hidden" name="email" value={email} />
          <button type="submit" disabled={cooldown > 0 || pending} className={`${OUTLINE} disabled:opacity-60`}>
            {cooldown > 0 ? `Send again in ${cooldown}s` : "Send the link again"}
          </button>
        </form>
        <Link href={SIGNIN_HREF} className={LIME}>
          Back to sign in
        </Link>
      </ResetCard>
    );
  }

  const invalid = tried && !isEmail(email);
  return (
    <ResetCard
      icon={KeyRound}
      title="Forgot your password?"
      lead="Enter the email you signed up with and we'll send a link to choose a new one. Your progress stays where it is."
    >
      <form
        action={action}
        onSubmit={(e) => {
          setTried(true);
          if (!isEmail(email)) {
            e.preventDefault();
            document.getElementById("reset-email")?.focus();
          } else setCooldown(RESET_RESEND_COOLDOWN_SEC);
        }}
        noValidate
        className="flex flex-col gap-4"
      >
        <div>
          <label htmlFor="reset-email" className="mb-1.5 block text-[14px] font-semibold">
            Email
          </label>
          <input
            id="reset-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            placeholder="you@example.com"
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? "reset-email-error" : undefined}
            className={input(invalid)}
          />
          {invalid && (
            <p id="reset-email-error" className="m-0 mt-1.5 text-[13px] font-semibold text-[var(--coach-wrong-title)]">
              Enter an email like you@example.com.
            </p>
          )}
        </div>
        <div aria-live="polite">{state.error && <ErrorNote>{state.error}</ErrorNote>}</div>
        <button type="submit" disabled={pending} className={LIME}>
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <p className="m-0 text-center text-[14px] text-[var(--coach-ink-muted)]">
        Remembered it?{" "}
        <Link href={SIGNIN_HREF} className={LINK}>
          Sign in
        </Link>
      </p>
    </ResetCard>
  );
}

/** /reset/new-password?token=…: choose a new password from the emailed link. */
export function NewPassword() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [tried, setTried] = useState(false);
  const [state, action, pending] = useActionState(resetPasswordAction, INITIAL);

  if (!RESET_EMAIL_ENABLED) return <NotYet />;
  if (!token) return <ResetExpired />;

  if (state.ok) {
    return (
      <ResetCard
        icon={CheckCircle2}
        title="Password changed"
        lead="Sign in with your new password to pick up where you left off."
      >
        <Link href={SIGNIN_HREF} className={LIME}>
          Sign in
        </Link>
      </ResetCard>
    );
  }

  const errors = {
    password: password.length < MIN_PASSWORD_LENGTH ? `Use at least ${MIN_PASSWORD_LENGTH} characters.` : null,
    confirm: confirm !== password ? "The two passwords don't match." : null,
  };
  return (
    <ResetCard
      icon={KeyRound}
      title="Choose a new password"
      lead="Something you'll remember, and haven't used elsewhere."
    >
      <form
        action={action}
        onSubmit={(e) => {
          setTried(true);
          const first = errors.password ? "new-password" : errors.confirm ? "new-confirm" : null;
          if (first) {
            e.preventDefault();
            document.getElementById(first)?.focus();
          }
        }}
        noValidate
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="token" value={token} />
        {(
          [
            ["new-password", "New password", "password", password, setPassword, errors.password],
            ["new-confirm", "New password again", "confirm", confirm, setConfirm, errors.confirm],
          ] as const
        ).map(([id, label, name, value, set, error]) => (
          <div key={id}>
            <label htmlFor={id} className="mb-1.5 block text-[14px] font-semibold">
              {label}
            </label>
            <input
              id={id}
              name={name}
              type="password"
              value={value}
              onChange={(e) => set(e.target.value)}
              autoComplete="new-password"
              aria-invalid={(tried && Boolean(error)) || undefined}
              aria-describedby={tried && error ? `${id}-error` : undefined}
              className={input(tried && Boolean(error))}
            />
            {tried && error && (
              <p id={`${id}-error`} className="m-0 mt-1.5 text-[13px] font-semibold text-[var(--coach-wrong-title)]">
                {error}
              </p>
            )}
          </div>
        ))}
        <div aria-live="polite">{state.error && <ErrorNote>{state.error}</ErrorNote>}</div>
        <button type="submit" disabled={pending} className={LIME}>
          {pending ? "Saving…" : "Save new password"}
        </button>
      </form>
    </ResetCard>
  );
}

/** /reset/expired, and a new-password link without a token. */
export function ResetExpired() {
  return (
    <ResetCard
      icon={Clock}
      title="This link has expired"
      lead={`Reset links work for ${RESET_LINK_TTL_MINUTES} minutes and only once, to keep your account safe. Ask for a new one.`}
    >
      <Link href={RESET_HREF} className={LIME}>
        Get a new link
      </Link>
      <p className="m-0 text-center text-[14px] text-[var(--coach-ink-muted)]">
        Or{" "}
        <Link href={SIGNIN_HREF} className={LINK}>
          sign in
        </Link>{" "}
        ·{" "}
        <Link href={SIGNUP_HREF} className={LINK}>
          create an account
        </Link>
      </p>
    </ResetCard>
  );
}
