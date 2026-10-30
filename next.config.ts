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
      { source: "/dashboardv2", destination: "/dashboard", permanent: true },
      { source: "/pathsv2", destination: "/paths", permanent: true },
      { source: "/pathsv2/:slug", destination: "/paths/:slug", permanent: true },
      { source: "/lessonsv2/:slug", destination: "/lessons/:slug", permanent: true },
      { source: "/projects/shellforgev2", destination: "/projects/shellforge", permanent: true },
      // Curriculum was replaced by Paths; lesson links under /curriculum/... still redirect to the lesson.
      { source: "/curriculum", destination: "/paths", permanent: true },
      { source: "/homev2", destination: "/", permanent: true },
      // Retired: the Today card says when a streak ended. Old demo kept at /streak-lostv1.
      { source: "/streak-lost", destination: "/dashboard", permanent: true },
      // ShellForge's demo submit/result moved beside the old brief; the real page explains shipping.
      { source: "/projects/shellforge/submit", destination: "/projects/shellforge", permanent: true },
      { source: "/projects/shellforge/result", destination: "/projects/shellforge", permanent: true },
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
