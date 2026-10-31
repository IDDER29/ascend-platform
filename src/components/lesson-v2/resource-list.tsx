import { ArrowUpRight, FileText, Play } from "lucide-react";
import { SaveResourceButton } from "@/components/bookmarks/lesson-bookmarks";
import type { AdditionalResource } from "@/lib/content/schema";

/** A lesson's outside reading and viewing, each with a save button. */
export function ResourceList({ resources }: { resources: (AdditionalResource & { url: string })[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2">
      {resources.map((r) => {
        const Icon = r.type === "video" ? Play : FileText;
        return (
          <li key={r.url} className="relative">
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-full items-start gap-3 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] py-3.5 pl-3.5 pr-10 text-[var(--coach-ink)] no-underline hover:border-[var(--coach-border-strong)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]">
                <Icon size={16} strokeWidth={2.2} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[14.5px] font-semibold leading-snug">{r.title}</span>
                <span className="mt-0.5 flex items-center gap-1 text-[12.5px] text-[var(--coach-ink-muted)]">
                  {r.type === "video" ? "Watch" : "Read"} · {r.duration ?? r.meta}
                  <ArrowUpRight size={13} aria-hidden />
                </span>
              </span>
            </a>
            <SaveResourceButton title={r.title} url={r.url} meta={r.meta} />
          </li>
        );
      })}
    </ul>
  );
}
