import {
  getFoundationPaths,
  getRolePaths,
  pathHref,
} from "@/lib/paths/catalog";
import {
  PathFoundationTile,
  PathRoleRow,
} from "@/components/paths/path-catalog";
import { HUB_CONTENT_CLASS, HUB_MAIN_CLASS } from "@/components/ui/page-header";

export const metadata = {
  title: "All paths — Ascend",
  description:
    "Start with the right foundations, then choose the role you're training for.",
  robots: { index: false },
};

export default function PathsPage() {
  const foundations = getFoundationPaths();
  const roles = getRolePaths();

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <header className="mb-10 max-w-[640px]">
          <h1 className="font-display text-[32px] font-extrabold tracking-[-0.032em] text-ink sm:text-[36px]">
            All paths
          </h1>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-secondary">
            Start with the right foundations, then choose the role you&apos;re training
            for.
          </p>
        </header>

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
                meta={path.requiresLabel ?? (path.status === "live" ? "Where systems paths begin" : "On-ramp for AI Engineer")}
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
                requiresLabel={path.requiresLabel}
                soon={path.status === "soon"}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
