import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router= express.Router();

router.post("/follow/:id", authMiddleware, async(req,res)=>{

    try {
        
        const userToFollow= await User.findById(req.params.id);
        const currentUser= await User.findById(req.user.id);

        if (!userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }

        if(userToFollow._id.toString() === currentUser._id.toString()){
            return res.status(400).json({ message: "You can't follow yourself" });
        }

        if(!currentUser.followingList.some(id => id.toString() === userToFollow._id.toString())){
            currentUser.followingList.push(userToFollow._id);
            currentUser.following = currentUser.followingList.length;

            await currentUser.save();
        }

        res.json({success: true});
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;