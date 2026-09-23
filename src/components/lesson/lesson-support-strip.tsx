import Link from "next/link";

/**
 * Quiet end-of-lesson support strip — points at the landing open-source section.
 * Not a donate card; Phosphor-quiet, one job.
 */
export function LessonSupportStrip() {
  return (
    <aside className="mt-10 border-t border-divider pt-8">
      <p className="max-w-md text-[14px] leading-relaxed text-ink-secondary text-pretty">
        Ascend is community-built and free. If you want to help keep it that way,
        see how to support the project.
      </p>
      <Link
        href="/#open"
        className="mt-3 inline-flex min-h-9 items-center text-[13.5px] font-semibold text-brand-violet transition-colors hover:text-xp-text"
      >
        Support us
      </Link>
    </aside>
  );
}
