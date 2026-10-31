import "server-only";
import { createRequire } from "node:module";
import path from "node:path";
import postgres from "postgres";
import { drizzle as drizzlePg, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import * as pgSchema from "./schema.pg";
import * as sqliteSchema from "./schema.sqlite";
import { SQLITE_ADDED_COLUMNS, SQLITE_DDL } from "./sqlite-ddl";

export type Backend = "postgres" | "sqlite";

function initPostgres(url: string) {
  const client = postgres(url, {
    // Serverless functions each hold their own pool; keep it to one connection there and let Neon's
    // pooler (the "-pooler" host) share connections. The pooler runs in transaction mode, which can't
    // keep prepared statements, so they're off.
    max: isServerless() ? 1 : 5,
    prepare: false,
    // A Neon compute that has scaled to zero takes a moment to wake.
    connect_timeout: 15,
    idle_timeout: 20,
  });
  return drizzlePg(client, { schema: pgSchema });
}

function isServerless(): boolean {
  // Serverless runtimes (Vercel, Netlify, Lambda) ship a read-only
  // filesystem outside /tmp -- process.cwd() can't be written to there.
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
}

function initSqlite() {
  // Loaded only here, so a production deploy (Postgres) never loads the native SQLite module.
  const Database = createRequire(import.meta.url)("better-sqlite3") as typeof import("better-sqlite3");
  const filePath = process.env.SQLITE_PATH || path.join(process.cwd(), "local.db");
  const sqlite = new Database(filePath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(SQLITE_DDL);
  // Bring an older local.db up to date: add columns introduced since it was created.
  for (const { table, column, ddl } of SQLITE_ADDED_COLUMNS) {
    const columns = sqlite.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
    if (!columns.some((c) => c.name === column)) sqlite.exec(ddl);
  }
  return drizzleSqlite(sqlite, { schema: sqliteSchema });
}

type DbInstance = ReturnType<typeof initPostgres> | ReturnType<typeof initSqlite>;

interface GlobalDbCache {
  __ascendDb?: DbInstance | null;
  __ascendBackend?: Backend;
  __ascendDbError?: Error | null;
}

const globalForDb = globalThis as unknown as GlobalDbCache;

/**
 * The active Drizzle instance -- Postgres (Neon) when DATABASE_URL is set,
 * which production always does; otherwise, for local development and tests
 * only, a local SQLite file (auto-created, schema applied on first use) so
 * the whole data layer works with zero external setup. A serverless deploy
 * without DATABASE_URL gets no database at all rather than a throwaway file. Column shapes are kept identical between schema.pg.ts and
 * schema.sqlite.ts specifically so repository code never needs to branch
 * on which backend is live. Cached on globalThis so dev-mode hot reloads
 * don't reopen the sqlite file / postgres pool on every request.
 *
 * Deliberately never throws at import time: a database that's unreachable
 * (no DATABASE_URL and a read-only filesystem, e.g. a serverless deploy
 * with no Postgres configured) must not crash every page that merely
 * checks who's signed in -- see dbInitError / auth.ts's null checks.
 */
if (globalForDb.__ascendDb === undefined) {
  try {
    const url = process.env.DATABASE_URL;
    if (url) {
      globalForDb.__ascendBackend = "postgres";
      globalForDb.__ascendDb = initPostgres(url);
    } else if (isServerless()) {
      // Production runs on Postgres only. A SQLite file on a serverless host lives in /tmp, is wiped
      // between requests and isn't shared between instances, so accounts and progress would vanish.
      globalForDb.__ascendBackend = "postgres";
      throw new Error("DATABASE_URL is not set. This deployment needs a Postgres (Neon) connection string.");
    } else {
      globalForDb.__ascendBackend = "sqlite";
      globalForDb.__ascendDb = initSqlite();
    }
    globalForDb.__ascendDbError = null;
  } catch (err) {
    globalForDb.__ascendDb = null;
    globalForDb.__ascendDbError = err instanceof Error ? err : new Error(String(err));
    console.error(
      "[db] Failed to initialize the database -- auth/account features are disabled for this request. " +
        (process.env.DATABASE_URL
          ? "Check DATABASE_URL is a reachable Postgres connection string."
          : isServerless()
            ? "Set DATABASE_URL to the Neon pooled connection string in the deployment's environment."
            : "The local SQLite file couldn't be opened (see SQLITE_PATH)."),
      globalForDb.__ascendDbError,
    );
  }
}

export const dbBackend: Backend = globalForDb.__ascendBackend!;
export const dbInitError: Error | null = globalForDb.__ascendDbError ?? null;

/**
 * Both variants expose the same query-builder shape (select/insert/update/
 * delete/transaction) and schema.sqlite.ts mirrors schema.pg.ts column-for-
 * column, so it's safe to give repository code a single Postgres-flavored
 * compile-time type regardless of which dialect is actually live -- the
 * runtime object is always correctly dialect-matched to its own schema,
 * this cast only affects what TypeScript sees. `db` is null when init
 * failed (see dbInitError) -- callers must check before use.
 */
export const db = globalForDb.__ascendDb as unknown as PostgresJsDatabase<typeof pgSchema> | null;
export const schema = (dbBackend === "postgres" ? pgSchema : sqliteSchema) as unknown as typeof pgSchema;
