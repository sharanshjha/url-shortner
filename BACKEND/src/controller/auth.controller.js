import { cookieOptions, env } from "../config/env.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

export const register_user = wrapAsync(async (req, res) => {
  const payload = req.validated?.body ?? req.body;
  const { token, user } = await registerUser(payload.name, payload.email, payload.password);

  res.cookie(env.COOKIE_NAME, token, cookieOptions);
  res.status(201).json({
    message: "Registration successful",
    user,
  });
});

export const login_user = wrapAsync(async (req, res) => {
  const payload = req.validated?.body ?? req.body;
  const { token, user } = await loginUser(payload.email, payload.password);

  res.cookie(env.COOKIE_NAME, token, cookieOptions);
  res.status(200).json({
    message: "Login successful",
    user,
  });
});

export const logout_user = wrapAsync(async (_req, res) => {
  res.clearCookie(env.COOKIE_NAME, {
    ...cookieOptions,
    maxAge: 0,
  });

  res.status(200).json({
    message: "Logout successful",
  });
});

export const get_current_user = wrapAsync(async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});
