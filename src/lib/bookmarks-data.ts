export type BookmarkKind = "lesson" | "resource" | "snippet";
export type BookmarkIcon = "code" | "video" | "book" | "file";

export interface BookmarkItem {
  id: string;
  kind: BookmarkKind;
  icon: BookmarkIcon;
  title: string;
  subtitle: string;
  /** Real internal link, or null when there's no real destination to send the user to. */
  href: string | null;
  iconGradient: string;
}

export const BOOKMARKS: BookmarkItem[] = [
  {
    id: "lesson-pointer",
    kind: "lesson",
    icon: "code",
    title: "What a pointer really is",
    subtitle: "Lesson · Level 02 · saved 3 days ago",
    href: "/curriculum/level-02-the-c-language/what-a-pointer-really-is",
    iconGradient: "from-[#6D46F2] to-[#C13AE0]",
  },
  {
    id: "resource-beej",
    kind: "resource",
    icon: "video",
    title: "Beej's Guide — §6: System Calls",
    subtitle: "Resource · video · saved 5 days ago",
    href: null,
    iconGradient: "from-[#FF6B4A] to-[#FFB020]",
  },
  {
    id: "resource-malloc",
    kind: "resource",
    icon: "book",
    title: "man 3 malloc",
    subtitle: "Resource · docs · saved 1 week ago",
    href: null,
    iconGradient: "from-[#12B981] to-[#3BC6F0]",
  },
  {
    id: "snippet-bitflag",
    kind: "snippet",
    icon: "code",
    title: "bit-flag toggler",
    subtitle: "Playground snippet · saved 2 weeks ago",
    href: "/playground",
    iconGradient: "dark",
  },
  {
    id: "lesson-pointer-arithmetic",
    kind: "lesson",
    icon: "code",
    title: "Pointer arithmetic",
    subtitle: "Lesson · Level 02 · saved 2 weeks ago",
    href: "/curriculum/level-02-the-c-language/pointer-arithmetic",
    iconGradient: "from-[#6D46F2] to-[#C13AE0]",
  },
  {
    id: "resource-calling-convention",
    kind: "resource",
    icon: "file",
    title: "The x86-64 calling convention (cheatsheet)",
    subtitle: "Resource · doc · saved 3 weeks ago",
    href: null,
    iconGradient: "from-[#FF6B4A] to-[#FFB020]",
  },
];
