import type { Config } from "drizzle-kit";

/**
 * SQL migrations for the production database (Postgres on Neon).
 * After changing schema.pg.ts: npx drizzle-kit generate --config drizzle.config.pg.ts
 * Apply (each deploy that changes the schema): DATABASE_URL=<Neon direct, non-pooled URL> npm run db:migrate
 * Local SQLite needs none of this: its schema is applied at startup (src/lib/db/sqlite-ddl.ts).
 */
export default {
  schema: "./src/lib/db/schema.pg.ts",
  out: "./drizzle/pg",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
} satisfies Config;
