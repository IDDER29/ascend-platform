import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPathPage } from "@/components/site/public-path-page";
import { PATHS } from "@/lib/paths/catalog";
import { publicPaths } from "@/lib/site/site-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return PATHS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = publicPaths().views.find((v) => v.slug === slug);
  return path ? { title: `${path.title}`, description: path.pitch } : {};
}

export default async function CatalogPath({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { views, earns } = publicPaths();
  const path = views.find((v) => v.slug === slug);
  if (!path) notFound();
  return <PublicPathPage path={path} earns={earns[slug] ?? []} />;
}
