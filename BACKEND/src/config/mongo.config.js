import mongoose from "mongoose";

import { env } from "./env.js";
import { logger } from "../lib/logger.js";

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGO_URI);

  logger.info({ host: mongoose.connection.host }, "MongoDB connected");
};

export default connectDB;
