"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(target.tagName);
}

/** Plain Enter (outside inputs, buttons and links) navigates to `href`. */
export function useEnterShortcut(href: string | null | undefined): void {
  const router = useRouter();

  useEffect(() => {
    if (!href) return;
    const target = href;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (isInteractiveTarget(event.target)) return;
      event.preventDefault();
      router.push(target);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [href, router]);
}
