export const LANDING_THEMES = [
  {
    id: "phosphor",
    label: "Phosphor",
    href: "/",
    blurb: "Terminal green + amber",
  },
  {
    id: "blueprint",
    label: "Blueprint",
    href: "/themes/blueprint",
    blurb: "Steel blue + copper",
  },
  {
    id: "graphite",
    label: "Graphite",
    href: "/themes/graphite",
    blurb: "Ink + signal orange",
  },
] as const;

export type LandingThemeId = (typeof LANDING_THEMES)[number]["id"];

export const THEME_CLASS: Record<LandingThemeId, string> = {
  phosphor: "theme-phosphor",
  blueprint: "theme-blueprint",
  graphite: "theme-graphite",
};
