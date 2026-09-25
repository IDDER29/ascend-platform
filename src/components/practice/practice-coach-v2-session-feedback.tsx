"use client";

import {
  PRACTICE_COACH_V2_SESSION_FEEDBACK_CSS,
  PRACTICE_COACH_V2_SESSION_FEEDBACK_HTML,
} from "@/components/practice/practice-coach-v2-session-feedback-markup";

/** Coach Feedback body inside learner AppShell. */
export function PracticeCoachV2SessionFeedback() {
  return (
    <>
      <style id="practice-coach-v2-session-feedback-css">{PRACTICE_COACH_V2_SESSION_FEEDBACK_CSS}</style>
      <div
        className="practice-coach-v2-session-feedback"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_SESSION_FEEDBACK_HTML }}
      />
    </>
  );
}
