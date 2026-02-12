import pino from "pino";
import { createRequire } from "node:module";

import { env } from "../config/env.js";

const require = createRequire(import.meta.url);

const getTransport = () => {
  if (env.NODE_ENV !== "development") {
    return undefined;
  }

  try {
    require.resolve("pino-pretty");
    return pino.transport({
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        singleLine: true,
      },
    });
  } catch {
    return undefined;
  }
};

export const logger = pino(
  {
    level: env.LOG_LEVEL || (env.NODE_ENV === "production" ? "info" : "debug"),
  },
  getTransport(),
);
