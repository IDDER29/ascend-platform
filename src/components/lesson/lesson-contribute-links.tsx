import { OutboundLink } from "@/components/ui/olink";

/**
 * Quiet Odin-style contribute links under the lesson article.
 * Renders nothing if both URLs are null.
 */
export function LessonContributeLinks({
  editUrl,
  issueUrl,
}: {
  editUrl: string | null;
  issueUrl: string | null;
}) {
  if (!editUrl && !issueUrl) return null;

  return (
    <nav
      aria-label="Contribute"
      className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-divider pt-6 text-[13px] text-ink-faint"
    >
      {editUrl ? (
        <OutboundLink
          href={editUrl}
          className="font-semibold text-ink-secondary hover:text-ink"
        >
          Edit on GitHub
        </OutboundLink>
      ) : null}
      {editUrl && issueUrl ? (
        <span className="text-ink-fainter" aria-hidden>
          ·
        </span>
      ) : null}
      {issueUrl ? (
        <OutboundLink
          href={issueUrl}
          className="font-semibold text-ink-secondary hover:text-ink"
        >
          Report an issue
        </OutboundLink>
      ) : null}
    </nav>
  );
}
