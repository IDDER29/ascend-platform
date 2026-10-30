import type { NextConfig } from "next";

/** Practice paths the retired `/practice/:path(/:section)` pages served. */
const OLD_PRACTICE_PATHS = "foundations|systems-programmer";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Coach (v2) became the one Practice; keep old links and bookmarks working.
      { source: "/practicev2", destination: "/practice", permanent: true },
      { source: "/practicev2/foundations", destination: "/practice/paths/foundations", permanent: true },
      { source: "/practicev2/:rest*", destination: "/practice/:rest*", permanent: true },
      { source: "/progressv2", destination: "/progress", permanent: true },
      { source: "/profilev2", destination: "/profile", permanent: true },
      { source: "/bookmarksv2", destination: "/bookmarks", permanent: true },
      // Earlier achievements explorations; the chest is the one page now.
      { source: "/achievementsv:n(\\d+)", destination: "/achievements", permanent: true },
      {
        source: `/practice/:path(${OLD_PRACTICE_PATHS})`,
        destination: "/practice/paths/:path",
        permanent: true,
      },
      {
        source: `/practice/:path(${OLD_PRACTICE_PATHS})/:section`,
        destination: "/practice/session?scope=section&path=:path&section=:section",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
