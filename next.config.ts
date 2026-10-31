import type { NextConfig } from "next";

/** Practice paths the retired `/practice/:path(/:section)` pages served. */
const OLD_PRACTICE_PATHS = "foundations|systems-programmer";

/**
 * Security headers on every response. Scripts: the app's own, plus inline ones (Next's bootstrap and the
 * theme script in the root layout); 'unsafe-eval' only in development, for React's dev tooling.
 * Nothing is embedded from elsewhere, and no other site may frame Ascend.
 */
const isDev = process.env.NODE_ENV !== "production";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
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
      // Retired: the Today card says when a streak ended.
      { source: "/streak-lost", destination: "/dashboard", permanent: true },
      // ShellForge's demo submit/result is gone; the real page explains shipping.
      { source: "/projects/shellforge/submit", destination: "/projects/shellforge", permanent: true },
      { source: "/projects/shellforge/result", destination: "/projects/shellforge", permanent: true },
      // The pages each redesign replaced, removed before launch: their URLs land on today's page.
      { source: "/homev1", destination: "/", permanent: true },
      { source: "/dashboardv1", destination: "/dashboard", permanent: true },
      { source: "/pathsv1", destination: "/paths", permanent: true },
      { source: "/pathsv1/:slug", destination: "/paths/:slug", permanent: true },
      { source: "/lessonsv1/:slug", destination: "/lessons/:slug", permanent: true },
      { source: "/bookmarksv1", destination: "/bookmarks", permanent: true },
      { source: "/level-completev1/:level", destination: "/level-complete/:level", permanent: true },
      { source: "/onboardingv1", destination: "/onboarding", permanent: true },
      { source: "/signinv1", destination: "/signin", permanent: true },
      { source: "/resetv1/:rest*", destination: "/reset/:rest*", permanent: true },
      { source: "/curriculumv1", destination: "/paths", permanent: true },
      { source: "/curriculum2", destination: "/paths", permanent: true },
      { source: "/streak-lostv1", destination: "/dashboard", permanent: true },
      { source: "/projects/shellforgev1/:rest*", destination: "/projects/shellforge", permanent: true },
      { source: "/settingsv1/:rest*", destination: "/settings/:rest*", permanent: true },
      { source: "/themes/:theme", destination: "/", permanent: true },
      // The community page was a demo with made-up threads; it's gone until there's a real one.
      { source: "/community", destination: "/", permanent: false },
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
