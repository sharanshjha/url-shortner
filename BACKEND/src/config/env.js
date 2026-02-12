import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env", quiet: true });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_NAME: z.string().default("accessToken"),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  COOKIE_SECURE: z.enum(["true", "false"]).optional(),
  COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(1000 * 60 * 60 * 24 * 7),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  TRUST_PROXY: z.coerce.number().int().min(0).default(1),
  LOG_LEVEL: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // Keep this plain so startup failures are obvious even without logger init.
  console.error("Invalid environment configuration:", parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

const rawEnv = parsedEnv.data;
const appUrl = rawEnv.APP_URL.replace(/\/+$/, "");
const allowedOrigins = rawEnv.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const cookieSecure =
  rawEnv.COOKIE_SECURE === undefined
    ? rawEnv.NODE_ENV === "production"
    : rawEnv.COOKIE_SECURE === "true";

export const env = {
  ...rawEnv,
  APP_URL: appUrl,
  ALLOWED_ORIGINS: allowedOrigins,
  COOKIE_SECURE: cookieSecure,
};

export const cookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAME_SITE,
  maxAge: env.COOKIE_MAX_AGE_MS,
  path: "/",
};
