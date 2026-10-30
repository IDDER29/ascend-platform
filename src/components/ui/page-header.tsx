import type { ReactNode } from "react";

/** Standard content width for AppShell learner hubs (Today / Practice / Paths / …). */
export const HUB_CONTENT_CLASS = "mx-auto w-full max-w-[960px]";

/**
 * The title block every learner hub opens with: one size, one lead, an optional aside on the right
 * (Today puts the date there; no other page shows one).
 */
export function PageHeader({ title, lead, aside }: { title: ReactNode; lead?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="m-0 font-display text-[30px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[36px]">
          {title}
        </h1>
        {lead && (
          <p className="m-0 max-w-[640px] text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
            {lead}
          </p>
        )}
      </div>
      {aside && <div className="text-[13.5px] text-[var(--coach-ink-muted)]">{aside}</div>}
    </header>
  );
}
