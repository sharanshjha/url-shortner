import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { BadRequestError } from "./errorHandler.js";

const SLUG_REGEX = /^[A-Za-z0-9_-]{4,32}$/;

export const generateNanoId = (length = 7) => nanoid(length);

export const signToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

export const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);

export const getTokenFromRequest = (req) => {
  const cookieToken = req.cookies?.[env.COOKIE_NAME];
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const normalizeLongUrl = (value) => {
  try {
    const parsedUrl = new URL(value);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new BadRequestError("Only HTTP and HTTPS URLs are supported");
    }

    return parsedUrl.toString();
  } catch {
    throw new BadRequestError("Please provide a valid URL");
  }
};

export const normalizeSlug = (value) => value.trim();

export const isSlugValid = (slug) => SLUG_REGEX.test(slug);

export const buildShortUrl = (code) => `${env.APP_URL}/${code}`;
