import { storageKeysToClear } from "./account-rules";

/** Set just before an account deletion is sent; read on the home page once it went through. */
export const DELETING_KEY = "ascend:deleting-account";

/** Remove this learner's progress (or everything) from this browser. */
export function clearBrowser(userId: string, what: "progress" | "account"): void {
  try {
    const keys = Object.keys(window.localStorage);
    for (const k of storageKeysToClear(keys, userId, what)) window.localStorage.removeItem(k);
  } catch {
    // Storage blocked: nothing to clear.
  }
}
