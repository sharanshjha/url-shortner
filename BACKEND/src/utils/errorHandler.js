import { logger } from "../lib/logger.js";

export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details = null) {
    super(message, 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict occurred", details = null) {
    super(message, 409, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details = null) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details = null) {
    super(message, 401, details);
  }
}

export const notFoundHandler = (req, _res, next) => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;

  logger.error(
    {
      err,
      request: {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
      },
    },
    "Request failed",
  );

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    details: err.details || undefined,
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
};
