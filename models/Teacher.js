import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    imagePublicId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: String,
    expertise: String,
    bio: String,
    session: String,
    students: String,
  },
  { timestamps: true },
);

export default mongoose.model("Teacher", teacherSchema);
