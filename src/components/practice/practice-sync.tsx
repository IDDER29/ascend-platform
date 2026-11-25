"use client";

import { useEffect } from "react";
import { getPracticeSyncStateAction, reconcilePracticeAction } from "@/lib/practice/actions";
import { recoverPractice } from "@/lib/practice/recover";

/**
 * Keeps this browser's Practice data and the signed-in account's in step, on any app page. Renders nothing.
 */
export function PracticeSync({ userId }: { userId: string | null }) {
  useEffect(() => {
    if (!userId) return;
    recoverPractice(userId, { state: getPracticeSyncStateAction, push: reconcilePracticeAction })
      // The due-card badge reads the deck again.
      .then(() => window.dispatchEvent(new Event("storage")))
      // Offline: the next load tries again.
      .catch((err) => console.warn("[practice] sync did not finish:", err));
  }, [userId]);
  return null;
}
