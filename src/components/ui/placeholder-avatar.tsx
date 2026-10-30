import { UserRound } from "lucide-react";
import { cn } from "@/lib/cn";

const SIZE = {
  sm: {
    box: "h-10 w-10 rounded-xl",
    icon: 18,
    text: "text-base",
  },
  md: {
    box: "h-14 w-14 rounded-2xl",
    icon: 22,
    text: "text-xl",
  },
  lg: {
    box: "h-[104px] w-[104px] rounded-[26px]",
    icon: 44,
    text: "text-[44px]",
  },
} as const;

/**
 * Placeholder profile avatar — quiet Coach surface (render inside `practice-coach-v2`), not a brand wash.
 * Shows initial when a name exists; otherwise a user icon.
 */
export function PlaceholderAvatar({
  name = null,
  size = "md",
  className,
}: {
  name?: string | null;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || null;
  const s = SIZE[size];

  return (
    <div
      className={cn(
        "flex flex-none items-center justify-center border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink-secondary)]",
        s.box,
        className,
      )}
      aria-hidden={initial ? undefined : true}
    >
      {initial ? (
        <span className={cn("font-display font-extrabold leading-none text-[var(--coach-ink)]", s.text)}>
          {initial}
        </span>
      ) : (
        <UserRound size={s.icon} strokeWidth={1.8} className="text-[var(--coach-ink-muted)]" />
      )}
    </div>
  );
}
