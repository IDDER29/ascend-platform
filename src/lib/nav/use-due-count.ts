"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { dueCount, readCards, readNewDayMeta } from "@/lib/practice/cards";

/**
 * Cards due now, from this browser's copy of the deck (Today and Practice sync it from the server).
 * Re-read on every page change, when the tab regains focus, and when another tab writes.
 */
export function useDueCount(userId: string | null): number {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => setCount(dueCount(readCards(userId), readNewDayMeta(userId)));
    queueMicrotask(read);
    window.addEventListener("focus", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("focus", read);
      window.removeEventListener("storage", read);
    };
  }, [userId, pathname]);

  return count;
}
