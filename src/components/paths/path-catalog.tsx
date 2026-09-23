import Link from "next/link";
import { cn } from "@/lib/cn";

/** Compact foundation on-ramp tile (catalog "Start here"). */
export function PathFoundationTile({
  title,
  body,
  href,
  meta,
  soon = false,
}: {
  title: string;
  body: string;
  href: string;
  meta: string;
  soon?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex min-w-0 flex-col gap-2 rounded-2xl border border-card-border bg-paper p-5 transition-colors dark:bg-elevated",
        "hover:border-xp-border hover:bg-xp-bg/40",
        soon && "opacity-80",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-fainter">
          Foundations
        </span>
        {soon ? (
          <span className="rounded-md bg-xp-bg px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-xp-text">
            Soon
          </span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-fainter">
            Open
          </span>
        )}
      </div>
      <h2 className="font-display text-xl font-extrabold tracking-tight text-ink group-hover:text-xp-text sm:text-2xl">
        {title}
      </h2>
      <p className="line-clamp-3 text-[13.5px] leading-relaxed text-ink-secondary">{body}</p>
      <span className="mt-auto pt-2 font-mono text-[11px] text-ink-fainter">{meta}</span>
    </Link>
  );
}

/** Full-width role row — whole row is the hit target. */
export function PathRoleRow({
  title,
  body,
  href,
  requiresLabel,
  soon = false,
}: {
  title: string;
  body: string;
  href: string;
  requiresLabel?: string;
  soon?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-4 border-b border-divider py-6 transition-colors last:border-b-0",
        "hover:bg-xp-bg/30 -mx-2 rounded-xl px-2 sm:-mx-3 sm:px-3",
        soon && "opacity-75",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2
            className={cn(
              "font-display font-extrabold tracking-tight text-ink group-hover:text-xp-text",
              soon ? "text-xl sm:text-2xl" : "text-2xl sm:text-[28px]",
            )}
          >
            {title}
          </h2>
          {soon ? (
            <span className="font-mono text-[11px] uppercase tracking-wide text-ink-fainter">
              Coming soon
            </span>
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-wide text-brand-violet">
              Open
            </span>
          )}
        </div>
        <p className="mt-1.5 max-w-[54ch] text-[14px] leading-relaxed text-ink-secondary line-clamp-2">
          {body}
        </p>
        {requiresLabel ? (
          <p className="mt-1.5 font-mono text-[11px] text-ink-fainter">{requiresLabel}</p>
        ) : null}
      </div>
      <span
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-card-border text-ink-faint transition-colors group-hover:border-xp-border group-hover:text-xp-text"
        aria-hidden
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
