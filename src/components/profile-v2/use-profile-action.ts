"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ProfileActionResult } from "@/lib/profile/actions";

/** Run a profile server action, then refresh the server-rendered page. */
export function useProfileAction() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<ProfileActionResult>, onDone?: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onDone?.();
      router.refresh();
    });
  }

  return { pending, error, run };
}
