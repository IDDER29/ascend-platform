"use client";

import {
  PRACTICE_COACH_V2_SESSION_CORRECT_CSS,
  PRACTICE_COACH_V2_SESSION_CORRECT_HTML,
} from "@/components/practice/practice-coach-v2-session-correct-markup";

/** Coach Correct body inside learner AppShell. */
export function PracticeCoachV2SessionCorrect() {
  return (
    <>
      <style id="practice-coach-v2-session-correct-css">{PRACTICE_COACH_V2_SESSION_CORRECT_CSS}</style>
      <div
        className="practice-coach-v2-session-correct"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_SESSION_CORRECT_HTML }}
      />
    </>
  );
}
