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

  // --- Fallback top-level Google OAuth handlers ---
  // These duplicate the google handlers from the auth router to ensure the
  // start/callback endpoints exist even if the router mount is missed.
  app.get('/auth/google/start', (req, res) => {
    console.log('[fallback auth] google/start requested from', req.ip);
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirect = process.env.GOOGLE_REDIRECT_URI || `${process.env.API_BASE || 'http://localhost:5000'}/auth/google/callback`;
    if (!clientId) return res.status(500).send('Google OAuth not configured');
    const state = Math.random().toString(36).slice(2);
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirect,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
      state,
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    console.log('[fallback auth] redirecting to google auth url');
    return res.redirect(authUrl);
  });

  app.get('/auth/google/callback', async (req, res) => {
    console.log('[fallback auth] google callback hit, query:', { code: req.query.code, state: req.query.state });
    const code = req.query.code;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect = process.env.GOOGLE_REDIRECT_URI || `${process.env.API_BASE || 'http://localhost:5000'}/auth/google/callback`;
    const frontend = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';
    if (!code || !clientId || !clientSecret) {
      console.error('Fallback google oauth missing params');
      return res.status(400).send('Missing oauth parameters');
    }
    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: String(code),
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirect,
          grant_type: 'authorization_code'
        })
      });
      if (!tokenRes.ok) {
        const ttxt = await tokenRes.text();
        console.error('Fallback token exchange failed', ttxt);
        return res.status(502).send('Token exchange failed');
      }
      const tokenJson = await tokenRes.json();
      const accessToken = tokenJson.access_token;
      if (!accessToken) {
        console.error('Fallback no access token', tokenJson);
        return res.status(502).send('No access token');
      }
      const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!profileRes.ok) {
        const ptxt = await profileRes.text();
        console.error('Fallback failed to fetch userinfo', ptxt);
        return res.status(502).send('Failed to fetch userinfo');
      }
      const profile = await profileRes.json();
      const email = (profile.email || '').toLowerCase();
      if (!email) return res.status(400).send('Google account has no email');

      // Create or find user
      let user = null;
      const { rows } = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
      if (rows[0]) {
        user = rows[0];
      } else {
        const randomPwd = uuidv4();
        const hashed = await bcrypt.hash(randomPwd, 12);
        const ins = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, hashed]);
        user = ins.rows[0];
      }

      const token = uuidv4();
      await pool.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2)', [user.id, token]);
      res.cookie('session_token', token, { httpOnly: true, sameSite: 'lax' });
      console.log('[fallback auth] google sign-in completed for', email, 'user id', user.id);
      return res.redirect(frontend + '/?auth=google');
    } catch (err) {
      console.error('Fallback google callback error', err);
      return res.status(500).send('OAuth callback error');
    }
  });

  app.get('/', (_req, res) => res.send('Auth API running'));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Read-only database snapshot endpoint group under /sb/inspect
  // GET /sb/inspect/dump  -> { tables: [...], data: { table: [rows...] } }
  async function buildSnapshot() {
    const { rows: tableRows } = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
        AND table_type='BASE TABLE'
      ORDER BY table_name;`);
    const tables = tableRows.map(r => r.table_name);
    const data = {};
    const sensitive = new Set(['password', 'password_hash', 'secret', 'token', 'api_key', 'apikey']);
    for (const t of tables) {
      try {
        const { rows } = await pool.query(`SELECT * FROM "${t}" LIMIT 50`);
        // Redact sensitive columns
        const redacted = rows.map(r => {
          const copy = { ...r };
          for (const k of Object.keys(copy)) {
            if (sensitive.has(k.toLowerCase())) copy[k] = '***REDACTED***';
          }
          return copy;
        });
        data[t] = redacted;
      } catch (err) {
        data[t] = { error: err.message };
      }
    }
    return { tables, data };
  }

  function snapshotHandler(_req, res) {
    (async () => {
      try {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        const snap = await buildSnapshot();
        res.status(200).json(snap);
      } catch (e) {
        console.error('inspect snapshot error', e);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to build snapshot' });
        }
      }
    })();
  }

  // Original endpoint
  app.get('/sb/inspect/dump', snapshotHandler);
  // Convenience root (no /dump) -> snapshot
  app.get('/sb/inspect', snapshotHandler);
  // New alias endpoints requested: /inspect/be and /inspect/be/dump
  app.get('/inspect/be', snapshotHandler);
  app.get('/inspect/be/dump', snapshotHandler);
  // Note: do not alias /inspect/db -> snapshotHandler to avoid colliding with the
  // dev inspector router which is mounted at /inspect. The inspector API lives
  // under /inspect (e.g. /inspect/tables, /inspect/:table) and the UI is served
  // from the frontend route /inspect/db.

  // Lightweight DB debug endpoint to verify connectivity
  app.get('/debug/db', async (_req, res) => {
    try {
      const { rows } = await pool.query('SELECT now() AS now');
      res.json({ ok: true, now: rows[0]?.now });
    } catch (err) {
      console.error('debug db error', err);
      res.status(500).json({ ok: false, error: String(err) });
    }
  });

  // Debug: list registered routes (simple overview)
  app.get('/debug/routes', (_req, res) => {
    try {
      const routes = [];
      const stack = app._router && app._router.stack ? app._router.stack : [];
      for (const layer of stack) {
        if (layer.route && layer.route.path) {
          const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
          routes.push({ path: layer.route.path, methods });
        } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
          // nested router
          for (const nested of layer.handle.stack) {
            if (nested.route && nested.route.path) {
              const methods = Object.keys(nested.route.methods).map(m => m.toUpperCase());
              // prefix with layer.regexp if available - best effort
              routes.push({ path: (layer.regexp && layer.regexp.source) ? `${layer.regexp.source}/${nested.route.path}` : nested.route.path, methods });
            }
          }
        }
      }
      res.json({ routes });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  // Mount the more featureful dev inspector router at /inspect
  // Place after the snapshot aliases so the exact /inspect/be routes remain handled by snapshotHandler
  app.use('/inspect', inspectRoutes);

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

start();
