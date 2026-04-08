import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name:String,
    email:{type : String, unique:true},
    photo: String,
    firebaseUid: String,
},{timeseries:true});

export default mongoose.model('User',userSchema);