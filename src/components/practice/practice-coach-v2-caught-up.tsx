"use client";

import {
  PRACTICE_COACH_V2_CAUGHT_UP_CSS,
  PRACTICE_COACH_V2_CAUGHT_UP_HTML,
} from "@/components/practice/practice-coach-v2-caught-up-markup";

/** Coach all-caught-up body inside the learner AppShell. */
export function PracticeCoachV2CaughtUp() {
  return (
    <>
      <style id="practice-coach-v2-caught-up-css">
        {PRACTICE_COACH_V2_CAUGHT_UP_CSS}
      </style>
      <div
        className="practice-coach-v2-caught-up"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_CAUGHT_UP_HTML }}
      />
    </>
  );
}
