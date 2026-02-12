import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import pinoHttp from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { apiRateLimiter } from "./middleware/rate-limit.middleware.js";
import { sanitizeRequest } from "./middleware/sanitize.middleware.js";
import { attachUser } from "./utils/attachUser.js";
import { errorHandler, notFoundHandler } from "./utils/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";
import shortUrlRoutes from "./routes/short_url.route.js";
import userRoutes from "./routes/user.routes.js";
import { redirectFromShortUrl } from "./controller/short_url.controller.js";

const isTrustedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (env.ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true;
    }

    if (hostname.endsWith(".netlify.app") || hostname.endsWith(".onrender.com")) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
};

const buildCorsOptions = () => ({
  credentials: true,
  origin: (origin, callback) => {
    if (isTrustedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  optionsSuccessStatus: 200,
});

const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", env.TRUST_PROXY);

  app.use(
    pinoHttp({
      logger,
      autoLogging: env.NODE_ENV !== "test",
    }),
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(cors(buildCorsOptions()));
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));
  app.use(cookieParser());
  app.use(sanitizeRequest);
  app.use(hpp());
  app.use(compression());

  app.get("/", (_req, res) => {
    res.status(200).json({
      name: "URL Shortener API",
      status: "ok",
      docs: "/api/v1/health",
    });
  });

  app.use("/api", apiRateLimiter);
  app.use(attachUser);

  app.use("/api/v1/health", healthRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/urls", shortUrlRoutes);
  app.use("/api/v1/user", userRoutes);

  app.get("/:id", redirectFromShortUrl);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
