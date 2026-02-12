import { BadRequestError } from "../utils/errorHandler.js";

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    next(new BadRequestError("Validation failed", result.error.flatten()));
    return;
  }

  req.validated = result.data;
  next();
};
