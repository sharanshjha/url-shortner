import express from "express";
import { z } from "zod";

import {
  get_current_user,
  login_user,
  logout_user,
  register_user,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rate-limit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

router.post("/register", authRateLimiter, validate(registerSchema), register_user);
router.post("/login", authRateLimiter, validate(loginSchema), login_user);
router.post("/logout", logout_user);
router.get("/me", authMiddleware, get_current_user);

export default router;
