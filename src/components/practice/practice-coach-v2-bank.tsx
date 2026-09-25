"use client";

import {
  PRACTICE_COACH_V2_BANK_CSS,
  PRACTICE_COACH_V2_BANK_HTML,
} from "@/components/practice/practice-coach-v2-bank-markup";

/** Coach Card bank desktop body inside the learner AppShell. */
export function PracticeCoachV2Bank() {
  return (
    <>
      <style id="practice-coach-v2-bank-css">
        {PRACTICE_COACH_V2_BANK_CSS}
      </style>
      <div
        className="practice-coach-v2-bank"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_BANK_HTML }}
      />
    </>
  );
}
