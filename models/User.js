import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name:{type:String, required:true},
    email:
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    photo: { type: String, default: "" },
    bio: { type: String, default: "" },
    session: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    firebaseUid: { type: String, required: true, unique: true },
},{timestamps:true});

export default mongoose.model('User',userSchema);