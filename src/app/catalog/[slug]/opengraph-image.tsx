import { PATHS } from "@/lib/paths/catalog";
import { publicPaths } from "@/lib/site/site-data";
import { SHARE_SIZE, shareImage } from "@/lib/brand/share-image";

export const alt = "An Ascend learning path";
export const size = SHARE_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return PATHS.map((p) => ({ slug: p.slug }));
}

export default async function PathImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = publicPaths().views.find((v) => v.slug === slug);
  if (!path) return shareImage({ title: "Learn how computers really work" });
  return shareImage({ eyebrow: "Learning path", title: path.title, line: path.pitch });
}
