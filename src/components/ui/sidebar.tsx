"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useSyncExternalStore } from "react";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SIGNIN_HREF, SIGNUP_HREF } from "@/lib/routes";
import { useAuthUser } from "@/lib/auth/context";
import { signOutAction } from "@/lib/auth/actions";
import { SIDEBAR_GROUPS, dueBadge, isNavActive, navAccessibleName, type AppNavItem } from "@/lib/nav/app-nav";
import { useDueCount } from "@/lib/nav/use-due-count";
import { BrandMark } from "@/components/site/site-ui";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { NAV_ICONS } from "@/components/ui/nav-icons";
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

/** Lime count pill; in the collapsed rail it sits on the icon's corner. */
export function DueBadge({ count, corner }: { count: number; corner?: boolean }) {
  const text = dueBadge(count);
  if (!text) return null;
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--coach-lime)] px-1.5 text-[11.5px] font-bold tabular-nums leading-none text-[var(--coach-lime-ink)]",
        corner && "absolute -right-1.5 -top-1.5 h-[18px] min-w-[18px] px-1 text-[10.5px] ring-2 ring-[var(--coach-bg)]",
      )}
    >
      {text}
    </span>
  );
}

function Row({
  item,
  active,
  collapsed,
  count,
}: {
  item: AppNavItem;
  active: boolean;
  collapsed: boolean;
  count: number;
}) {
  const Icon = NAV_ICONS[item.id];
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed || count > 0 ? navAccessibleName(item.label, count) : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-xl text-[14.5px] no-underline",
        collapsed ? "size-11 justify-center" : "min-h-10 px-3",
        active
          ? "bg-[var(--coach-ink)] font-semibold text-[var(--coach-bg)]"
          : "font-medium text-[var(--coach-ink-secondary)] hover:bg-[var(--coach-tint-neutral-bg)] hover:text-[var(--coach-ink)]",
      )}
    >
      <span className="relative flex size-5 flex-none items-center justify-center">
        <Icon size={18} strokeWidth={2.1} aria-hidden />
        {collapsed && <DueBadge count={count} corner />}
      </span>
      <span className="app-sidebar-label flex-1">{item.label}</span>
      {!collapsed && <DueBadge count={count} />}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthUser();
  const displayName = user?.name?.trim() || null;
  const due = useDueCount(user?.id ?? null);

  const collapsed = useSyncExternalStore(subscribeCollapsed, readCollapsed, () => false);

  // Client-only: defer width transitions until after hydration (avoids expand→collapse flash).
  const widthReady = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("sidebar-collapsed", readCollapsed());
  }, []);

  const width = collapsed ? "w-[78px]" : "w-[260px]";
  const signInHref = pathname ? `${SIGNIN_HREF}?next=${encodeURIComponent(pathname)}` : SIGNIN_HREF;

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
        aria-label="App"
        className={cn(
          "app-sidebar practice-coach-v2 fixed inset-y-0 left-0 z-20 hidden flex-col border-r-2 border-[var(--coach-border)] bg-[var(--coach-bg)] font-sans text-[var(--coach-ink)] md:flex",
          collapsed ? "items-center py-5" : "p-4",
          width,
          widthReady && "transition-[width] duration-150",
        )}
      >
        <button
          type="button"
          onClick={() => writeCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3.5 top-[22px] flex size-7 items-center justify-center rounded-full border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink-muted)] hover:text-[var(--coach-ink)]"
        >
          {collapsed ? <PanelLeftOpen size={14} strokeWidth={2.2} /> : <PanelLeftClose size={14} strokeWidth={2.2} />}
        </button>

        <Link
          href="/"
          aria-label="Ascend home"
          className={cn(
            "mb-6 flex items-center gap-2.5 rounded-lg text-[var(--coach-ink)] no-underline",
            collapsed ? "justify-center pt-1" : "px-2 pt-1",
          )}
        >
          <BrandMark size={34} />
          <span className="app-sidebar-brand-text font-display text-[20px] font-extrabold tracking-[-0.02em]">
            Ascend
          </span>
        </Link>

        {/* Scrolls on short screens; the collapse button stays outside so it isn't clipped. */}
        <div className={cn("-mx-1 flex min-h-0 flex-1 flex-col overflow-y-auto px-1 [scrollbar-width:thin]", collapsed && "items-center")}>
          <nav aria-label="Main" className={cn("flex flex-col", collapsed ? "items-center gap-4" : "gap-5")}>
            {SIDEBAR_GROUPS.map((group) => (
              <div key={group.label} className={cn("flex flex-col gap-0.5", collapsed && "items-center")}>
                <div className="app-sidebar-section mb-1 px-3 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">
                  {group.label}
                </div>
                {group.items.map((item) => (
                  <Row
                    key={item.id}
                    item={item}
                    collapsed={collapsed}
                    active={isNavActive(pathname, item.href)}
                    count={item.id === "practice" ? due : 0}
                  />
                ))}
              </div>
            ))}
          </nav>

          <div className={cn("mt-auto flex flex-col", collapsed ? "items-center gap-3" : "gap-3 pt-5")}>
            <ThemeToggle className={collapsed ? undefined : "self-start"} />
            {collapsed ? (
              <Link
                href={user ? "/profile" : signInHref}
                aria-label={user ? `${displayName || "Your"} profile` : "Sign in"}
                title={user ? displayName || "Profile" : "Sign in"}
                className="rounded-xl no-underline"
              >
                <PlaceholderAvatar
                  name={user ? displayName : null}
                  size="sm"
                  className="border-2 border-[color:var(--coach-border)] bg-[color:var(--coach-surface)]"
                />
              </Link>
            ) : user ? (
              <div className="app-sidebar-expanded-only flex items-center gap-2.5 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-2.5">
                <Link
                  href="/profile"
                  className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl text-[var(--coach-ink)] no-underline"
                >
                  <PlaceholderAvatar
                    name={displayName}
                    size="sm"
                    className="border-2 border-[color:var(--coach-border)] bg-[color:var(--coach-bg)]"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-bold">{displayName || "Learner"}</span>
                    <span className="block truncate text-[12.5px] text-[var(--coach-ink-muted)]">@{user.username}</span>
                  </span>
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    aria-label="Sign out"
                    title="Sign out"
                    className="flex size-9 items-center justify-center rounded-lg text-[var(--coach-ink-muted)] hover:bg-[var(--coach-tint-neutral-bg)] hover:text-[var(--coach-ink)]"
                  >
                    <LogOut size={17} strokeWidth={2.1} aria-hidden />
                  </button>
                </form>
              </div>
            ) : (
              <div className="app-sidebar-expanded-only rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-4">
                <p className="m-0 text-[14px] font-bold">Learning as a guest</p>
                <p className="m-0 mt-1 text-[13px] leading-relaxed text-[var(--coach-ink-secondary)]">
                  Lessons are free. An account keeps your progress on every device.
                </p>
                <Link
                  href={SIGNUP_HREF}
                  className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-[var(--coach-lime)] px-3 text-[13.5px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_2px_0_var(--coach-lime-shadow)]"
                >
                  Create free account
                </Link>
                <Link
                  href={signInHref}
                  className="mt-1.5 inline-flex min-h-9 w-full items-center justify-center text-[13px] font-semibold text-[var(--coach-ink)] underline underline-offset-2"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
