import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getD1(): D1Database {
  if (!env.DB) {
    throw new Error("D1 binding DB is unavailable");
  }
  return env.DB;
}

export function getDb() {
  return drizzle(getD1(), { schema });
}

let schemaReady: Promise<void> | null = null;

export function ensureContactSchema(): Promise<void> {
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    const d1 = getD1();
    await d1.batch([
      d1.prepare(
        `CREATE TABLE IF NOT EXISTS contact_messages (
          id text PRIMARY KEY NOT NULL,
          name text NOT NULL,
          email text NOT NULL,
          organization text DEFAULT '' NOT NULL,
          subject text DEFAULT '' NOT NULL,
          message text NOT NULL,
          status text DEFAULT 'new' NOT NULL
            CHECK (status in ('new', 'read', 'archived')),
          created_at integer DEFAULT (unixepoch()) NOT NULL
        )`
      ),
      d1.prepare(
        `CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
         ON contact_messages (created_at)`
      ),
      d1.prepare(
        `CREATE INDEX IF NOT EXISTS contact_messages_status_created_at_idx
         ON contact_messages (status, created_at)`
      ),
      d1.prepare(
        `CREATE TABLE IF NOT EXISTS contact_rate_limits (
          bucket text PRIMARY KEY NOT NULL,
          request_count integer DEFAULT 0 NOT NULL,
          window_start integer NOT NULL,
          expires_at integer NOT NULL
        )`
      ),
      d1.prepare(
        `CREATE INDEX IF NOT EXISTS contact_rate_limits_expires_at_idx
         ON contact_rate_limits (expires_at)`
      )
    ]);
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });

  return schemaReady;
}
