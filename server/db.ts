import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema });
    console.log("[DB] PostgreSQL connected");
  } catch (error: any) {
    console.warn("[DB] Connection failed, running without database:", error.message);
  }
} else {
  console.log("[DB] No DATABASE_URL set — running without database (localStorage only)");
}

export { pool, db };
