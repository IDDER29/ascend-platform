/**
 * Shared auth form primitives — Phosphor tokens only.
 * Used by sign-in and reset flows.
 */

import { cn } from "@/lib/cn";

export const authLabelClass =
  "mb-1.5 block text-[12.5px] font-bold text-ink-secondary";

export const authInputClass =
  "w-full rounded-xl border border-card-border bg-elevated px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-fainter focus:border-brand-violet/50 focus:ring-[3px] focus:ring-brand-violet/15 dark:bg-paper";

export const authInputErrorClass = "border-red-500/70 focus:border-red-500/70 focus:ring-red-500/15";

export const authFieldErrorClass = "mt-1.5 text-xs text-red-600 dark:text-red-400";

export const authHintClass = "mt-1.5 text-[12px] leading-snug text-ink-faint text-pretty";

export const authErrorBannerClass =
  "mb-4 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-3.5 py-2.5 text-[13px] font-semibold text-red-700 dark:text-red-300";

export const authTitleClass =
  "mb-2 font-display text-[clamp(1.4rem,4vw,1.7rem)] font-extrabold tracking-[-0.03em] text-ink";

export const authLeadClass = "mb-6 text-[15px] leading-relaxed text-ink-secondary text-pretty";

export const authIconBadgeClass =
  "mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-xp-bg text-xp-text";

export const authIconBadgeSuccessClass =
  "mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-xp-bg text-xp-text";

export const authDividerClass = "h-px flex-1 bg-card-border";

export const authMutedLinkClass =
  "flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-ink-muted transition-colors hover:text-ink";

export const authWarnBannerClass =
  "mb-5 flex items-start gap-2.5 rounded-xl border border-streak-border bg-streak-bg px-3.5 py-3 text-[13px] leading-relaxed text-streak-text text-pretty";

export const authInfoBannerClass =
  "mt-6 flex items-start gap-2.5 border-t border-card-border pt-5 text-[12.5px] leading-relaxed text-ink-muted text-pretty";

export function authInputCn(invalid?: boolean, className?: string) {
  return cn(authInputClass, invalid && authInputErrorClass, className);
}
