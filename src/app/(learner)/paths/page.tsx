import Link from "next/link";
import {
  getFoundationPaths,
  getRolePaths,
  pathHref,
  pathOutlineMeta,
  pathSelectHref,
} from "@/lib/paths/catalog";
import {
  PathFoundationTile,
  PathRoleRow,
} from "@/components/paths/path-catalog";
import { Button } from "@/components/ui/button";
import {
  HUB_CONTENT_CLASS,
  HUB_MAIN_CLASS,
  PageHeader,
} from "@/components/ui/page-header";

export const metadata = {
  title: "All paths — Ascend",
  description:
    "Start with the right foundations, then choose the role you're training for.",
  robots: { index: false },
};

export default function PathsPage() {
  const foundations = getFoundationPaths();
  const roles = getRolePaths();
  const liveFoundations = foundations.find((p) => p.status === "live");
  const startHref =
    (liveFoundations && pathSelectHref(liveFoundations)) ??
    pathHref("foundations");

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <PageHeader
          eyebrow="Learn / Paths"
          title="All paths"
          description="Start with the right foundations, then choose the role you're training for."
          actions={
            <Button href={startHref} size="md">
              Start Foundations
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          }
        />

        <section className="mb-12">
          <h2 className="mb-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-fainter">
            Start here
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {foundations.map((path) => (
              <PathFoundationTile
                key={path.slug}
                title={path.title}
                body={path.body}
                href={pathHref(path.slug)}
                meta={pathOutlineMeta(path)}
                soon={path.status === "soon"}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-fainter">
              Then choose a learning path
            </h2>
            <p className="mt-1.5 max-w-[54ch] text-[13px] text-ink-fainter">
              Each path is a role you can train toward.
            </p>
          </div>
          <div className="mt-2 border-t border-divider">
            {roles.map((path) => (
              <PathRoleRow
                key={path.slug}
                title={path.title}
                body={path.body}
                href={pathHref(path.slug)}
                meta={pathOutlineMeta(path)}
                soon={path.status === "soon"}
              />
            ))}
          </div>
        </section>

        <aside className="mt-14 max-w-[54ch] border-t border-divider pt-8">
          <p className="text-[14px] leading-relaxed text-ink-secondary">
            New here? Start with{" "}
            <Link
              href={pathHref("foundations")}
              className="font-medium text-brand-violet hover:underline"
            >
              Foundations
            </Link>
            — the shared on-ramp for systems paths — then pick the role you&apos;re
            training for.
          </p>
        </aside>
      </div>
    </main>
  );
}
