import {
  deleteUserUrlDao,
  findByShortCodeAndTrack,
  getCustomShortUrl,
  getUserUrlsDao,
  saveShortUrl,
} from "../dao/short_url.js";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../utils/errorHandler.js";
import { buildShortUrl, generateNanoId, isSlugValid, normalizeLongUrl, normalizeSlug } from "../utils/helper.js";

const MAX_GENERATION_ATTEMPTS = 6;

const resolveShortCode = async (slug) => {
  if (slug) {
    const normalizedSlug = normalizeSlug(slug);

    if (!isSlugValid(normalizedSlug)) {
      throw new BadRequestError("Custom slug must be 4-32 characters and only include letters, numbers, _ or -");
    }

    const existingSlug = await getCustomShortUrl(normalizedSlug);

    if (existingSlug) {
      throw new ConflictError("This custom slug is already taken");
    }

    return normalizedSlug;
  }

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const generated = generateNanoId(7);
    const existingSlug = await getCustomShortUrl(generated);

    if (!existingSlug) {
      return generated;
    }
  }

  throw new ConflictError("Could not generate a unique short code. Please retry.");
};

export const createShortUrlService = async ({ url, userId = null, slug = null, expiresAt = null }) => {
  if (slug && !userId) {
    throw new UnauthorizedError("Login is required to create a custom slug");
  }

  const normalizedUrl = normalizeLongUrl(url);
  const shortCode = await resolveShortCode(slug);

  let parsedExpiry = null;
  if (expiresAt) {
    const candidate = new Date(expiresAt);

    if (Number.isNaN(candidate.getTime()) || candidate <= new Date()) {
      throw new BadRequestError("expiresAt must be a valid future date");
    }

    parsedExpiry = candidate;
  }

  const createdUrl = await saveShortUrl({
    shortCode,
    fullUrl: normalizedUrl,
    userId,
    expiresAt: parsedExpiry,
  });

  return {
    id: createdUrl._id,
    fullUrl: createdUrl.fullUrl,
    shortCode: createdUrl.shortCode,
    shortUrl: buildShortUrl(createdUrl.shortCode),
    clicks: createdUrl.clicks,
    createdAt: createdUrl.createdAt,
  };
};

export const resolveRedirectTarget = async (shortCode) => {
  const url = await findByShortCodeAndTrack(shortCode);

  if (!url) {
    throw new NotFoundError("Short URL not found");
  }

  if (url.expiresAt && url.expiresAt <= new Date()) {
    throw new NotFoundError("This short URL has expired");
  }

  return url.fullUrl;
};

export const getUserUrlsService = async (userId, page = 1, limit = 20) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

  const { items, total } = await getUserUrlsDao(userId, safePage, safeLimit);

  return {
    urls: items,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

export const deleteUserUrlService = async (userId, id) => {
  const deleted = await deleteUserUrlDao(userId, id);

  if (!deleted) {
    throw new NotFoundError("URL not found or you do not have access to it");
  }

  return deleted;
};
