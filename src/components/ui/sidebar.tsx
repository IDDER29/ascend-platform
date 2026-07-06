"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Swords, Play, LineChart, Trophy } from "lucide-react";
import { NavItem } from "./nav-item";

const ICON_NAV: { href: string; label: string; icon: typeof LayoutDashboard; disabled?: boolean }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Swords },
  { href: "/playground", label: "Playground", icon: Play },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/achievements", label: "Achievements", icon: Trophy },
];

export function IconSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* layout spacer: reserves the row width the fixed aside occupies */}
      <div className="hidden w-[78px] flex-none md:block" aria-hidden="true" />
      <aside className="fixed inset-y-0 left-0 z-20 hidden h-screen w-[78px] flex-col items-center gap-1.5 border-r border-divider bg-white py-5 md:flex">
      <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 15 6-6 6 6" />
          <path d="m6 9 6-6 6 6" opacity=".55" />
        </svg>
      </div>
      {ICON_NAV.map((item) => (
        <NavItem
          key={item.label}
          href={item.href}
          label={item.label}
          active={!!item.href && pathname?.startsWith(item.href)}
          disabled={item.disabled}
          variant="icon"
          icon={<item.icon size={18} strokeWidth={2.1} />}
        />
      ))}
      <div className="mt-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient font-display font-extrabold text-white">
        A
      </div>
      </aside>
    </>
  );
}
