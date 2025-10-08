// Dumps list of tables and sample rows (limit 20) for each.
// Usage: node server/dumpDatabase.mjs
// Ensure the backend server (server/index.js) is running on port 5000.

const BASE = process.env.API_BASE || 'http://localhost:5000';
const ROW_LIMIT = parseInt(process.env.ROW_LIMIT || '20', 10);

async function main() {
  try {
    const tablesResp = await fetch(`${BASE}/inspect/tables`);
    if (!tablesResp.ok) {
      console.error('Failed to fetch tables:', tablesResp.status, await tablesResp.text());
      return;
    }
    const { tables } = await tablesResp.json();
    console.log('Tables:', tables);
    for (const t of tables) {
      try {
        const rowsResp = await fetch(`${BASE}/inspect/${t}?limit=${ROW_LIMIT}`);
        if (!rowsResp.ok) {
          console.error(`  Table ${t} error:`, rowsResp.status, await rowsResp.text());
          continue;
        }
        const data = await rowsResp.json();
        console.log(`\n=== ${t} (showing ${data.rows.length}/${data.limit}) ===`);
        if (data.rows.length === 0) {
          console.log('  (no rows)');
        } else {
          // Print rows truncated
            data.rows.forEach((r, idx) => {
              const truncated = Object.fromEntries(Object.entries(r).map(([k,v]) => [k, typeof v === 'string' && v.length > 120 ? v.slice(0,117)+'...' : v]));
              console.log(`  #${idx+1}`, truncated);
            });
        }
      } catch (innerErr) {
        console.error(`  Fetch rows failed for ${t}:`, innerErr.message);
      }
    }
  } catch (err) {
    console.error('Dump failed:', err.message);
  }
}

main();
