import type { MetadataRoute } from "next";
import { getAllLessons } from "@/lib/content/lessons";
import { PATHS } from "@/lib/paths/catalog";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { CATALOG_HREF, SITE_NAV, SITE_URL } from "@/lib/site/site-nav";

/** The public pages, every path's page and every lesson. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", ...SITE_NAV.map((n) => n.href), "/privacy", "/terms"];
  const paths = PATHS.map((p) => `${CATALOG_HREF}/${p.slug}`);
  const lessons = getAllLessons().map((l) => lessonHref(l.meta.level, l.meta.slug));
  return [...pages, ...paths, ...lessons].map((href) => ({ url: `${SITE_URL}${href}` }));
}
