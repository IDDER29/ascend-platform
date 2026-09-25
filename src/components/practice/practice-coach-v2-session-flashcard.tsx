"use client";

import {
  PRACTICE_COACH_V2_SESSION_FLASHCARD_CSS,
  PRACTICE_COACH_V2_SESSION_FLASHCARD_HTML,
} from "@/components/practice/practice-coach-v2-session-flashcard-markup";

/** Coach Flashcard body inside learner AppShell. */
export function PracticeCoachV2SessionFlashcard() {
  return (
    <>
      <style id="practice-coach-v2-session-flashcard-css">{PRACTICE_COACH_V2_SESSION_FLASHCARD_CSS}</style>
      <div
        className="practice-coach-v2-session-flashcard"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_SESSION_FLASHCARD_HTML }}
      />
    </>
  );
}
