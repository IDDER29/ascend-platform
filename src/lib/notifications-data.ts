export interface NotificationItem {
  id: string;
  section: "Today" | "Earlier";
  body: string;
  boldParts: string[];
  cta?: { label: string; href: string };
  when: string;
  glyph: string;
  iconBg: string;
  iconFg: string;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "streak",
    section: "Today",
    body: "Your 12-day streak is alive! Do one concept today to keep it going.",
    boldParts: ["12-day streak"],
    cta: { label: "Resume lesson", href: "/curriculum/level-02-the-c-language/what-a-pointer-really-is" },
    when: "2h ago",
    glyph: "🔥",
    iconBg: "bg-[#FFF1EC]",
    iconFg: "text-[#FF6B4A]",
  },
  {
    id: "badge",
    section: "Today",
    body: "Badge earned: Memory Master — you mastered pointers & the heap.",
    boldParts: ["Memory Master"],
    cta: { label: "View badge", href: "/achievements" },
    when: "5h ago",
    glyph: "◆",
    iconBg: "bg-[#FEF4E1]",
    iconFg: "text-[#E0900A]",
  },
  {
    id: "quiz",
    section: "Today",
    body: "Nice — you scored 100% on the Pointers drill. +90 XP.",
    boldParts: ["100%"],
    when: "6h ago",
    glyph: "✓",
    iconBg: "bg-[#E7F8F0]",
    iconFg: "text-[#12A472]",
  },
  {
    id: "level-unlocked",
    section: "Earlier",
    body: "New level unlocked: Systems & Software — processes, syscalls, and eventually Shellforge.",
    boldParts: ["Systems & Software"],
    cta: { label: "Start Level 03", href: "/curriculum/level-03-systems-software/processes-and-the-process-table" },
    when: "Yesterday",
    glyph: "🔓",
    iconBg: "bg-[#F1EDFE]",
    iconFg: "text-[#6D46F2]",
  },
  {
    id: "peer-solution",
    section: "Earlier",
    body: "marc published a notable solution to Shellforge — see a new approach.",
    boldParts: ["marc", "Shellforge"],
    cta: { label: "Read solution", href: "/projects/shellforge/result?outcome=passed" },
    when: "Yesterday",
    glyph: "👤",
    iconBg: "bg-[#EAF1FF]",
    iconFg: "text-[#2F6BFF]",
  },
  {
    id: "recap",
    section: "Earlier",
    body: "Weekly recap: +340 XP, 6 concepts and 2 badges last week.",
    boldParts: ["+340 XP"],
    cta: { label: "View recap", href: "/progress" },
    when: "2 days ago",
    glyph: "📊",
    iconBg: "bg-[#F3F1F8]",
    iconFg: "text-[#6E6A7C]",
  },
];
