import { findUserById } from "../dao/user.dao.js";
import { UnauthorizedError } from "../utils/errorHandler.js";
import { getTokenFromRequest, verifyToken } from "../utils/helper.js";

export const authMiddleware = async (req, _res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      throw new UnauthorizedError("Authentication required");
    }

    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error instanceof UnauthorizedError ? error : new UnauthorizedError("Invalid or expired token"));
  }
};
