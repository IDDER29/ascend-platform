import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Shared input surface for Settings forms. */
export const settingsInputClass =
  "w-full rounded-[12px] border border-divider bg-paper px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-fainter focus:border-xp-border focus:ring-[3px] focus:ring-brand-violet/15 disabled:cursor-not-allowed disabled:bg-elevated/40 disabled:opacity-60";

export function SettingsField({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink-fainter"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="mt-1.5 text-[12.5px] leading-snug text-ink-fainter">{hint}</p>
      ) : null}
    </div>
  );
}

export function SettingsPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-divider bg-elevated/30 p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SettingsBlock({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      {title ? (
        <div>
          <h3 className="font-display text-[15px] font-extrabold text-ink">
            {title}
          </h3>
          {description ? (
            <p className="mt-0.5 text-[13px] leading-relaxed text-ink-fainter">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function SettingsSaveBar({
  error,
  saved,
  saving,
  disabled,
  label,
  onSave,
}: {
  error: string | null;
  saved: boolean;
  saving: boolean;
  disabled: boolean;
  label: string;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-divider pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-h-[20px] text-center text-[13px] sm:text-left">
        {error ? (
          <span className="font-semibold text-ink-secondary">{error}</span>
        ) : saved ? (
          <span className="font-semibold text-xp-text">Saved</span>
        ) : (
          <span className="text-ink-fainter">Changes save to your account.</span>
        )}
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={disabled || saving}
        className={cn(
          "inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 text-[13.5px] font-semibold text-white shadow-[0_6px_16px_rgba(13,159,110,0.18)] transition-all sm:w-auto",
          "hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(13,159,110,0.24)]",
          "disabled:pointer-events-none disabled:opacity-45",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        )}
      >
        {saving ? "Saving…" : label}
      </button>
    </div>
  );
}

export function SettingsToggle({
  on,
  onClick,
  disabled,
  labelledBy,
}: {
  on: boolean;
  onClick: () => void;
  disabled?: boolean;
  labelledBy?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={on}
      aria-labelledby={labelledBy}
      className={cn(
        "relative flex h-7 w-12 flex-none items-center rounded-full p-0.5 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/35 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        "disabled:cursor-not-allowed disabled:opacity-45",
        on ? "bg-brand-gradient justify-end" : "justify-start bg-elevated ring-1 ring-divider",
      )}
    >
      <span className="h-6 w-6 rounded-full bg-paper shadow-[0_1px_3px_rgba(15,26,20,0.16)] ring-1 ring-black/5" />
    </button>
  );
}
