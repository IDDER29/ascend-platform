/**
 * Bring a signed-in browser and its account into step: merge the account's Practice data into the browser's,
 * and send up whatever the account never received (a failed or offline save). Client-safe.
 */
import { reconcileCards, sessionsToUpload, uploadFloor } from "./card-merge";
import { readCards, writeCards } from "./cards";
import { readLocalHistory, writeLocalHistory, type PracticeSessionRecord } from "./history";
import type { PracticeCard } from "./sm2";
import type { SyncState } from "./store";
import { SYNC_BATCH } from "./sync-limits";

export type PracticeRemote = {
  /** The account's data, or null if it couldn't be read. */
  state: (userId: string) => Promise<SyncState | null>;
  push: (
    data: { cards: PracticeCard[]; sessions: PracticeSessionRecord[] },
    userId: string,
  ) => Promise<{ ok: boolean }>;
};

export async function recoverPractice(userId: string, remote: PracticeRemote): Promise<void> {
  const account = await remote.state(userId);
  if (!account) return;

  // Read the browser only now, and write before the next await, so a review made meanwhile isn't lost.
  const floor = uploadFloor({
    resetAt: account.resetAt,
    oldestSessionAt: account.oldestSessionAt,
    serverCardCount: account.cards.length,
  });
  const limits = { resetAt: account.resetAt, floor };
  const { merged, toUpload } = reconcileCards(readCards(userId), account.cards, limits);
  writeCards(userId, merged);
  const history = readLocalHistory(userId);
  const resetAt = account.resetAt;
  if (resetAt !== null) {
    writeLocalHistory(
      userId,
      history.filter((s) => Date.parse(s.at) > resetAt),
    );
  }
  const sessions = sessionsToUpload(history, new Set(account.sessionIds), limits);

  for (let i = 0; i < Math.max(toUpload.length, sessions.length); i += SYNC_BATCH) {
    const result = await remote.push(
      { cards: toUpload.slice(i, i + SYNC_BATCH), sessions: sessions.slice(i, i + SYNC_BATCH) },
      userId,
    );
    // The next load tries again.
    if (!result.ok) return;
  }
}
