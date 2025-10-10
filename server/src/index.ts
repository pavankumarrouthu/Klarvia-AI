import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";
import routes from "./routes";
import authRoutes from "./authRoutes";
import dbInspectorRoutes from "./dbInspectorRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/db-inspector", dbInspectorRoutes);

app.get("/health", async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    res.json({ status: "ok" });
  } catch (err) {
    console.error("/health check failed:", err);
    res.status(500).json({ status: "error", error: String(err) });
  }
});

// Basic error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
