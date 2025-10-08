import express from 'express';
import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.server' });

const router = express.Router();

// POST /auth/signup
router.post('/signup', async (req, res) => {
  let { email, password } = req.body || {};
  if (typeof email === 'string') email = email.trim().toLowerCase();
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  try {
    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashed]
    );
    const user = result.rows[0];
    // Do NOT auto-login; require explicit login after signup
    return res.status(201).json({ user: { id: user.id, email: user.email }, loginRequired: true });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    // If gen_random_uuid not found (extension missing)
    if (err.message && /gen_random_uuid/i.test(err.message)) {
      console.error('Signup error - pgcrypto extension missing', err);
      return res.status(500).json({ error: 'Database missing pgcrypto extension. Ask admin to run: CREATE EXTENSION IF NOT EXISTS pgcrypto;' });
    }
    console.error('Signup error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  let { email, password } = req.body || {};
  if (typeof email === 'string') email = email.trim().toLowerCase();
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const { rows } = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = uuidv4();
    await pool.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2)', [user.id, token]);
    res.cookie('session_token', token, { httpOnly: true, sameSite: 'lax' });
    return res.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// POST /auth/logout
router.post('/logout', async (req, res) => {
  const token = req.cookies?.session_token;
  if (!token) return res.status(200).json({});
  try {
    await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
    res.clearCookie('session_token');
    return res.json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// GET /auth/me
router.get('/me', async (req, res) => {
  const token = req.cookies?.session_token;
  if (!token) return res.status(200).json({ user: null });
  try {
    const { rows } = await pool.query(
      'SELECT u.id, u.email FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.token = $1',
      [token]
    );
    const user = rows[0] ?? null;
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// Google OAuth start -> redirect user to Google's consent screen
router.get('/google/start', (req, res) => {
  console.log('[auth] google/start requested from', req.ip);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirect = process.env.GOOGLE_REDIRECT_URI || `${process.env.API_BASE || 'http://localhost:5000'}/auth/google/callback`;
  if (!clientId) return res.status(500).send('Google OAuth not configured');
  const state = uuidv4();
  // In a real app you'd store state to validate callback; here we skip for brevity
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
  console.log('[auth] redirecting to google auth url');
  return res.redirect(authUrl);
});

// Google OAuth callback - exchange code for tokens and get userinfo
router.get('/google/callback', async (req, res) => {
  console.log('[auth] google callback hit, query:', { code: req.query.code, state: req.query.state });
  const code = req.query.code;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirect = process.env.GOOGLE_REDIRECT_URI || `${process.env.API_BASE || 'http://localhost:5000'}/auth/google/callback`;
  const frontend = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';
  if (!code || !clientId || !clientSecret) {
    console.error('Missing google oauth params');
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
      console.error('Token exchange failed', ttxt);
      return res.status(502).send('Token exchange failed');
    }
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;
    if (!accessToken) {
      console.error('No access token in token response', tokenJson);
      return res.status(502).send('No access token');
    }
    // Fetch userinfo
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!profileRes.ok) {
      const ptxt = await profileRes.text();
      console.error('Failed to fetch userinfo', ptxt);
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
      // Create a random password hash since the schema requires password_hash
      const randomPwd = uuidv4();
      const hashed = await bcrypt.hash(randomPwd, 12);
      const ins = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, hashed]);
      user = ins.rows[0];
    }

  // Create session token
    const token = uuidv4();
    await pool.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2)', [user.id, token]);
    res.cookie('session_token', token, { httpOnly: true, sameSite: 'lax' });

  console.log('[auth] google sign-in completed for', email, 'user id', user.id);

    // Redirect back to frontend
    return res.redirect(frontend + '/?auth=google');
  } catch (err) {
    console.error('Google callback error', err);
    return res.status(500).send('OAuth callback error');
  }
});

export default router;
