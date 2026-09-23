export type SocialNetwork = "github" | "discord" | "x" | "facebook";

export type SocialLink = {
  id: SocialNetwork;
  label: string;
  href: string;
};

const SOCIAL_META: Record<SocialNetwork, { label: string }> = {
  github: { label: "GitHub" },
  discord: { label: "Discord" },
  x: { label: "Twitter" },
  facebook: { label: "Facebook" },
};

/**
 * Optional public social URLs. Leave empty until product provides a real href.
 * Footer renders an icon only when the string is non-empty after trim.
 */
export const SOCIAL_URLS: Record<SocialNetwork, string> = {
  github: "https://github.com/IDDER29/ascend-platform",
  discord: "",
  x: "",
  facebook: "",
};

export function getConfiguredSocialLinks(): SocialLink[] {
  return (Object.keys(SOCIAL_META) as SocialNetwork[])
    .map((id) => {
      const href = SOCIAL_URLS[id].trim();
      if (!href) return null;
      return { id, label: SOCIAL_META[id].label, href };
    })
    .filter((link): link is SocialLink => link !== null);
}
