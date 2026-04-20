import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  token: String,
  expiresAt: Date
});

export default mongoose.model("BlackList", blacklistSchema);