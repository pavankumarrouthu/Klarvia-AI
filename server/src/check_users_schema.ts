import dotenv from 'dotenv';
import { pool } from './db';

dotenv.config({ override: true });

async function run() {
  try {
    const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name='users'
      ORDER BY ordinal_position
    `);
    console.log('users columns:', cols.rows);

    const sample = await pool.query('SELECT * FROM users ORDER BY created_at DESC LIMIT 1');
    console.log('sample user row:', sample.rows[0] || null);
  } catch (e) {
    console.error('check failed:', e);
  } finally {
    await pool.end();
  }
}

run();
