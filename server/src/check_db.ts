import dotenv from 'dotenv';
// ensure local .env values are loaded and override any placeholders
dotenv.config({ override: true });
import { pool } from './db';

async function check() {
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT now() as now, version() as version");
    client.release();
    console.log('DB connection OK');
    console.log('server_time:', res.rows[0].now);
    console.log('version:', res.rows[0].version);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('DB connection failed:', err);
    try { await pool.end(); } catch (_) {}
    process.exit(1);
  }
}

check();
