"use client";

import {
  PRACTICE_COACH_V2_FOUNDATIONS_CSS,
  PRACTICE_COACH_V2_FOUNDATIONS_HTML,
} from "@/components/practice/practice-coach-v2-foundations-markup";

/** Coach Foundations path desk body inside learner AppShell. */
export function PracticeCoachV2Foundations() {
  return (
    <>
      <style id="practice-coach-v2-foundations-css">
        {PRACTICE_COACH_V2_FOUNDATIONS_CSS}
      </style>
      <div
        className="practice-coach-v2-foundations"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_FOUNDATIONS_HTML }}
      />
    </>
  );
}
