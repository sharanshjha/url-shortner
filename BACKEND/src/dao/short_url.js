import mongoose from "mongoose";

import ShortUrl from "../models/short_url.model.js";

export const saveShortUrl = async ({ shortCode, fullUrl, userId = null, expiresAt = null }) => {
  const newUrl = new ShortUrl({
    fullUrl,
    shortCode,
    expiresAt,
    ...(userId ? { user: userId } : {}),
  });

  await newUrl.save();
  return newUrl;
};

export const findByShortCodeAndTrack = async (shortCode) =>
  ShortUrl.findOneAndUpdate(
    { shortCode },
    {
      $inc: { clicks: 1 },
      $set: { lastVisitedAt: new Date() },
    },
    { new: true },
  );

export const getCustomShortUrl = async (slug) => ShortUrl.findOne({ shortCode: slug });

export const getUserUrlsDao = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const filter = {
    user:
      userId instanceof mongoose.Types.ObjectId
        ? userId
        : new mongoose.Types.ObjectId(userId),
  };

  const [items, total] = await Promise.all([
    ShortUrl.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ShortUrl.countDocuments(filter),
  ]);

  return { items, total };
};

export const deleteUserUrlDao = async (userId, id) =>
  ShortUrl.findOneAndDelete({
    _id: id,
    user: userId,
  });
