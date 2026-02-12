import http from "node:http";
import mongoose from "mongoose";

import createApp from "./src/app.js";
import connectDB from "./src/config/mongo.config.js";
import { env } from "./src/config/env.js";
import { logger } from "./src/lib/logger.js";

const app = createApp();
const server = http.createServer(app);

const shutdown = (signal) => {
  logger.warn({ signal }, "Shutdown signal received");

  server.close(async (error) => {
    if (error) {
      logger.error({ err: error }, "Error while closing HTTP server");
    }

    try {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed");
    } catch (dbError) {
      logger.error({ err: dbError }, "Error while closing MongoDB connection");
    }

    process.exit(error ? 1 : 0);
  });

  setTimeout(() => {
    logger.error("Forced shutdown due to timeout");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled promise rejection");
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Uncaught exception");
  shutdown("uncaughtException");
});

const start = async () => {
  await connectDB();

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, "Server started");
  });
};

start().catch((error) => {
  logger.fatal({ err: error }, "Failed to start server");
  process.exit(1);
});
