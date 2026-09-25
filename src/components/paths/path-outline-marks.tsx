import { Check, CircuitBoard, FileText } from "lucide-react";
import { cn } from "@/lib/cn";

export type PathItemRole = "lesson" | "project";

/** Infer lesson vs project for outline rows (slug / title / capstone href). */
export function pathItemRole(input: {
  slug?: string;
  title?: string;
  href?: string;
}): PathItemRole {
  if (input.href?.includes("/projects/")) return "project";
  if (input.slug?.startsWith("project-")) return "project";
  if (input.title?.toLowerCase().startsWith("project")) return "project";
  return "lesson";
}

export function PathKindIcon({
  role,
  complete = false,
  active = false,
  className,
}: {
  role: PathItemRole;
  complete?: boolean;
  active?: boolean;
  className?: string;
}) {
  const Icon = role === "project" ? CircuitBoard : FileText;
  return (
    <span
      className={cn(
        "flex h-8 w-8 flex-none items-center justify-center rounded-xl transition-colors",
        complete &&
          "border border-card-border bg-elevated text-ink-fainter dark:bg-bg",
        active &&
          !complete &&
          "border-2 border-brand-violet bg-paper text-brand-violet shadow-[0_0_0_3px_rgba(13,159,110,0.14)] dark:bg-elevated",
        !complete &&
          !active &&
          "border border-card-border bg-elevated text-ink-fainter group-hover:border-xp-border group-hover:bg-xp-bg/50 group-hover:text-ink-secondary dark:bg-bg",
        className,
      )}
      title={role === "project" ? "Project" : "Lesson"}
      aria-hidden
    >
      <Icon size={16} strokeWidth={1.75} />
    </span>
  );
}

export function PathStatusMark({
  complete,
  active,
}: {
  complete: boolean;
  active: boolean;
}) {
  if (complete) {
    return (
      <span
        className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-brand-gradient"
        aria-label="Completed"
      >
        <Check size={12} strokeWidth={2.8} className="text-white" aria-hidden />
      </span>
    );
  }
  if (active) {
    return (
      <span
        className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border-2 border-brand-violet bg-paper shadow-[0_0_0_3px_rgba(13,159,110,0.14)] dark:bg-elevated"
        aria-label="Up next"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-violet" />
      </span>
    );
  }
  return (
    <span
      className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border border-card-border bg-elevated dark:bg-bg"
      aria-label="Not completed"
    />
  );
}

export function BandArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function sectionMetaLabel(lessonCount: number, projectCount: number): string {
  const parts: string[] = [];
  if (lessonCount > 0) {
    parts.push(`${lessonCount} lesson${lessonCount === 1 ? "" : "s"}`);
  }
  if (projectCount > 0) {
    parts.push(`${projectCount} project${projectCount === 1 ? "" : "s"}`);
  }
  return parts.join(" · ") || "Coming soon";
}
