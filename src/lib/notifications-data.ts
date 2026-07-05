import { BADGES } from "./achievements-data";

export interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  glyph: string;
  iconBg: string;
  iconFg: string;
  when: string;
}

const recentBadges = BADGES.filter((b) => b.status === "earned").slice(-2).reverse();

export const NOTIFICATIONS: NotificationItem[] = [
  ...recentBadges.map((b, i) => ({
    id: `badge-${b.id}`,
    title: `Badge unlocked: ${b.label}`,
    subtitle: b.description,
    href: "/achievements",
    glyph: b.glyph,
    iconBg: "bg-[#FEF4E1]",
    iconFg: "text-[#E0900A]",
    when: i === 0 ? "Today" : "2 days ago",
  })),
  {
    id: "streak",
    title: "12-day streak — keep it going",
    subtitle: "Study today to protect your streak.",
    href: "/practice",
    glyph: "🔥",
    iconBg: "bg-[#FFF1EC]",
    iconFg: "text-[#F0562F]",
    when: "Today",
  },
  {
    id: "curriculum-nudge",
    title: "2 concepts left in The C Language",
    subtitle: "You're close to finishing Level 02.",
    href: "/curriculum",
    glyph: "📘",
    iconBg: "bg-[#F1EDFE]",
    iconFg: "text-[#6D46F2]",
    when: "3 days ago",
  },
];
