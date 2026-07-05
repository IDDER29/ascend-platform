import type { Config } from "drizzle-kit";

/**
 * Generates real SQL migrations for the Postgres/Supabase backend.
 * Run: npx drizzle-kit generate --config drizzle.config.pg.ts
 * Apply against Supabase: npx drizzle-kit migrate --config drizzle.config.pg.ts
 * (requires DATABASE_URL to point at your Supabase connection string).
 * The local SQLite fallback needs none of this -- its schema is applied
 * automatically at runtime, see src/lib/db/sqlite-ddl.ts.
 */
export default {
  schema: "./src/lib/db/schema.pg.ts",
  out: "./drizzle/pg",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
} satisfies Config;
