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
