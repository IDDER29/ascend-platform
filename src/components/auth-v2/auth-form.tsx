"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { ErrorNote, Field, inputClass as input } from "@/components/forms/coach-fields";
import { signInAction, signUpAction, type AuthActionState } from "@/app/signin/actions";
import { MIN_PASSWORD_LENGTH as MIN_PASSWORD } from "@/lib/auth/reset-flow";
import { RESET_HREF, SIGNIN_HREF, SIGNUP_HREF } from "@/lib/routes";

export type AuthMode = "signin" | "signup";

const INITIAL: AuthActionState = { error: null };

const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export function modeFrom(raw: string | null): AuthMode {
  return raw === "signup" || raw === "register" || raw === "create" ? "signup" : "signin";
}

/** Sign in or create an account: one form, two modes, switched by the URL (?mode=signup). */
export function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = modeFrom(params.get("mode"));
  const next = params.get("next") ?? "";
  const signup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [keep, setKeep] = useState(true);
  const [tried, setTried] = useState(false);

  const [inState, inAction, inPending] = useActionState(signInAction, INITIAL);
  const [upState, upAction, upPending] = useActionState(signUpAction, INITIAL);
  const state = signup ? upState : inState;
  const pending = signup ? upPending : inPending;

  const errors = {
    name: signup && !name.trim() ? "Enter the name you want on your profile." : null,
    email: !isEmail(email) ? "Enter an email like you@example.com." : null,
    password:
      password.length === 0
        ? "Enter your password."
        : signup && password.length < MIN_PASSWORD
          ? `Use at least ${MIN_PASSWORD} characters.`
          : null,
    confirm: signup && confirm !== password ? "The two passwords don't match." : null,
  };
  const valid = Object.values(errors).every((e) => e === null);
  const shown = (key: keyof typeof errors) => (tried ? errors[key] : null);

  function switchTo(m: AuthMode) {
    setTried(false);
    const base = m === "signup" ? SIGNUP_HREF : SIGNIN_HREF;
    const withNext = next ? `${base}${base.includes("?") ? "&" : "?"}next=${encodeURIComponent(next)}` : base;
    router.replace(withNext, { scroll: false });
  }

  return (
    <div className="rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-8">
      <div
        role="group"
        aria-label="Sign in or create an account"
        className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-[var(--coach-well)] p-1"
      >
        {(["signin", "signup"] as AuthMode[]).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => mode !== m && switchTo(m)}
            className={`h-10 rounded-full text-[14.5px] font-semibold ${
              mode === m
                ? "bg-[var(--coach-segment-active)] text-[var(--coach-ink)] shadow-[var(--coach-segment-shadow)]"
                : "text-[var(--coach-ink-muted)] hover:text-[var(--coach-ink)]"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <h1 className="m-0 font-display text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em]">
        {signup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="m-0 mt-2 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
        {signup ? "Free. It only takes your name, email and a password." : "Sign in to pick up where you left off."}
      </p>

      <form
        action={signup ? upAction : inAction}
        onSubmit={(e) => {
          setTried(true);
          if (valid) return;
          e.preventDefault();
          // Take the learner to the first field that needs fixing.
          const first = (Object.keys(errors) as (keyof typeof errors)[]).find((k) => errors[k]);
          if (first) document.getElementById(`auth-${first}`)?.focus();
        }}
        noValidate
        className="mt-6 flex flex-col gap-4"
      >
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="keepSignedIn" value={keep ? "true" : "false"} />

        {signup && (
          <Field id="auth-name" label="Name" hint="Shown on your profile. A first name is fine." error={shown("name")}>
            <input
              id="auth-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              autoCapitalize="words"
              aria-invalid={shown("name") ? true : undefined}
              aria-describedby="auth-name-hint"
              className={input(Boolean(shown("name")))}
            />
          </Field>
        )}

        <Field id="auth-email" label="Email" error={shown("email")}>
          <input
            id="auth-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            placeholder="you@example.com"
            aria-invalid={shown("email") ? true : undefined}
            aria-describedby="auth-email-hint"
            className={input(Boolean(shown("email")))}
          />
        </Field>

        <Field
          id="auth-password"
          label="Password"
          hint={signup ? `At least ${MIN_PASSWORD} characters.` : undefined}
          error={shown("password")}
        >
          <div className="relative">
            <input
              id="auth-password"
              name="password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={signup ? "new-password" : "current-password"}
              spellCheck={false}
              aria-invalid={shown("password") ? true : undefined}
              aria-describedby="auth-password-hint"
              className={`${input(Boolean(shown("password")))} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--coach-ink-muted)] hover:text-[var(--coach-ink)]"
            >
              {show ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
            </button>
          </div>
        </Field>

        {signup && (
          <Field id="auth-confirm" label="Password again" error={shown("confirm")}>
            <input
              id="auth-confirm"
              name="confirm"
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              spellCheck={false}
              aria-invalid={shown("confirm") ? true : undefined}
              aria-describedby="auth-confirm-hint"
              className={input(Boolean(shown("confirm")))}
            />
          </Field>
        )}

        <div className="flex items-center justify-between gap-3">
          <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[14.5px] text-[var(--coach-ink-secondary)]">
            <input
              type="checkbox"
              checked={keep}
              onChange={(e) => setKeep(e.target.checked)}
              className="size-5 shrink-0 cursor-pointer accent-[var(--coach-ink)]"
            />
            Keep me signed in
          </label>
          {!signup && (
            <Link
              href={RESET_HREF}
              className="text-[14px] font-semibold text-[var(--coach-ink)] underline underline-offset-2"
            >
              Forgot password?
            </Link>
          )}
        </div>

        <div aria-live="polite">
          {state.error && (
            <ErrorNote>{state.error}</ErrorNote>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--coach-lime)] px-6 text-[16px] font-bold text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? (signup ? "Creating your account…" : "Signing in…") : signup ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="m-0 mt-5 text-center text-[13px] leading-relaxed text-[var(--coach-ink-muted)]">
        {signup ? "By creating an account you agree to the " : "By signing in you agree to the "}
        <Link href="/terms" className="font-semibold text-[var(--coach-ink-secondary)] underline underline-offset-2">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-semibold text-[var(--coach-ink-secondary)] underline underline-offset-2">
          Privacy
        </Link>
        .
      </p>
    </div>
  );
}
