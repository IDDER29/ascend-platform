"use client";

import {
  PRACTICE_COACH_V2_SESSION_CSS,
  PRACTICE_COACH_V2_SESSION_HTML,
} from "@/components/practice/practice-coach-v2-session-markup";

/** Coach Review session body inside learner AppShell. */
export function PracticeCoachV2Session() {
  return (
    <>
      <style id="practice-coach-v2-session-css">{PRACTICE_COACH_V2_SESSION_CSS}</style>
      <div
        className="practice-coach-v2-session"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_SESSION_HTML }}
      />
    </>
  );
}
