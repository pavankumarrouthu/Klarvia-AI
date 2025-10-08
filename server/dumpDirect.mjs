// Direct Postgres inspection using existing pool (no HTTP server needed)
// Usage: node server/dumpDirect.mjs
// Optional env vars:
//   MAX_ROWS=20   (rows per table)
//   SCHEMA=public (schema to inspect)

import { pool } from './db.js';

const MAX_ROWS = parseInt(process.env.MAX_ROWS || '20', 10);
const SCHEMA = process.env.SCHEMA || 'public';

async function main() {
  const client = await pool.connect();
  try {
    console.log(`Inspecting schema: ${SCHEMA}`);
    const tablesRes = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema=$1 AND table_type='BASE TABLE' ORDER BY table_name`,
      [SCHEMA]
    );
    const tables = tablesRes.rows.map(r => r.table_name);
    console.log('Tables:', tables);
    const output = {};
    for (const t of tables) {
      try {
        const rowsRes = await client.query(`SELECT * FROM "${t}" LIMIT $1`, [MAX_ROWS]);
        output[t] = rowsRes.rows;
      } catch (err) {
        output[t] = { error: err.message };
      }
    }
    console.log('\n=== DATABASE SNAPSHOT ===');
    console.log(JSON.stringify({ schema: SCHEMA, tables, data: output }, null, 2));
  } catch (err) {
    console.error('Dump failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
