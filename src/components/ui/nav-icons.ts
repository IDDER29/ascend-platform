import { Bookmark, LayoutDashboard, LineChart, Map, Settings, Swords, Trophy, UserRound } from "lucide-react";
import type { AppNavId } from "@/lib/nav/app-nav";

/** One icon per place, shared by the sidebar and the phone tab bar. */
export const NAV_ICONS: Record<AppNavId, typeof LayoutDashboard> = {
  today: LayoutDashboard,
  paths: Map,
  practice: Swords,
  progress: LineChart,
  profile: UserRound,
  achievements: Trophy,
  bookmarks: Bookmark,
  settings: Settings,
};
