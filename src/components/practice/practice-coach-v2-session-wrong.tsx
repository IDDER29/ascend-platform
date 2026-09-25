"use client";

import {
  PRACTICE_COACH_V2_SESSION_WRONG_CSS,
  PRACTICE_COACH_V2_SESSION_WRONG_HTML,
} from "@/components/practice/practice-coach-v2-session-wrong-markup";

/** Coach Wrong answer body inside learner AppShell. */
export function PracticeCoachV2SessionWrong() {
  return (
    <>
      <style id="practice-coach-v2-session-wrong-css">{PRACTICE_COACH_V2_SESSION_WRONG_CSS}</style>
      <div
        className="practice-coach-v2-session-wrong"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_SESSION_WRONG_HTML }}
      />
    </>
  );
}
