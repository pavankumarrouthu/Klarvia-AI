import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.server' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('No DATABASE_URL found in .env.server');
  process.exit(1);
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export default pool;
