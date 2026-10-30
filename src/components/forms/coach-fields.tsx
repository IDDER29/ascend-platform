import { AlertCircle, Check } from "lucide-react";

/** Form pieces in the Coach look, shared by sign-in, reset, onboarding and Settings. */

export const LABEL = "mb-1.5 block text-[14px] font-semibold text-[var(--coach-ink)]";
export const HINT = "m-0 mt-1.5 text-[13px] leading-snug text-[var(--coach-ink-muted)]";
export const FIELD_ERROR = "m-0 mt-1.5 text-[13px] font-semibold leading-snug text-[var(--coach-wrong-title)]";

export const LIME_BUTTON =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--coach-lime)] px-6 text-[16px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_3px_0_var(--coach-lime-shadow)] disabled:cursor-wait disabled:opacity-70";
export const OUTLINE_BUTTON =
  "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[var(--coach-border)] px-6 text-[15px] font-semibold text-[var(--coach-ink)] no-underline hover:border-[var(--coach-border-strong)] disabled:cursor-not-allowed disabled:opacity-60";

/** A text input; red-bordered once it's known to be wrong. */
export const inputClass = (invalid = false) =>
  `block h-12 w-full rounded-xl border-2 bg-[var(--coach-surface)] px-4 text-[16px] text-[var(--coach-ink)] placeholder:text-[var(--coach-ink-muted)] focus:border-[var(--coach-ink)] focus:outline-none disabled:opacity-60 ${
    invalid ? "border-[var(--coach-wrong-border)]" : "border-[var(--coach-border)]"
  }`;

/** One field: its label, the input, then a hint or what's wrong (described by `${id}-hint`). */
export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-hint`} className={FIELD_ERROR}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className={HINT}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** What went wrong with the whole form (usually from the server). */
export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 flex items-start gap-2.5 rounded-xl border-2 border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-bg)] px-4 py-3 text-[14.5px] font-semibold text-[var(--coach-wrong-ink)]">
      <AlertCircle size={18} strokeWidth={2.4} className="mt-0.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

/** A choice drawn as a card around a real radio button, so keyboards and screen readers get a radio group. */
export function Choice({
  name,
  value,
  checked,
  onChange,
  disabled = false,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`relative flex gap-4 rounded-[20px] border-2 bg-[var(--coach-surface)] p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--coach-focus)] sm:p-5 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${
        checked ? "border-[var(--coach-ink)]" : "border-[var(--coach-border)] hover:border-[var(--coach-border-strong)]"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
      {children}
      <span
        aria-hidden
        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
          checked
            ? "border-[var(--coach-ink)] bg-[var(--coach-ink)] text-[var(--coach-bg)]"
            : "border-[var(--coach-border-strong)]"
        }`}
      >
        {checked && <Check size={14} strokeWidth={3.2} />}
      </span>
    </label>
  );
}
