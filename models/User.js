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
    lastSessionDate: { type: Date, default: null },
    streak: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    firebaseUid: { type: String, unique: true, sparse: true },
    followingList: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    password:{type:String, required:false},
},{timestamps:true});

export default mongoose.model('User',userSchema);