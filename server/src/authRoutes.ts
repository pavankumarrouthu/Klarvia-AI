import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { createUser, findUserByEmail, verifyPassword, signToken, authMiddleware, findUserById, createPasswordResetToken, verifyPasswordResetToken, updateUserPassword } from "./auth";
import { sendPasswordResetEmail } from "./email";

const router = Router();

const limiter = rateLimit({ windowMs: 60_000, max: 20 });
router.use(limiter);

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: "email already registered" });
    const user = await createUser(email, name ?? null, password);
    const token = signToken({ user_id: user.id });
    const u = await findUserById(user.id);
    res.json({ token, user: u });
  } catch (e: any) {
    console.error("/auth/signup error:", e);
    res.status(400).json({ error: e?.message || "failed to sign up" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    const user = await findUserByEmail(email);
    if (!user || !user.password_hash) return res.status(401).json({ error: "invalid credentials" });
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });
    const token = signToken({ user_id: user.id });
    const u = await findUserById(user.id);
    res.json({ token, user: u });
  } catch (e: any) {
    console.error("/auth/login error:", e);
    res.status(400).json({ error: e?.message || "failed to login" });
  }
});

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id as string;
  const user = await findUserById(user_id);
  res.json({ user });
});

// Route to request a password reset
router.post("/request-password-reset", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await findUserByEmail(email);
    if (user) {
      // User found. Create a reset token and send the email.
      const resetToken = await createPasswordResetToken(user.id);
      await sendPasswordResetEmail(user.email, resetToken);
    }
    // Always return a success message to prevent user enumeration attacks.
    res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
  } catch (e: any) {
    console.error("Failed to request password reset:", e);
    // Generic error message
    res.status(500).json({ error: "An internal error occurred." });
  }
});

// Route to reset the password with a valid token
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: "Token and new password are required." });
    }

    const userId = await verifyPasswordResetToken(token);
    if (!userId) {
      return res.status(400).json({ error: "Invalid or expired password reset token." });
    }

    await updateUserPassword(userId, password);

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (e: any) {
    console.error("Failed to reset password:", e);
    res.status(500).json({ error: "An internal error occurred." });
  }
});

export default router;
