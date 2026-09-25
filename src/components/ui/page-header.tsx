import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PageHeaderProps = {
  /** Optional quiet label above the title (avoid fake Learn/You slash trails on hubs). */
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/**
 * Shared hub page header for AppShell learner pages.
 */
export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  const eyebrowNodes = eyebrow?.includes(" / ")
    ? (() => {
        const [prefix, ...rest] = eyebrow.split(" / ");
        const accent = rest.join(" / ");
        return (
          <>
            {prefix} / <span className="text-brand-violet">{accent}</span>
          </>
        );
      })()
    : eyebrow;

  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-5", className)}>
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <div className="mb-2 font-mono text-xs text-ink-fainter">{eyebrowNodes}</div>
        ) : null}
        <h1 className="font-display text-[28px] font-extrabold leading-tight tracking-[-0.032em] sm:text-[32px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-[560px] text-[15px] leading-relaxed text-ink-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-none flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

/** Standard content width for AppShell learner hubs (Continue / Practice / Paths / …). */
export const HUB_CONTENT_CLASS = "mx-auto w-full max-w-[960px]";

/**
 * Alias of `HUB_CONTENT_CLASS` — kept for existing imports (e.g. dashboard).
 * Prefer `HUB_CONTENT_CLASS` on new pages.
 */
export const HUB_NARROW_CLASS = HUB_CONTENT_CLASS;

/** Standard main for hub pages — paper stage vs sidebar `bg-bg`. */
export const HUB_MAIN_CLASS = "flex-1 bg-paper px-5 py-8 sm:px-10";
