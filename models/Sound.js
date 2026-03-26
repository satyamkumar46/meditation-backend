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
  },
},{
    timestamps:true
});

export default mongoose.model("Track", trackSchema);
