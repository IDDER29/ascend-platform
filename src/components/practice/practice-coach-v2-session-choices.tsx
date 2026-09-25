"use client";

import {
  PRACTICE_COACH_V2_SESSION_CHOICES_CSS,
  PRACTICE_COACH_V2_SESSION_CHOICES_HTML,
} from "@/components/practice/practice-coach-v2-session-choices-markup";

/** Coach Choices body inside learner AppShell. */
export function PracticeCoachV2SessionChoices() {
  return (
    <>
      <style id="practice-coach-v2-session-choices-css">{PRACTICE_COACH_V2_SESSION_CHOICES_CSS}</style>
      <div
        className="practice-coach-v2-session-choices"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_SESSION_CHOICES_HTML }}
      />
    </>
  );
}
