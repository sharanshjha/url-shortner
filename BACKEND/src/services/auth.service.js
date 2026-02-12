import { createUser, findUserByEmail } from "../dao/user.dao.js";
import { ConflictError, UnauthorizedError } from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";

export const registerUser = async (name, email, password) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ConflictError("An account with this email already exists");
  }

  const user = await createUser(name, email, password);
  const token = signToken({ id: user._id.toString() });

  return {
    token,
    user: user.toJSON(),
  };
};

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email, { includePassword: true });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = signToken({ id: user._id.toString() });

  return {
    token,
    user: user.toJSON(),
  };
};
