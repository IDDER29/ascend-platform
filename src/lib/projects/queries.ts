import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";

export type ShellforgeSubmission = {
  id: string;
  repoUrl: string;
  outcome: string;
  attempt: number;
  submittedAt: Date;
};

export class ProjectQueryError extends Error {}

function requireDb() {
  if (!db) {
    throw new ProjectQueryError(
      "Project data isn't available right now (the database isn't reachable).",
    );
  }
  return db;
}

/** Newest Shellforge submissions for the dashboard (capped). */
export async function listRecentShellforgeSubmissions(
  userId: string,
  limit = 3,
): Promise<ShellforgeSubmission[]> {
  const conn = requireDb();
  const rows = await conn.query.shellforgeSubmissions.findMany({
    where: eq(schema.shellforgeSubmissions.userId, userId),
    orderBy: [desc(schema.shellforgeSubmissions.submittedAt)],
    limit,
  });
  return rows.map((r) => ({
    id: r.id,
    repoUrl: r.repoUrl,
    outcome: r.outcome,
    attempt: r.attempt,
    submittedAt:
      r.submittedAt instanceof Date ? r.submittedAt : new Date(r.submittedAt),
  }));
}
