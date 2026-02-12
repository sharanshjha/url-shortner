import rateLimit from "express-rate-limit";

const createLimiter = (options) =>
  rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    ...options,
  });

export const apiRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    message: "Too many requests from this IP. Please try again later.",
  },
});

export const authRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    message: "Too many auth attempts. Please wait and try again.",
  },
});

export const createUrlRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: {
    message: "URL creation rate limit exceeded. Please try again later.",
  },
});
