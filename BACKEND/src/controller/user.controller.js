import { getUserUrlsService } from "../services/short_url.service.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

export const getAllUserUrls = wrapAsync(async (req, res) => {
  const { page, limit } = req.validated?.query ?? req.query;
  const result = await getUserUrlsService(req.user._id, page, limit);

  res.status(200).json({
    message: "User URLs fetched",
    ...result,
  });
});
