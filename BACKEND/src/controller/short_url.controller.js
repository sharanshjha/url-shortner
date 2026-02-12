import {
  createShortUrlService,
  deleteUserUrlService,
  resolveRedirectTarget,
} from "../services/short_url.service.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

export const createShortUrl = wrapAsync(async (req, res) => {
  const payload = req.validated?.body ?? req.body;

  const result = await createShortUrlService({
    url: payload.url,
    slug: payload.slug,
    expiresAt: payload.expiresAt,
    userId: req.user?._id?.toString() || null,
  });

  res.status(201).json({
    message: "Short URL created",
    ...result,
  });
});

export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const target = await resolveRedirectTarget(id);

  res.redirect(302, target);
});

export const deleteUserUrl = wrapAsync(async (req, res) => {
  const { id } = req.validated?.params ?? req.params;

  await deleteUserUrlService(req.user._id, id);

  res.status(200).json({
    message: "Short URL deleted",
  });
});
