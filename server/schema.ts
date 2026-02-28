import { pgTable, serial, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const backlinkSubmissions = pgTable("backlink_submissions", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  url: text("url").notNull(),
  targetDomain: text("target_domain").notNull(),
  statusCode: integer("status_code"),
  success: boolean("success").notNull().default(false),
  error: text("error"),
  submittedAt: timestamp("submitted_at").defaultNow(),
}, (table) => [
  index("bl_domain_idx").on(table.domain),
  index("bl_domain_url_idx").on(table.domain, table.url),
]);

export type BacklinkSubmission = typeof backlinkSubmissions.$inferSelect;
export type InsertBacklinkSubmission = typeof backlinkSubmissions.$inferInsert;
