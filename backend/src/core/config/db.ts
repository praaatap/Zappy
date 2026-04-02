import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "./environment";
import { logger } from "../utils/logger";
import * as schema from "../../db/schema";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

const connectDB = async () => {
  try {
    await pool.connect();
    logger.info("🐘 PostgreSQL Connected via Drizzle");
  } catch (error) {
    logger.error("❌ Error connecting to PostgreSQL:", { error });
    process.exit(1);
  }
};

export default connectDB;
