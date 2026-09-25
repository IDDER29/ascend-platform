"use client";

import {
  PRACTICE_COACH_V2_CUSTOM_CSS,
  PRACTICE_COACH_V2_CUSTOM_HTML,
} from "@/components/practice/practice-coach-v2-custom-markup";

/** Coach custom deck builder body inside learner AppShell. */
export function PracticeCoachV2Custom() {
  return (
    <>
      <style id="practice-coach-v2-custom-css">
        {PRACTICE_COACH_V2_CUSTOM_CSS}
      </style>
      <div
        className="practice-coach-v2-custom"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_CUSTOM_HTML }}
      />
    </>
  );
}
