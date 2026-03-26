import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  id:String,
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

const categorySchema = new mongoose.Schema({
  
    id:{
        type:Number,
        unique:true,
        required:true,
    },
    catname:{
        type:String,
        required:true,
    },
    tracks:[trackSchema],
});

export default mongoose.model("Category", categorySchema);