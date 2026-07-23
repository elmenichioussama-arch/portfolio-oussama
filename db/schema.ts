import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text
} from "drizzle-orm/sqlite-core";

export const contactMessages = sqliteTable(
  "contact_messages",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    organization: text("organization").notNull().default(""),
    subject: text("subject").notNull().default(""),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`)
  },
  (table) => [
    check(
      "contact_messages_status_check",
      sql`${table.status} in ('new', 'read', 'archived')`
    ),
    index("contact_messages_created_at_idx").on(table.createdAt),
    index("contact_messages_status_created_at_idx").on(
      table.status,
      table.createdAt
    )
  ]
);

export const contactRateLimits = sqliteTable(
  "contact_rate_limits",
  {
    bucket: text("bucket").primaryKey(),
    requestCount: integer("request_count").notNull().default(0),
    windowStart: integer("window_start").notNull(),
    expiresAt: integer("expires_at").notNull()
  },
  (table) => [
    index("contact_rate_limits_expires_at_idx").on(table.expiresAt)
  ]
);
