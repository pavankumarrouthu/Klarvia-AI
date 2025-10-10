import bcrypt from "bcrypt";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { pool } from "./db";

const JWT_SECRET: Secret = (process.env.JWT_SECRET as Secret) || "dev_secret_change_me";
const TOKEN_TTL: jwt.SignOptions["expiresIn"] = (process.env.JWT_TTL as any) || "7d";

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { user_id: string }) {
  const opts: SignOptions = { expiresIn: TOKEN_TTL };
  return jwt.sign(payload, JWT_SECRET, opts);
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  const token = auth.slice("Bearer ".length);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { user_id: string; iat: number; exp: number };
    (req as any).user_id = decoded.user_id;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export async function createUser(email: string, name: string | null, password: string) {
  const password_hash = await hashPassword(password);
  const result = await pool.query(
    `INSERT INTO users (email, name, password_hash) VALUES ($1,$2,$3) RETURNING *`,
    [email, name, password_hash]
  );
  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0] || null;
}

export async function findUserById(id: string) {
  const result = await pool.query(`SELECT id, email, name, created_at FROM users WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

/**
 * Creates a password reset token for a user.
 * @param userId The ID of the user.
 * @returns The plaintext token to be sent to the user.
 */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  // Invalidate previous tokens for this user
  await pool.query(`DELETE FROM password_reset_tokens WHERE user_id = $1`, [userId]);

  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  return token;
}

/**
 * Verifies a password reset token and returns the user ID if valid.
 * @param token The plaintext token from the user.
 * @returns The user ID, or null if the token is invalid or expired.
 */
export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  if (!token) return null;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const { rows } = await pool.query(
    `SELECT user_id, expires_at FROM password_reset_tokens WHERE token_hash = $1`,
    [tokenHash]
  );

  if (rows.length === 0) {
    return null;
  }

  const resetRequest = rows[0];

  if (new Date() > new Date(resetRequest.expires_at)) {
    // Token has expired, clean it up
    await pool.query(`DELETE FROM password_reset_tokens WHERE token_hash = $1`, [tokenHash]);
    return null;
  }

  return resetRequest.user_id;
}

/**
 * Updates a user's password and invalidates any active reset tokens.
 * @param userId The ID of the user.
 * @param newPassword The new plaintext password.
 */
export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  const passwordHash = await hashPassword(newPassword);
  await pool.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [passwordHash, userId]
  );
  // Invalidate all reset tokens for this user after successful password change
  await pool.query(`DELETE FROM password_reset_tokens WHERE user_id = $1`, [userId]);
}
