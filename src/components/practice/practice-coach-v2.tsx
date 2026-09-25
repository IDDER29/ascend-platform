"use client";

import {
  PRACTICE_COACH_V2_CSS,
  PRACTICE_COACH_V2_HTML,
} from "@/components/practice/practice-coach-v2-markup";

/**
 * Coach Practice desk body (no duplicate top nav / footer).
 * Lives inside the learner AppShell as `/practicev2`.
 */
export function PracticeCoachV2() {
  return (
    <>
      <style id="practice-coach-v2-css">{PRACTICE_COACH_V2_CSS}</style>
      <div
        className="practice-coach-v2"
        // Static extract of our design mock — not user-supplied HTML.
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_HTML }}
      />
    </>
  );
}
