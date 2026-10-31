/**
 * One retry for the database errors that pass on their own: a dropped connection, or a Neon compute
 * waking from scale-to-zero. Anything else (a bad query, a constraint) is thrown at once.
 */

const TRANSIENT_CODES = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EPIPE",
  "CONNECTION_CLOSED",
  "CONNECTION_ENDED",
  "CONNECTION_DESTROYED",
  "CONNECT_TIMEOUT",
  "57P01", // admin_shutdown: the compute restarted
  "57P03", // cannot_connect_now: the compute is starting
  "08000",
  "08001",
  "08003",
  "08006", // connection failures
  "SQLITE_BUSY",
]);

export function isTransientDbError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: unknown }).code;
  if (typeof code === "string" && TRANSIENT_CODES.has(code)) return true;
  const cause = (err as { cause?: unknown }).cause;
  return cause !== undefined && cause !== err && isTransientDbError(cause);
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: { retries?: number; delayMs?: number; sleep?: (ms: number) => Promise<void> } = {},
): Promise<T> {
  const retries = opts.retries ?? 1;
  const delayMs = opts.delayMs ?? 300;
  const sleep = opts.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries || !isTransientDbError(err)) throw err;
      await sleep(delayMs * (attempt + 1));
    }
  }
}
