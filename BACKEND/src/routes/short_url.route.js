import express from "express";
import { z } from "zod";

import { createShortUrl, deleteUserUrl } from "../controller/short_url.controller.js";
import { getAllUserUrls } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createUrlRateLimiter } from "../middleware/rate-limit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

const objectIdSchema = /^[0-9a-fA-F]{24}$/;

const createSchema = z.object({
  body: z.object({
    url: z.string().trim().url(),
    slug: z.string().trim().min(4).max(32).optional(),
    expiresAt: z.string().datetime({ offset: true }).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const listSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

const deleteSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().regex(objectIdSchema, "Invalid URL id"),
  }),
});

router.post("/", createUrlRateLimiter, validate(createSchema), createShortUrl);
router.get("/me", authMiddleware, validate(listSchema), getAllUserUrls);
router.delete("/:id", authMiddleware, validate(deleteSchema), deleteUserUrl);

export default router;
