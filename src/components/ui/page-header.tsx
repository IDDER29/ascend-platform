import { cn } from "@/lib/cn";

export type PageHeaderProps = {
  /** e.g. "Learn / Curriculum" — accent the last segment with a slash split if needed */
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
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

/** Standard content width for hub pages inside AppShell. */
export const HUB_CONTENT_CLASS = "mx-auto w-full max-w-[1200px]";

/** Standard main padding for hub pages. */
export const HUB_MAIN_CLASS = "flex-1 px-5 py-8 sm:px-10";
