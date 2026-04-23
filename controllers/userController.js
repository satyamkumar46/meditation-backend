import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import streamifier from "streamifier";

export const updateProfile = async(req, res) =>{

    try {
        const { name, bio} = req.body;
        const file= req.file;
    
        const user = await User.findById(req.user.id);
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if(file){

            if(user.photo){
                const publicId= user.photo.split("/").pop().split(".")[0];

                await cloudinary.uploader.destroy(`profile_image/${publicId}`);
            }

            const streamUpload= async (buffer) =>{

                new Promise((resolve, reject) =>{
                    const stream= cloudinary.uploader.upload_stream(
                        {folder:"profile_image",
                            transformation:[
                                { width: 500, height: 500, crop: "fill" },
                                { quality: "auto" },
                            ],
                        },
                     (error, result) =>{
                        if(result) resolve(result);
                        else reject(error);
                    }
                    );
                    streamifier.createReadStream(buffer).pipe(stream);
                });

                const result= await streamUpload(file.buffer);

                user.photo= result.secure_url;
            }
        }
    
        if (name && name.trim() !== "") {
            user.name = name;
        }
      
        if (bio && bio.trim() !== "") {
            user.bio = bio.toUpperCase();
        }
    
        await user.save();
    
        res.json({
          success: true,
          user,
        });
      } catch (error) {
        return res.status(500).json({ message: "Server error" });
      }
}

export const toggleFollow = async (req, res) => {
    try {
      const userId = req.user.id;
      const { teacherId } = req.body;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const alreadyFollowing = user.followingList.includes(teacherId);
  
      if (alreadyFollowing) {
        user.followingList = user.followingList.filter(
          (id) => id.toString() !== teacherId
        );
        user.following -= 1;
      } else {
        user.followingList.push(teacherId);
        user.following += 1;
      }
  
      await user.save();
  
      res.status(200).json({
        message: alreadyFollowing ? "Unfollowed" : "Followed",
        following: user.following,
        followingList: user.followingList,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };