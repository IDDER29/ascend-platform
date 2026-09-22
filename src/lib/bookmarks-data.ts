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

/** Empty until a bookmarks DB exists — do not seed fake "you saved" items. */
export const BOOKMARKS: BookmarkItem[] = [];
