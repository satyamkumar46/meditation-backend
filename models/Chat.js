import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
        type: String,
    },
    emotion: {
        type:String,
    },
    metadata:{
        type: Object,
    }
  },
  { timestamps: true },
);

export default mongoose.model("Chat", chatSchema);
