import type { ReactNode } from "react";

/**
 * A table only screen readers get, such as the numbers behind a chart. A table ignores sr-only's 1px width
 * and can push the page sideways, so the wrapper is what gets hidden.
 */
export function SrOnlyTable({ children }: { children: ReactNode }) {
  return (
    <div className="sr-only">
      <table>{children}</table>
    </div>
  );
}
