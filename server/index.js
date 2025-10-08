import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import migrate from './migrate.js';
import authRoutes from './routes/auth.js';
import inspectRoutes from './routes/inspect.js';
import { pool } from './db.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.server' });

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await migrate();
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN || 'http://localhost:8080',
      credentials: true,
    })
  );

  app.use('/auth', authRoutes);
  app.use('/inspect', inspectRoutes);

  app.get('/', (_req, res) => res.send('Auth API running'));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  // Direct dump endpoint (DEV ONLY) - returns tables + up to 20 rows each.
  app.get('/inspect-dump', async (_req, res) => {
    try {
      const { rows: tableRows } = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema='public' AND table_type='BASE TABLE'
        ORDER BY table_name;
      `);
      const tables = tableRows.map(r => r.table_name);
      const result = {};
      for (const t of tables) {
        try {
          const { rows } = await pool.query(`SELECT * FROM "${t}" LIMIT 20`);
          result[t] = rows;
        } catch (inner) {
          result[t] = { error: inner.message };
        }
      }
      res.json({ tables, data: result });
    } catch (e) {
      console.error('inspect-dump error', e);
      res.status(500).json({ error: 'Failed to dump database' });
    }
  });

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

start();
