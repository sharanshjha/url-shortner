import express from "express";
import mongoose from "mongoose";

import { env } from "../config/env.js";

const router = express.Router();

router.get("/", (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "up" : "down";

  res.status(200).json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: dbStatus,
  });
});

export default router;
