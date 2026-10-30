"use client";

import { useActionState, useEffect, useState } from "react";
import { ErrorNote, Field, inputClass, LIME_BUTTON, OUTLINE_BUTTON } from "@/components/forms/coach-fields";
import {
  changePasswordAction,
  deleteAccountAction,
  resetProgressAction,
  type AccountActionState,
} from "@/lib/auth/account-actions";
import { signOutAction } from "@/lib/auth/actions";
import { clearBrowser, DELETING_KEY } from "@/lib/auth/clear-browser";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/reset-flow";
import { SettingsCard } from "./settings-card";

const INITIAL: AccountActionState = { error: null };
const DANGER_BUTTON =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--coach-wrong-title)] px-6 text-[15px] font-bold text-[var(--coach-on-wrong)] disabled:cursor-not-allowed disabled:opacity-50";

function ChangePassword() {
  const [state, action, pending] = useActionState(changePasswordAction, INITIAL);
  const [form, setForm] = useState({ current: "", password: "", confirm: "" });
  const [tried, setTried] = useState(false);
  const errors = {
    current: !form.current ? "Enter your current password." : null,
    password: form.password.length < MIN_PASSWORD_LENGTH ? `Use at least ${MIN_PASSWORD_LENGTH} characters.` : null,
    confirm: form.confirm !== form.password ? "The two new passwords don't match." : null,
  };
  // Empty the fields once the change went through.
  useEffect(() => {
    if (state.ok) queueMicrotask(() => (setForm({ current: "", password: "", confirm: "" }), setTried(false)));
  }, [state]);

  const fields = [
    { id: "current", label: "Current password", autoComplete: "current-password" },
    { id: "password", label: "New password", autoComplete: "new-password" },
    { id: "confirm", label: "New password again", autoComplete: "new-password" },
  ] as const;

  return (
    <form
      action={action}
      onSubmit={(e) => {
        setTried(true);
        const first = fields.find((f) => errors[f.id]);
        if (first) {
          e.preventDefault();
          document.getElementById(`pw-${first.id}`)?.focus();
        }
      }}
      noValidate
      className="flex flex-col gap-4"
    >
      {fields.map((f) => {
        const error = tried ? errors[f.id] : null;
        return (
          <Field key={f.id} id={`pw-${f.id}`} label={f.label} error={error}>
            <input
              id={`pw-${f.id}`}
              name={f.id}
              type="password"
              value={form[f.id]}
              onChange={(e) => setForm((v) => ({ ...v, [f.id]: e.target.value }))}
              autoComplete={f.autoComplete}
              aria-invalid={Boolean(error) || undefined}
              aria-describedby={`pw-${f.id}-hint`}
              className={inputClass(Boolean(error))}
            />
          </Field>
        );
      })}
      <div aria-live="polite">
        {state.error && <ErrorNote>{state.error}</ErrorNote>}
        {state.ok && !tried && (
          <p className="m-0 text-[14.5px] font-semibold text-[var(--coach-success)]">
            Password changed. Use it next time you sign in.
          </p>
        )}
      </div>
      <button type="submit" disabled={pending} className={`${LIME_BUTTON} self-start`}>
        {pending ? "Changing…" : "Change password"}
      </button>
    </form>
  );
}

/** A destructive action behind a button, then a typed confirmation (and the password, for deletion). */
function Dangerous({ userId, username, kind }: { userId: string; username: string; kind: "reset" | "delete" }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [state, action, pending] = useActionState(
    kind === "reset" ? resetProgressAction : deleteAccountAction,
    INITIAL,
  );
  const reset = kind === "reset";
  const ready = typed.trim().toLowerCase() === username.toLowerCase();

  useEffect(() => {
    if (state.ok && reset) {
      clearBrowser(userId, "progress");
      queueMicrotask(() => (setOpen(false), setTyped("")));
    }
    // A deletion that failed leaves this browser's data alone.
    if (state.error && !reset) {
      try {
        window.sessionStorage.removeItem(DELETING_KEY);
      } catch {}
    }
  }, [state, reset, userId]);

  const title = reset ? "Reset progress" : "Delete account";
  const body = reset
    ? "Clears finished lessons, Practice cards and history, streak, badges and project links. Your account, profile and settings stay."
    : "Deletes your account and everything in it: progress, profile, links and settings. This can't be undone.";

  return (
    <div className="flex flex-col gap-3 border-t-2 border-[var(--coach-divider)] pt-5 first:border-0 first:pt-0">
      <div>
        <h3 className="m-0 text-[16px] font-bold">{title}</h3>
        <p className="m-0 mt-1 text-[14.5px] leading-relaxed text-[var(--coach-ink-secondary)]">{body}</p>
      </div>
      {state.ok && reset && !open && (
        <p aria-live="polite" className="m-0 text-[14.5px] font-semibold text-[var(--coach-success)]">
          Your progress was reset.
        </p>
      )}
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className={`${OUTLINE_BUTTON} self-start`}>
          {title}…
        </button>
      ) : (
        <form
          action={action}
          onSubmit={() => {
            if (reset) return;
            try {
              window.sessionStorage.setItem(DELETING_KEY, userId);
            } catch {}
          }}
          className="flex flex-col gap-4 rounded-2xl bg-[var(--coach-wrong-soft)] p-4"
        >
          <Field id={`${kind}-confirm`} label={`Type your username, ${username}, to confirm`} error={null}>
            <input
              id={`${kind}-confirm`}
              name="confirm"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
              className={inputClass()}
            />
          </Field>
          {!reset && (
            <Field id="delete-password" label="Your password" error={null}>
              <input
                id="delete-password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={inputClass()}
              />
            </Field>
          )}
          <div aria-live="polite">{state.error && <ErrorNote>{state.error}</ErrorNote>}</div>
          <div className="flex flex-wrap gap-2.5">
            <button type="submit" disabled={!ready || pending} className={DANGER_BUTTON}>
              {pending ? "Working…" : reset ? "Reset my progress" : "Delete my account"}
            </button>
            <button type="button" onClick={() => (setOpen(false), setTyped(""))} className={OUTLINE_BUTTON}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function AccountPanel({ userId, email, username }: { userId: string; email: string; username: string }) {
  return (
    <>
      <SettingsCard title="Signed in as" description={email}>
        <form action={signOutAction}>
          <button type="submit" className={OUTLINE_BUTTON}>
            Sign out
          </button>
        </form>
      </SettingsCard>
      <SettingsCard title="Change password" description={`At least ${MIN_PASSWORD_LENGTH} characters.`}>
        <ChangePassword />
      </SettingsCard>
      <SettingsCard title="Danger zone" danger>
        <div className="flex flex-col gap-5">
          <Dangerous userId={userId} username={username} kind="reset" />
          <Dangerous userId={userId} username={username} kind="delete" />
        </div>
      </SettingsCard>
    </>
  );
}
