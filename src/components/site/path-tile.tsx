import Link from "next/link";
import { PathIcon, pathMeta, requiresName } from "@/components/paths-v2/path-parts";
import type { PathView } from "@/lib/paths/paths-v2-model";
import { CARD } from "./site-ui";

/** A path on the public site: what it is, what's in it, and its page. */
export function PathTile({ path }: { path: PathView }) {
  return (
    <Link
      href={path.href}
      className={`${CARD} flex h-full flex-col gap-4 p-5 text-[var(--coach-ink)] no-underline hover:border-[var(--coach-border-strong)] sm:p-6`}
    >
      <div className="flex items-start gap-3">
        <PathIcon slug={path.slug} muted={path.soon} />
        <div className="min-w-0 flex-1">
          <h3 className="m-0 text-[18px] font-bold leading-tight">{path.title}</h3>
          <p className="m-0 mt-1 text-[13px] text-[var(--coach-ink-muted)]">{pathMeta(path)}</p>
        </div>
      </div>
      <p className="m-0 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
        {path.pitch}
      </p>
      <ul className="m-0 mt-auto flex list-none flex-wrap gap-1.5 p-0" aria-label="What's in it">
        {path.courses.map((c) => (
          <li
            key={c.id}
            className="rounded-full bg-[var(--coach-tint-neutral-bg)] px-2.5 py-1 text-[12.5px] font-medium text-[var(--coach-ink-secondary)]"
          >
            {c.title}
          </li>
        ))}
      </ul>
      {path.requires && (
        <p className="m-0 text-[13px] text-[var(--coach-ink-muted)]">Builds on {requiresName(path.requires)}</p>
      )}
    </Link>
  );
}
