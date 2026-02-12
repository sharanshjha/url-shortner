import { findUserById } from "../dao/user.dao.js";
import { getTokenFromRequest, verifyToken } from "./helper.js";

export const attachUser = async (req, _res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      next();
      return;
    }

    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);

    if (user) {
      req.user = user;
    }
  } catch {
    // Intentionally swallow optional auth parse failures.
  }

  next();
};
