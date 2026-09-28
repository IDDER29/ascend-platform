import Link from "next/link";
import type { ReactNode } from "react";
import type { CoachHomeModel } from "@/lib/practice/coach-home-model";

type Tone = "orange" | "lime" | "blue" | "neutral";

const TONE: Record<Tone, { tile: string; badge: string }> = {
  orange: {
    tile: "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]",
    badge: "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-strong)]",
  },
  lime: {
    tile: "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]",
    badge: "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]",
  },
  blue: {
    tile: "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]",
    badge: "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]",
  },
  neutral: {
    tile: "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink)]",
    badge: "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-secondary)]",
  },
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function ModeCard({
  href,
  tone,
  icon,
  badge,
  title,
  body,
}: {
  href: string;
  tone: Tone;
  icon: ReactNode;
  badge: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3.5 rounded-[18px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-[22px] text-[var(--coach-ink)] no-underline shadow-[0_4px_0_var(--coach-border)]"
    >
      <span className="flex items-start justify-between">
        <span
          className={`flex size-12 items-center justify-center rounded-[14px] ${TONE[tone].tile}`}
        >
          {icon}
        </span>
        <span
          className={`rounded-full px-[9px] py-[3px] text-xs font-semibold ${TONE[tone].badge}`}
        >
          {badge}
        </span>
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-sm leading-normal text-[var(--coach-ink-secondary)]">
          {body}
        </span>
      </span>
    </Link>
  );
}

export function ModeGrid({ modes }: { modes: CoachHomeModel["modes"] }) {
  return (
    <section aria-labelledby="modes" className="flex flex-col gap-4">
      <div className="flex w-full flex-wrap items-baseline justify-between gap-3">
        <h2 id="modes" className="m-0 font-display text-[26px] font-bold">
          Or pick a mode
        </h2>
        <span className="text-sm text-[var(--coach-ink-muted)]">
          Every mode counts toward your daily goal
        </span>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ModeCard
          href="/practicev2/session?scope=due"
          tone="orange"
          badge={modes.missesDue > 0 ? `${modes.missesDue} to fix` : "All clear"}
          title="Fix your misses"
          body="The cards you got wrong, while they're fresh."
          icon={
            <Icon>
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </Icon>
          }
        />
        <ModeCard
          href="/practicev2/session?scope=all&size=5"
          tone="lime"
          badge="5 cards"
          title="Quick 5"
          body="Five random cards from your bank, for a spare moment."
          icon={
            <Icon>
              <path d="M13 3L5 14h6l-1 7 8-11h-6z" />
            </Icon>
          }
        />
        <ModeCard
          href="/practicev2/session?scope=all"
          tone="blue"
          badge={`${modes.unlockedCount} cards`}
          title="Everything unlocked"
          body="Shuffle every card you've unlocked, due or not."
          icon={
            <Icon>
              <path d="M16 3h5v5" />
              <path d="M4 20L21 3" />
              <path d="M21 16v5h-5" />
              <path d="M15 15l6 6" />
              <path d="M4 4l5 5" />
            </Icon>
          }
        />
        <ModeCard
          href="/practicev2/custom"
          tone="neutral"
          badge="Your pick"
          title="Custom deck"
          body="Choose lessons and drill only those cards."
          icon={
            <Icon>
              <path d="M12 5v14M5 12h14" />
            </Icon>
          }
        />
      </div>
    </section>
  );
}
