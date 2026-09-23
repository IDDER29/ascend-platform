"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState, useSyncExternalStore } from "react";
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
import { SIGNIN_HREF, SIGNUP_HREF } from "@/lib/routes";
import { useAuthUser } from "@/lib/auth/context";
import { ThemeToggle } from "@/components/homepage/theme-toggle";
import { PlaceholderAvatar } from "@/components/ui/placeholder-avatar";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "ascend:sidebar-collapsed";

const collapsedListeners = new Set<() => void>();

/** Survives remounts; avoids expand→collapse flash on refresh. */
let memoryCollapsed: boolean | null = null;

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
  if (memoryCollapsed !== null) return memoryCollapsed;
  try {
    memoryCollapsed = window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    memoryCollapsed = false;
  }
  return memoryCollapsed;
}

function writeCollapsed(next: boolean) {
  memoryCollapsed = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    // ignore
  }
  try {
    document.documentElement.classList.toggle("sidebar-collapsed", next);
  } catch {
    // ignore
  }
  notifyCollapsedChange();
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
          ? "bg-xp-bg font-bold text-xp-text"
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
      <span className="app-sidebar-label">{label}</span>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-sidebar-section mb-2 mt-1 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-fainter">
      {children}
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthUser();
  const signedIn = Boolean(user);
  const displayName = user?.name?.trim() || null;

  const forceCollapsedByRoute = Boolean(pathname?.startsWith("/curriculum2"));

  const storedCollapsed = useSyncExternalStore(
    subscribeCollapsed,
    readCollapsed,
    () => false,
  );

  const [widthReady, setWidthReady] = useState(false);
  useLayoutEffect(() => {
    const stored = readCollapsed();
    document.documentElement.classList.toggle(
      "sidebar-collapsed",
      stored || forceCollapsedByRoute,
    );
    setWidthReady(true);
  }, [forceCollapsedByRoute]);

  const collapsed = forceCollapsedByRoute || storedCollapsed;

  function toggle() {
    if (forceCollapsedByRoute) return;
    writeCollapsed(!storedCollapsed);
  }

  const width = collapsed ? "w-[78px]" : "w-[260px]";
  const profileHref = signedIn ? "/profile" : SIGNIN_HREF;

  return (
    <>
      <div
        className={cn(
          "app-sidebar-spacer hidden flex-none md:block",
          width,
          widthReady && "transition-[width] duration-150",
        )}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "app-sidebar fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-divider bg-bg md:flex",
          collapsed ? "items-center py-5" : "p-4",
          width,
          widthReady && "transition-[width] duration-150",
        )}
      >
        <button
          type="button"
          onClick={toggle}
          disabled={forceCollapsedByRoute}
          title={
            forceCollapsedByRoute
              ? "Sidebar stays collapsed on the map view"
              : collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
          }
          className={cn(
            "absolute -right-3 top-[22px] flex h-6 w-6 flex-none items-center justify-center rounded-full border border-divider bg-elevated text-ink-faint shadow-[0_2px_6px_rgba(28,18,64,.08)] transition-colors hover:text-ink-secondary",
            forceCollapsedByRoute && "cursor-not-allowed opacity-50",
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
          <span className="app-sidebar-brand-text font-display text-[19px] font-extrabold tracking-tight text-ink">
            Ascend
          </span>
        </Link>

        <SectionLabel>Learn</SectionLabel>
        {LEARN_ITEMS.map((item) => (
          <Row
            key={item.label}
            {...item}
            collapsed={collapsed}
            active={isNavActive(pathname, item.href)}
          />
        ))}
        <SectionLabel>You</SectionLabel>
        {YOU_ITEMS.map((item) => (
          <Row
            key={item.label}
            {...item}
            collapsed={collapsed}
            active={isNavActive(pathname, item.href)}
          />
        ))}
        <SectionLabel>More</SectionLabel>
        {MORE_ITEMS.map((item) => (
          <Row
            key={item.label}
            {...item}
            collapsed={collapsed}
            muted
            active={isNavActive(pathname, item.href)}
          />
        ))}

        <div className={cn("mt-auto flex flex-col", collapsed ? "items-center gap-2" : "gap-3 pt-[18px]")}>
          <ThemeToggle
            className={cn(collapsed ? "shrink-0" : "self-start")}
          />
          {collapsed ? (
            <Link
              href={profileHref}
              title={signedIn ? displayName || "Profile" : "Sign in"}
              className="rounded-full"
            >
              <PlaceholderAvatar
                name={signedIn ? displayName : null}
                size="sm"
                className="h-10 w-10 rounded-full"
              />
            </Link>
          ) : signedIn ? (
            <Link
              href="/settings"
              className="app-sidebar-expanded-only relative block overflow-hidden rounded-2xl border border-card-border bg-elevated p-[15px] text-ink"
            >
              <div className="relative flex items-center gap-2.5">
                <PlaceholderAvatar name={displayName} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-bold">{displayName || "Learner"}</div>
                  <div className="font-mono text-[11px] text-ink-faint">Settings</div>
                </div>
                <ChevronRight size={16} className="text-ink-fainter" />
              </div>
            </Link>
          ) : (
            <div className="app-sidebar-expanded-only rounded-2xl border border-card-border bg-paper p-4 dark:bg-elevated">
              <div className="mb-1 text-[13.5px] font-bold text-ink">Learning as a guest</div>
              <p className="mb-3 text-[12.5px] leading-relaxed text-ink-secondary">
                Lessons are free to read. Sign in when you want progress saved.
              </p>
              <Link
                href={SIGNIN_HREF}
                className="inline-flex w-full items-center justify-center rounded-xl bg-ink px-3 py-2.5 text-[13px] font-bold text-bg"
              >
                Sign in to save
              </Link>
              <Link
                href={SIGNUP_HREF}
                className="mt-2 inline-flex w-full items-center justify-center text-[12.5px] font-semibold text-brand-violet hover:underline"
              >
                New here? Create account
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
