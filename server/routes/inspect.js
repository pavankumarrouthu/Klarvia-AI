/**
 * Generic database inspection & CRUD routes.
 *
 * SECURITY NOTE (IMPORTANT):
 * These endpoints should only be used in a secure, local development environment.
 * Do NOT expose them publicly without adding authentication/authorization and
 * stricter access controls. They allow read/write/delete across any table.
 *
 * ENDPOINTS
 * 1. GET    /inspect/tables
 *      - List all user tables (public schema by default)
 * 2. GET    /inspect/:table?limit=50
 *      - View the first N rows (default 50) of a table
 *        Query params: limit (1-500)
 * 3. PATCH  /inspect/:table/:id
 *      - Edit a single column in a row identified by id (assumes primary key column named "id")
 *        Body: { column: string, value: any }
 * 4. DELETE /inspect/:table/:id
 *      - Delete a row by id (assumes primary key column named "id")
 * 5. POST   /inspect/:table
 *      - Insert a new row.
 *        Body: { data: { colName: value, ... } }
 *
 * All results returned as JSON for easy inspection in Postman/Browser.
 */

import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Simple in-memory metadata cache (schema introspection)
let tableCache = { tables: [], columns: {} }; // columns: { tableName: [col1, col2, ...] }
let lastRefresh = 0;
const REFRESH_INTERVAL_MS = 60_000; // 1 minute

async function refreshMetadata(force = false) {
  const now = Date.now();
  if (!force && now - lastRefresh < REFRESH_INTERVAL_MS && tableCache.tables.length) return tableCache;

  const client = await pool.connect();
  try {
    const tableRes = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    tableCache.tables = tableRes.rows.map(r => r.table_name);

    // Load columns for each table
    tableCache.columns = {};
    for (const t of tableCache.tables) {
      const colsRes = await client.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position;`,
        [t]
      );
      tableCache.columns[t] = colsRes.rows.map(r => r.column_name);
    }
    lastRefresh = now;
  } finally {
    client.release();
  }
  return tableCache;
}

function isSafeIdentifier(name) {
  return typeof name === 'string' && /^[a-zA-Z0-9_]+$/.test(name);
}

async function ensureValidTable(table) {
  await refreshMetadata();
  if (!isSafeIdentifier(table) || !tableCache.tables.includes(table)) {
    const error = new Error('Invalid or unknown table');
    error.status = 400;
    throw error;
  }
}

async function ensureValidColumn(table, column) {
  await refreshMetadata();
  if (!isSafeIdentifier(column) || !tableCache.columns[table]?.includes(column)) {
    const error = new Error('Invalid or unknown column');
    error.status = 400;
    throw error;
  }
}

// 1. List tables
router.get('/tables', async (_req, res) => {
  try {
    const meta = await refreshMetadata(true); // force refresh when listing
    res.json({ tables: meta.tables });
  } catch (err) {
    console.error('List tables error', err);
    res.status(500).json({ error: 'Failed to list tables' });
  }
});

// 2. View rows with optional limit
router.get('/:table', async (req, res) => {
  const { table } = req.params;
  let { limit } = req.query;
  try {
    await ensureValidTable(table);
    let n = parseInt(limit, 10);
    if (Number.isNaN(n) || n <= 0) n = 50;
    if (n > 500) n = 500; // clamp
    const result = await pool.query(`SELECT * FROM "${table}" LIMIT $1`, [n]);
    res.json({ table, count: result.rows.length, rows: result.rows, limit: n });
  } catch (err) {
    console.error('View rows error', err);
    res.status(err.status || 500).json({ error: err.message || 'Failed to fetch rows' });
  }
});

// 3. Edit a row (assumes id column)
router.patch('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const { column, value } = req.body || {};
  if (!column) return res.status(400).json({ error: 'Missing column' });
  try {
    await ensureValidTable(table);
    await ensureValidColumn(table, column);
    // Parameterize value + id; column & table validated separately
    const q = `UPDATE "${table}" SET "${column}" = $1 WHERE id = $2 RETURNING *`;
    const result = await pool.query(q, [value, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Row not found' });
    res.json({ updated: result.rows[0] });
  } catch (err) {
    console.error('Edit row error', err);
    res.status(err.status || 500).json({ error: err.message || 'Failed to update row' });
  }
});

// 4. Delete a row
router.delete('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  try {
    await ensureValidTable(table);
    const q = `DELETE FROM "${table}" WHERE id = $1 RETURNING id`;
    const result = await pool.query(q, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Row not found' });
    res.json({ deleted: result.rows[0].id });
  } catch (err) {
    console.error('Delete row error', err);
    res.status(err.status || 500).json({ error: err.message || 'Failed to delete row' });
  }
});

// 5. Insert a new row
router.post('/:table', async (req, res) => {
  const { table } = req.params;
  const { data } = req.body || {};
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({ error: 'Body must be { data: { col: value, ... } }' });
  }
  try {
    await ensureValidTable(table);
    const keys = Object.keys(data);
    if (keys.length === 0) return res.status(400).json({ error: 'No columns provided' });
    // Validate each column
    for (const k of keys) await ensureValidColumn(table, k);
    const colsQuoted = keys.map(k => `"${k}"`).join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const values = keys.map(k => data[k]);
    const q = `INSERT INTO "${table}" (${colsQuoted}) VALUES (${placeholders}) RETURNING *`;
    const result = await pool.query(q, values);
    res.status(201).json({ inserted: result.rows[0] });
  } catch (err) {
    console.error('Insert row error', err);
    res.status(err.status || 500).json({ error: err.message || 'Failed to insert row' });
  }
});

export default router;
