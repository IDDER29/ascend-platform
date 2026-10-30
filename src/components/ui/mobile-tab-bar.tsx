"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, MoreHorizontal, X } from "lucide-react";
import { SIGNIN_HREF, SIGNUP_HREF } from "@/lib/routes";
import { useAuthUser } from "@/lib/auth/context";
import { signOutAction } from "@/lib/auth/actions";
import { MORE_ITEMS, TAB_ITEMS, isMoreActive, isNavActive, navAccessibleName } from "@/lib/nav/app-nav";
import { useDueCount } from "@/lib/nav/use-due-count";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { NAV_ICONS } from "@/components/ui/nav-icons";
import { PlaceholderAvatar } from "@/components/ui/placeholder-avatar";
import { isFocusRoute } from "@/components/ui/shell-footer";
import { DueBadge } from "@/components/ui/sidebar";
import { cn } from "@/lib/cn";

const TAB =
  "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11.5px] no-underline text-[var(--coach-ink-secondary)]";

/** The icon sits in a pill that turns ink when the tab is current. */
function TabIcon({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <span
      className={cn(
        "relative flex h-7 w-12 items-center justify-center rounded-full",
        active ? "bg-[var(--coach-ink)] text-[var(--coach-bg)]" : "text-[var(--coach-ink-secondary)]",
      )}
    >
      {children}
    </span>
  );
}

/** Phones: a bottom tab bar for the four daily places, and a "More" sheet for the rest. */
export function MobileTabBar() {
  const pathname = usePathname();
  const user = useAuthUser();
  const due = useDueCount(user?.id ?? null);
  const sheet = useRef<HTMLDialogElement>(null);

  if (isFocusRoute(pathname)) return null;

  const open = () => {
    sheet.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  const close = () => sheet.current?.close();
  const moreActive = isMoreActive(pathname);
  const signInHref = pathname ? `${SIGNIN_HREF}?next=${encodeURIComponent(pathname)}` : SIGNIN_HREF;
  const displayName = user?.name?.trim() || null;

  return (
    <div className="practice-coach-v2 md:hidden">
      {/* Keeps the end of every page clear of the bar. */}
      <div aria-hidden className="h-[calc(64px+env(safe-area-inset-bottom))]" />
      <nav
        aria-label="Main"
        className="app-tabbar fixed inset-x-0 bottom-0 z-30 border-t-2 border-[var(--coach-border)] bg-[var(--coach-bg)]/95 pb-[env(safe-area-inset-bottom)] font-sans backdrop-blur-md"
      >
        <ul className="m-0 flex list-none items-stretch p-0 px-1">
          {TAB_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.id];
            const active = isNavActive(pathname, item.href);
            const count = item.id === "practice" ? due : 0;
            return (
              <li key={item.id} className="flex min-w-0 flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={navAccessibleName(item.label, count)}
                  className={cn(TAB, active && "font-bold text-[var(--coach-ink)]")}
                >
                  <TabIcon active={active}>
                    <Icon size={19} strokeWidth={2.1} aria-hidden />
                    <DueBadge count={count} corner />
                  </TabIcon>
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="flex min-w-0 flex-1">
            <button
              type="button"
              onClick={open}
              aria-haspopup="dialog"
              className={cn(TAB, moreActive && "font-bold text-[var(--coach-ink)]")}
            >
              <TabIcon active={moreActive}>
                <MoreHorizontal size={20} strokeWidth={2.1} aria-hidden />
              </TabIcon>
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={sheet}
        aria-label="More"
        onClose={() => (document.documentElement.style.overflow = "")}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-t-[24px] border-2 border-b-0 border-[var(--coach-border)] bg-[var(--coach-bg)] p-0 font-sans text-[var(--coach-ink)] backdrop:bg-black/45"
      >
        <div className="flex flex-col gap-4 px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
          <div className="flex items-center justify-between">
            <h2 className="m-0 font-display text-[20px] font-extrabold tracking-[-0.02em]">More</h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="flex size-10 items-center justify-center rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]"
            >
              <X size={18} strokeWidth={2.2} aria-hidden />
            </button>
          </div>

          <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0">
            {MORE_ITEMS.map((item) => {
              const Icon = NAV_ICONS[item.id];
              const active = isNavActive(pathname, item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-14 items-center gap-3 rounded-2xl border-2 px-3.5 text-[15px] font-semibold no-underline",
                      active
                        ? "border-[var(--coach-ink)] bg-[var(--coach-ink)] text-[var(--coach-bg)]"
                        : "border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]",
                    )}
                  >
                    <Icon size={18} strokeWidth={2.1} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between border-t-2 border-[var(--coach-divider)] px-1 pt-4">
            <span className="text-[14px] text-[var(--coach-ink-muted)]">Appearance</span>
            <ThemeToggle />
          </div>

          {user ? (
            <div className="flex items-center gap-3 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-3">
              <PlaceholderAvatar
                name={displayName}
                size="sm"
                className="border-2 border-[color:var(--coach-border)] bg-[color:var(--coach-bg)]"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-bold">{displayName || "Learner"}</span>
                <span className="block truncate text-[13px] text-[var(--coach-ink-muted)]">@{user.username}</span>
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[var(--coach-border)] px-4 text-[14px] font-semibold text-[var(--coach-ink)]"
                >
                  <LogOut size={16} strokeWidth={2.1} aria-hidden />
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href={SIGNUP_HREF}
                onClick={close}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--coach-lime)] px-6 text-[15px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_3px_0_var(--coach-lime-shadow)]"
              >
                Create free account
              </Link>
              <Link
                href={signInHref}
                onClick={close}
                className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[var(--coach-border)] text-[15px] font-semibold text-[var(--coach-ink)] no-underline"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
