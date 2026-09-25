import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { selectPathAction } from "@/lib/paths/actions";
import {
  Binary,
  Bot,
  Code2,
  Network,
  Server,
  Terminal,
  type LucideIcon,
} from "lucide-react";

const PATH_ICONS: Record<string, LucideIcon> = {
  foundations: Binary,
  "python-foundations": Code2,
  "systems-programmer": Terminal,
  "linux-engineer": Server,
  "network-engineer": Network,
  "ai-engineer": Bot,
};

/** Select (sets path cookie) or Continue (link to next lesson). */
function PathPrimaryButton({
  slug,
  engaged,
  continueHref,
  size = "sm",
}: {
  slug: string;
  engaged: boolean;
  continueHref: string;
  size?: "sm" | "md";
}) {
  if (engaged) {
    return (
      <Button href={continueHref} size={size}>
        Continue
      </Button>
    );
  }

  return (
    <form action={selectPathAction}>
      <input type="hidden" name="slug" value={slug} />
      <Button type="submit" size={size}>
        Select
      </Button>
    </form>
  );
}

/** Path mark in a circle; optional progress ring for live measurable paths. */
export function PathMarkRing({
  mark,
  slug,
  progress,
  gradientId,
  size = "md",
  className,
}: {
  mark: string;
  slug: string;
  /** 0–1 when live+measurable; null = no progress arc (soon / unknown). */
  progress: number | null;
  /** Unique SVG gradient id (required when multiple rings on one page). */
  gradientId: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const dim = size === "lg" ? 72 : 52;
  const stroke = size === "lg" ? 3.5 : 3;
  const r = (dim - stroke) / 2;
  const c = 2 * Math.PI * r;
  const showRing = progress != null;
  const pct = showRing ? Math.min(1, Math.max(0, progress)) : 0;
  const offset = c * (1 - pct);
  const Icon = PATH_ICONS[slug];
  const iconSize = size === "lg" ? 26 : 20;
  const label =
    showRing && pct > 0
      ? `${mark}, ${Math.round(pct * 100)}% complete`
      : mark;

  return (
    <div
      className={cn("relative flex-none", className)}
      style={{ width: dim, height: dim }}
      role="img"
      aria-label={label}
    >
      <svg
        width={dim}
        height={dim}
        viewBox={`0 0 ${dim} ${dim}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-violet)" />
            <stop offset="55%" stopColor="var(--brand-magenta)" />
            <stop offset="100%" stopColor="var(--brand-orange)" />
          </linearGradient>
        </defs>
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-divider"
        />
        {showRing ? (
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        ) : null}
      </svg>
      <div
        className={cn(
          "absolute flex items-center justify-center rounded-full border border-card-border bg-paper text-ink dark:bg-elevated",
          size === "lg" ? "inset-[7px]" : "inset-[5px]",
        )}
      >
        {Icon ? (
          <Icon size={iconSize} strokeWidth={1.9} aria-hidden className="text-ink" />
        ) : (
          <span
            className={cn(
              "font-display font-extrabold tracking-tight text-ink",
              size === "lg" ? "text-lg" : "text-[13px]",
            )}
          >
            {mark}
          </span>
        )}
      </div>
    </div>
  );
}

/** Full-width featured Foundations — Select/Continue + View. */
export function PathFeaturedStart({
  title,
  body,
  typeLabel,
  courseCountLabel,
  mark,
  slug,
  progress,
  gradientId,
  engaged,
  continueHref,
  viewHref,
}: {
  title: string;
  body: string;
  typeLabel: string;
  courseCountLabel: string;
  mark: string;
  slug: string;
  progress: number | null;
  gradientId: string;
  engaged: boolean;
  continueHref: string;
  viewHref: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-xp-border bg-paper dark:bg-elevated">
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-gradient opacity-[0.08] blur-3xl dark:opacity-[0.05]"
        aria-hidden
      />
      <div className="relative flex flex-col gap-6 p-6 sm:gap-8 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 max-w-[640px] gap-4 sm:gap-5">
          <PathMarkRing
            mark={mark}
            slug={slug}
            progress={progress}
            gradientId={gradientId}
            size="lg"
          />
          <div className="min-w-0">
            <h2 className="font-display text-[28px] font-extrabold tracking-[-0.03em] text-ink sm:text-[32px]">
              {title}
            </h2>
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-fainter">
              {typeLabel}
              <span className="mx-2 text-divider">·</span>
              {courseCountLabel}
            </p>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-secondary">
              {body}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-none flex-wrap items-center justify-end gap-3 lg:w-auto">
          <PathPrimaryButton
            slug={slug}
            engaged={engaged}
            continueHref={continueHref}
            size="md"
          />
          <Button href={viewHref} variant="secondary" size="md">
            View
          </Button>
        </div>
      </div>
    </section>
  );
}

/**
 * Grid path card — equal tile; mark left; actions bottom-right.
 */
export function PathActionCard({
  title,
  body,
  typeLabel,
  courseCountLabel,
  mark,
  slug,
  progress,
  gradientId,
  soon = false,
  engaged = false,
  continueHref,
  viewHref,
}: {
  title: string;
  body: string;
  typeLabel: string;
  courseCountLabel: string;
  mark: string;
  slug: string;
  progress: number | null;
  gradientId: string;
  soon?: boolean;
  engaged?: boolean;
  continueHref: string | null;
  viewHref: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full min-w-0 flex-col rounded-2xl border p-5 transition-colors",
        soon
          ? "border-divider bg-paper/70 opacity-80 dark:bg-elevated/50"
          : "border-card-border bg-paper hover:border-xp-border hover:bg-xp-bg/30 dark:bg-elevated dark:hover:bg-elevated",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <PathMarkRing
          mark={mark}
          slug={slug}
          progress={progress}
          gradientId={gradientId}
          size="md"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3
              className={cn(
                "font-display text-lg font-extrabold tracking-tight sm:text-xl",
                soon ? "text-ink-secondary" : "text-ink",
              )}
            >
              {title}
            </h3>
            {soon ? (
              <span className="rounded-md bg-xp-bg px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-xp-text">
                Soon
              </span>
            ) : null}
          </div>

          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-fainter">
            {typeLabel}
            <span className="mx-1.5 text-divider">·</span>
            {courseCountLabel}
          </p>
        </div>
      </div>

      <p
        className={cn(
          "mt-3 line-clamp-5 text-[13px] leading-relaxed",
          soon ? "text-ink-fainter" : "text-ink-secondary",
        )}
      >
        {body}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {continueHref ? (
          <PathPrimaryButton
            slug={slug}
            engaged={engaged}
            continueHref={continueHref}
            size="sm"
          />
        ) : null}
        <Button href={viewHref} variant="secondary" size="sm">
          View
        </Button>
      </div>
    </article>
  );
}
