/** A session issued before the password last changed is no longer valid (seconds vs the change time). */
export function sessionStillValid(issuedAtSeconds: number, passwordChangedAt: Date | number | null | undefined): boolean {
  if (passwordChangedAt === null || passwordChangedAt === undefined) return true;
  const changed = passwordChangedAt instanceof Date ? passwordChangedAt.getTime() : Number(passwordChangedAt);
  return issuedAtSeconds >= Math.floor(changed / 1000);
}
