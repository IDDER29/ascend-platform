import type { Assignment } from "@/lib/content/schema";
import { OutboundLink } from "@/components/ui/olink";

export function AssignmentCard({ assignment }: { assignment: Assignment }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-card-border bg-paper shadow-card-rest dark:bg-elevated">
      <div className="flex items-center gap-3 bg-brand-gradient px-5 py-4 text-white">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white/15">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/90">
          Do this before the next lesson
        </span>
      </div>
      <div className="px-[22px] py-5">
        <p className="mb-4 text-[14.5px] leading-relaxed text-ink-secondary">
          {assignment.instruction}
        </p>
        {assignment.resourceUrl ? (
          <OutboundLink href={assignment.resourceUrl}>{assignment.resourceName}</OutboundLink>
        ) : (
          <span className="font-bold text-ink-muted">{assignment.resourceName}</span>
        )}
      </div>
    </div>
  );
}
