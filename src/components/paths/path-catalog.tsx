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
        "group flex min-w-0 flex-col gap-2 rounded-2xl border p-5 transition-colors",
        soon
          ? "border-divider bg-paper/60 opacity-70 hover:opacity-90 dark:bg-elevated/50"
          : "border-card-border bg-paper shadow-[0_1px_0_rgba(15,26,20,0.04)] hover:border-xp-border hover:bg-xp-bg/40 dark:bg-elevated dark:shadow-none",
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
          <span className="font-mono text-[10px] uppercase tracking-wide text-brand-violet">
            Live
          </span>
        )}
      </div>
      <h2
        className={cn(
          "font-display font-extrabold tracking-tight group-hover:text-xp-text",
          soon ? "text-lg text-ink-secondary sm:text-xl" : "text-xl text-ink sm:text-2xl",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "line-clamp-3 text-[13.5px] leading-relaxed",
          soon ? "text-ink-fainter" : "text-ink-secondary",
        )}
      >
        {body}
      </p>
      <span className="mt-auto pt-2 font-mono text-[11px] text-ink-fainter">{meta}</span>
    </Link>
  );
}

/** Full-width role row — whole row is the hit target. */
export function PathRoleRow({
  title,
  body,
  href,
  meta,
  soon = false,
}: {
  title: string;
  body: string;
  href: string;
  meta?: string;
  soon?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-4 border-b border-divider py-6 transition-colors last:border-b-0",
        "hover:bg-xp-bg/30 -mx-2 rounded-xl px-2 sm:-mx-3 sm:px-3",
        soon && "opacity-55 hover:opacity-80",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2
            className={cn(
              "font-display font-extrabold tracking-tight group-hover:text-xp-text",
              soon
                ? "text-xl text-ink-secondary sm:text-2xl"
                : "text-2xl text-ink sm:text-[28px]",
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
              Live
            </span>
          )}
        </div>
        <p
          className={cn(
            "mt-1.5 max-w-[54ch] text-[14px] leading-relaxed line-clamp-2",
            soon ? "text-ink-fainter" : "text-ink-secondary",
          )}
        >
          {body}
        </p>
        {meta ? (
          <p className="mt-1.5 font-mono text-[11px] text-ink-fainter">{meta}</p>
        ) : null}
      </div>
      <span
        className={cn(
          "flex h-9 w-9 flex-none items-center justify-center rounded-full border transition-colors",
          soon
            ? "border-divider text-ink-fainter"
            : "border-card-border text-ink-faint group-hover:border-xp-border group-hover:text-xp-text",
        )}
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
