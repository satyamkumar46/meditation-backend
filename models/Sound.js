import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  id:Number,
  title: String,
  audioUrl: String,
  thumbnail: String,
  durationInSec: Number,
  duration: String,

  teacher:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Teacher",
    required:true,
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
    required:true,
  },
},{
    timestamps:true
});

// const soundSchema = new mongoose.Schema(
//   {
//     id:{
//         type:Number,
//         required:true,
//     },
//     category: {
//       type: String,
//       required: true,
//     },
//     tracks: [trackSchema],
//   },
//   { timestamps: true },
// );

// const Sound = mongoose.model("Track", trackSchema);

export default mongoose.model("Track", trackSchema);
