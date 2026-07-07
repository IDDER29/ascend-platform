"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Swords,
  Play,
  LineChart,
  Trophy,
  Bookmark,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuthUser } from "@/lib/auth/context";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "ascend:sidebar-collapsed";

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
  collapsed,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active?: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "relative mb-0.5 flex items-center gap-3 rounded-xl text-[14.5px] font-medium text-ink-secondary transition-colors",
        collapsed ? "h-11 w-11 justify-center" : "px-3 py-2.5",
        active
          ? "bg-xp-bg font-bold text-[#5A32D6]"
          : "hover:bg-[#F3F1FB]",
      )}
    >
      {active && (
        <span
          className={cn(
            "absolute rounded-full bg-brand-gradient",
            collapsed
              ? "-left-[15px] top-1/2 h-[22px] w-[3px] -translate-y-1/2"
              : "-left-4 top-1/2 h-[22px] w-[3px] -translate-y-1/2",
          )}
        />
      )}
      <span
        className={cn(
          "flex h-5 w-5 flex-none items-center justify-center",
          active ? "text-brand-violet" : "text-ink-faint",
        )}
      >
        <Icon size={collapsed ? 18 : 17} strokeWidth={2.1} />
      </span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

export function AppSidebar({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const pathname = usePathname();
  const user = useAuthUser();
  const displayName = user?.name || "Amine";
  const initial = displayName.charAt(0).toUpperCase();

  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  const width = collapsed ? "w-[78px]" : "w-[260px]";

  return (
    <>
      {/* layout spacer: reserves the row width the fixed aside occupies */}
      <div className={cn("hidden flex-none md:block", width)} aria-hidden="true" />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-divider bg-white transition-[width] duration-150 md:flex",
          collapsed ? "items-center py-5" : "p-4",
          width,
        )}
      >
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "absolute top-[22px] flex h-6 w-6 flex-none items-center justify-center rounded-full border border-divider bg-white text-ink-faint shadow-[0_2px_6px_rgba(28,18,64,.08)] transition-colors hover:text-ink-secondary",
            collapsed ? "-right-3" : "-right-3",
          )}
        >
          {collapsed ? <PanelLeftOpen size={13} strokeWidth={2.2} /> : <PanelLeftClose size={13} strokeWidth={2.2} />}
        </button>

        <Link
          href="/"
          className={cn(
            "mb-[26px] flex items-center gap-2.5",
            collapsed ? "justify-center px-0 pt-1" : "px-2 pt-1",
          )}
        >
          <div className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[11px] bg-brand-gradient shadow-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 15 6-6 6 6" />
              <path d="m6 9 6-6 6 6" opacity=".55" />
            </svg>
          </div>
          {!collapsed && (
            <span className="font-display text-xl font-extrabold tracking-tight">Ascend</span>
          )}
        </Link>

        {!collapsed && (
          <div className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-fainter">
            Learn
          </div>
        )}
        {LEARN_ITEMS.map((item) => (
          <Row
            key={item.label}
            {...item}
            collapsed={collapsed}
            active={pathname?.startsWith(item.href)}
          />
        ))}

        <div className={collapsed ? "h-2.5" : "h-[18px]"} />
        {!collapsed && (
          <div className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-fainter">
            You
          </div>
        )}
        {YOU_ITEMS.map((item) => (
          <Row
            key={item.label}
            {...item}
            collapsed={collapsed}
            active={pathname?.startsWith(item.href)}
          />
        ))}

        <div className={cn("mt-auto", collapsed ? "" : "pt-[18px]")}>
          {collapsed ? (
            <Link
              href="/profile"
              title={`${displayName} — Level 8`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient font-display font-extrabold text-white"
            >
              {initial}
            </Link>
          ) : (
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
          )}
        </div>
      </aside>
    </>
  );
}
