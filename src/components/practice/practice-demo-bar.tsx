"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  PRACTICE_DEMO_VIEWS,
  type PracticeDemoView,
} from "@/lib/practice/demo";

export type { PracticeDemoView } from "@/lib/practice/demo";
export { isPracticeDemoView, PRACTICE_DEMO_VIEWS } from "@/lib/practice/demo";

/** Quiet chrome for layout review — only when `?demo=1`. */
export function PracticeDemoBar({ view }: { view: PracticeDemoView }) {
  const pathname = usePathname() ?? "/practice";
  const searchParams = useSearchParams();

  function hrefFor(next: PracticeDemoView) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("demo", "1");
    params.set("view", next);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="mb-5 rounded-[14px] border border-dashed border-divider bg-elevated/50 px-3.5 py-3">
      <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-fainter">
        Demo layout — not real progress
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {PRACTICE_DEMO_VIEWS.map((item) => (
          <Link
            key={item}
            href={hrefFor(item)}
            className={cn(
              "rounded-full px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.06em] transition-colors",
              item === view
                ? "bg-xp-bg text-xp-text"
                : "bg-paper text-ink-fainter hover:text-ink",
            )}
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
