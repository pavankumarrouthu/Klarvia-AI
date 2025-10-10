import express, { Request, Response } from "express";
import { pool } from "./db";

const router = express.Router();

// Users
router.post("/users", async (req: Request, res: Response) => {
  try {
    const { email, name, password_hash } = req.body;
    const result = await pool.query(
      `INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING *`,
      [email, name, password_hash]
    );
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to create user" });
  }
});

router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    res.json(result.rows[0] || null);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to fetch user" });
  }
});

router.patch("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, name, password_hash } = req.body;
    const result = await pool.query(
      `UPDATE users SET email = COALESCE($2,email), name = COALESCE($3,name), password_hash = COALESCE($4,password_hash) WHERE id = $1 RETURNING *`,
      [id, email ?? null, name ?? null, password_hash ?? null]
    );
    res.json(result.rows[0] || null);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to update user" });
  }
});

router.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    res.status(204).end();
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to delete user" });
  }
});

router.get("/users", async (req: Request, res: Response) => {
  const result = await pool.query(`SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT 100`);
  res.json(result.rows);
});

// Contents
router.post("/contents", async (req: Request, res: Response) => {
  try {
    const { user_id, title, body, metadata } = req.body;
    const result = await pool.query(
      `INSERT INTO contents (user_id, title, body, metadata) VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, title, body, metadata || null]
    );
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to create content" });
  }
});

router.get("/contents/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM contents WHERE id = $1`, [id]);
    res.json(result.rows[0] || null);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to fetch content" });
  }
});

router.get("/contents", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM contents ORDER BY created_at DESC LIMIT 100`);
    res.json(result.rows);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to list content" });
  }
});

router.patch("/contents/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, body, metadata } = req.body;
    const result = await pool.query(
      `UPDATE contents SET title = COALESCE($2, title), body = COALESCE($3, body), metadata = COALESCE($4, metadata) WHERE id = $1 RETURNING *`,
      [id, title ?? null, body ?? null, metadata ?? null]
    );
    res.json(result.rows[0] || null);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to update content" });
  }
});

router.delete("/contents/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM contents WHERE id = $1`, [id]);
    res.status(204).end();
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to delete content" });
  }
});

// Files (metadata only)
router.post("/files", async (req: Request, res: Response) => {
  try {
    const { user_id, filename, content_type, size, storage_key, metadata } = req.body;
    const result = await pool.query(
      `INSERT INTO files (user_id, filename, content_type, size, storage_key, metadata) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user_id, filename, content_type, size, storage_key, metadata || null]
    );
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to create file metadata" });
  }
});

router.get("/files/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM files WHERE id = $1`, [id]);
    res.json(result.rows[0] || null);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to fetch file metadata" });
  }
});

router.get("/files", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM files ORDER BY created_at DESC LIMIT 100`);
    res.json(result.rows);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to list files" });
  }
});

router.patch("/files/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { filename, content_type, size, storage_key, metadata } = req.body;
    const result = await pool.query(
      `UPDATE files SET filename = COALESCE($2, filename), content_type = COALESCE($3, content_type), size = COALESCE($4, size), storage_key = COALESCE($5, storage_key), metadata = COALESCE($6, metadata) WHERE id = $1 RETURNING *`,
      [id, filename ?? null, content_type ?? null, size ?? null, storage_key ?? null, metadata ?? null]
    );
    res.json(result.rows[0] || null);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to update file metadata" });
  }
});

router.delete("/files/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM files WHERE id = $1`, [id]);
    res.status(204).end();
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to delete file metadata" });
  }
});

// Sessions
router.post("/sessions", async (req: Request, res: Response) => {
  const { user_id, token, expires_at } = req.body;
  const result = await pool.query(
    `INSERT INTO sessions (user_id, token, expires_at) VALUES ($1,$2,$3) RETURNING *`,
    [user_id, token, expires_at || null]
  );
  res.json(result.rows[0]);
});

router.get("/sessions/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query(`SELECT * FROM sessions WHERE id = $1`, [id]);
  res.json(result.rows[0] || null);
});

router.get("/sessions", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM sessions ORDER BY created_at DESC LIMIT 100`);
    res.json(result.rows);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to list sessions" });
  }
});

router.delete("/sessions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM sessions WHERE id = $1`, [id]);
    res.status(204).end();
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to delete session" });
  }
});

export default router;
