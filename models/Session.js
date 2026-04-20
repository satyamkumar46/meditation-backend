import mongoose from "mongoose";

const sessionSchema= new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    minutes:{
        type:Number,
        required:true,
        default:0,
    },
    date:{
        type:Date,
        required:true,
        default:Date.now,
    },  
},{timestamps:true});

export default mongoose.model("Session", sessionSchema);