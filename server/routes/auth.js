import express from 'express';
import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

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

export default router;
