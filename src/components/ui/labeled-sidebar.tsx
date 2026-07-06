"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Swords,
  Play,
  LineChart,
  Trophy,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import { useAuthUser } from "@/lib/auth/context";

const LEARN_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Swords },
  { href: "/playground", label: "Playground", icon: Play },
];

const YOU_ITEMS = [
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

function Row({
  href,
  label,
  icon: Icon,
  active,
  disabled,
}: {
  href?: string;
  label: string;
  icon: typeof LayoutDashboard;
  active?: boolean;
  disabled?: boolean;
}) {
  const inner = (
    <>
      <span
        className={`flex h-5 w-5 flex-none items-center justify-center ${active ? "text-brand-violet" : disabled ? "text-ink-fainter" : "text-ink-faint"}`}
      >
        <Icon size={17} strokeWidth={2.1} />
      </span>
      <span>{label}</span>
      {disabled && (
        <span className="ml-auto font-mono text-[9.5px] uppercase tracking-wide text-ink-fainter">
          Soon
        </span>
      )}
    </>
  );

  const className = `relative mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] ${
    active
      ? "bg-xp-bg font-bold text-[#5A32D6] before:absolute before:-left-4 before:top-1/2 before:h-[22px] before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-brand-gradient"
      : disabled
        ? "cursor-default font-medium text-ink-fainter"
        : "font-medium text-ink-secondary transition-colors hover:bg-[#F3F1FB]"
  }`;

  if (disabled || !href) {
    return <div className={className}>{inner}</div>;
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export function LabeledSidebar() {
  const pathname = usePathname();
  const user = useAuthUser();
  const displayName = user?.name || "Amine";
  const initial = displayName.charAt(0).toUpperCase();
  return (
    <aside className="hidden w-[260px] flex-none flex-col border-r border-divider bg-white md:flex">
      <div className="sticky top-0 flex h-screen flex-col p-4">
      <Link href="/" className="mb-[26px] flex items-center gap-2.5 px-2 pt-1">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-brand-gradient shadow-glow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 15 6-6 6 6" />
            <path d="m6 9 6-6 6 6" opacity=".55" />
          </svg>
        </div>
        <span className="font-display text-xl font-extrabold tracking-tight">Ascend</span>
      </Link>

      <div className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-fainter">
        Learn
      </div>
      {LEARN_ITEMS.map((item) => (
        <Row key={item.label} {...item} active={!!item.href && pathname?.startsWith(item.href)} />
      ))}

      <div className="h-[18px]" />
      <div className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-fainter">
        You
      </div>
      {YOU_ITEMS.map((item) => (
        <Row key={item.label} {...item} active={!!item.href && pathname?.startsWith(item.href)} />
      ))}

      <div className="mt-auto pt-[18px]">
        <Link
          href="/profile"
          className="relative block overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B1730] to-[#2C2548] p-[15px] text-white"
        >
          <div className="pointer-events-none absolute -right-6 -top-[34px] h-[120px] w-[120px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.55),transparent_68%)] blur-[6px]" />
          <div className="relative flex items-center gap-2.5">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-gradient font-display text-base font-extrabold">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-bold">{displayName}</div>
              <div className="font-mono text-[11px] text-[#B9B3D0]">Level 8</div>
            </div>
            <ChevronRight size={16} className="text-[#8F89AC]" />
          </div>
          <div className="relative mt-3">
            <div className="mb-1.5 flex justify-between font-mono text-[10.5px] text-[#B9B3D0]">
              <span>1,800 XP</span>
              <span>2,000</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.14]">
              <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A]" />
            </div>
          </div>
        </Link>
      </div>
      </div>
    </aside>
  );
}
