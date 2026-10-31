"use client";

import { Search } from "lucide-react";
import { OUTLINE_BTN } from "./site-ui";

/** Opens the command palette (mounted in the root layout). */
export function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("ascend:open-palette"))}
      className={OUTLINE_BTN}
    >
      <Search size={17} strokeWidth={2.4} aria-hidden />
      Search lessons
    </button>
  );
}
