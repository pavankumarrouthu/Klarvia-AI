import { Pool } from "pg";
import dotenv from "dotenv";

// Load .env and allow it to override any existing environment variables in this process.
// This is useful in dev when the shell or editor has placeholder env entries like '${env:DATABASE_URL}'.
dotenv.config({ override: true });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}
const sslEnabled = (process.env.DATABASE_SSL || "").toLowerCase() === "true";
export const pool = new Pool({
  connectionString,
  ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
});
