"use client";

import {
  PRACTICE_COACH_V2_COMPLETE_CSS,
  PRACTICE_COACH_V2_COMPLETE_HTML,
} from "@/components/practice/practice-coach-v2-complete-markup";

/** Coach Review complete body inside learner AppShell. */
export function PracticeCoachV2Complete() {
  return (
    <>
      <style id="practice-coach-v2-complete-css">{PRACTICE_COACH_V2_COMPLETE_CSS}</style>
      <div
        className="practice-coach-v2-complete"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_COMPLETE_HTML }}
      />
    </>
  );
}
