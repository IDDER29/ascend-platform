"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Swords,
  Play,
  LineChart,
  UserRound,
  Trophy,
  Bookmark,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuthUser } from "@/lib/auth/context";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "ascend:sidebar-collapsed";

const collapsedListeners = new Set<() => void>();

function subscribeCollapsed(onStoreChange: () => void) {
  collapsedListeners.add(onStoreChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    collapsedListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function notifyCollapsedChange() {
  collapsedListeners.forEach((listener) => listener());
}

function readCollapsed(): boolean {
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

const LEARN_ITEMS = [
  { href: "/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/dashboard", label: "Continue", icon: LayoutDashboard },
  { href: "/practice", label: "Practice", icon: Swords },
  { href: "/playground", label: "Playground", icon: Play },
];

const YOU_ITEMS = [
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/profile", label: "Profile", icon: UserRound },
];

const MORE_ITEMS = [
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/curriculum") {
    return pathname === "/curriculum" || pathname.startsWith("/curriculum/") || pathname.startsWith("/projects/shellforge");
  }
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Row({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
  muted,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active?: boolean;
  collapsed: boolean;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "relative mb-0.5 flex items-center gap-3 rounded-xl text-[14.5px] font-medium transition-colors",
        collapsed ? "h-11 w-11 justify-center" : "px-3 py-2.5",
        active
          ? "bg-xp-bg font-bold text-[#5A32D6]"
          : muted
            ? "text-ink-faint hover:bg-[#F3F1FB] hover:text-ink-secondary"
            : "text-ink-secondary hover:bg-[#F3F1FB]",
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

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed: boolean }) {
  if (collapsed) return <div className="h-2.5" />;
  return (
    <div className="mb-2 mt-1 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-fainter">
      {children}
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthUser();
  const signedIn = Boolean(user);
  const displayName = user?.name?.trim() || null;
  const initial = (displayName || "?").charAt(0).toUpperCase();

  // One preference for every AppShell page — no per-route auto-collapse.
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    readCollapsed,
    () => false,
  );

  function toggle() {
    const next = !collapsed;
    window.localStorage.setItem(STORAGE_KEY, String(next));
    notifyCollapsedChange();
  }

  const width = collapsed ? "w-[78px]" : "w-[260px]";
  const profileHref = signedIn ? "/profile" : "/signin";

  return (
    <>
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
          className="absolute -right-3 top-[22px] flex h-6 w-6 flex-none items-center justify-center rounded-full border border-divider bg-white text-ink-faint shadow-[0_2px_6px_rgba(28,18,64,.08)] transition-colors hover:text-ink-secondary"
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

        <SectionLabel collapsed={collapsed}>Learn</SectionLabel>
        {LEARN_ITEMS.map((item) => (
          <Row
            key={item.label}
            {...item}
            collapsed={collapsed}
            active={isNavActive(pathname, item.href)}
          />
        ))}

        <SectionLabel collapsed={collapsed}>You</SectionLabel>
        {YOU_ITEMS.map((item) => (
          <Row
            key={item.label}
            {...item}
            collapsed={collapsed}
            active={isNavActive(pathname, item.href)}
          />
        ))}

        <SectionLabel collapsed={collapsed}>More</SectionLabel>
        {MORE_ITEMS.map((item) => (
          <Row
            key={item.label}
            {...item}
            collapsed={collapsed}
            muted
            active={isNavActive(pathname, item.href)}
          />
        ))}

        <div className={cn("mt-auto", collapsed ? "" : "pt-[18px]")}>
          {collapsed ? (
            <Link
              href={profileHref}
              title={signedIn ? displayName || "Profile" : "Sign in"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient font-display font-extrabold text-white"
            >
              {signedIn ? initial : "?"}
            </Link>
          ) : signedIn ? (
            <Link
              href="/settings"
              className="relative block overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B1730] to-[#2C2548] p-[15px] text-white"
            >
              <div className="pointer-events-none absolute -right-6 -top-[34px] h-[120px] w-[120px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.55),transparent_68%)] blur-[6px]" />
              <div className="relative flex items-center gap-2.5">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-gradient font-display text-base font-extrabold">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-bold">{displayName}</div>
                  <div className="font-mono text-[11px] text-[#B9B3D0]">Settings</div>
                </div>
                <ChevronRight size={16} className="text-[#8F89AC]" />
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-card-border bg-[#FAF9FD] p-4">
              <div className="mb-1 text-[13.5px] font-bold text-ink">Learning as a guest</div>
              <p className="mb-3 text-[12.5px] leading-relaxed text-ink-secondary">
                Lessons are free to read. Sign in when you want progress saved.
              </p>
              <Link
                href="/signin"
                className="inline-flex w-full items-center justify-center rounded-xl bg-ink px-3 py-2.5 text-[13px] font-bold text-white"
              >
                Sign in to save
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
