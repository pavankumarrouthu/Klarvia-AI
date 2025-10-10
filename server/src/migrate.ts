import fs from "fs";
import path from "path";
import { pool } from "./db";
import dotenv from "dotenv";

dotenv.config({ override: true });

async function run() {
  const migrationsDir = path.resolve(__dirname, "../migrations");
  const migrationFiles = fs.readdirSync(migrationsDir).sort();

  if (migrationFiles.length === 0) {
    console.log("No migration files found.");
    return;
  }

  const client = await pool.connect();
  try {
    for (const file of migrationFiles) {
      if (file.endsWith(".sql")) {
        console.log(`Applying migration: ${file}`);
        const sqlPath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(sqlPath, "utf-8");
        await client.query(sql);
        console.log(`- ${file} applied successfully`);
      }
    }
    console.log("All migrations applied successfully.");
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
