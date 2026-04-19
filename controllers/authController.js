import admin from "../config/firebase.js";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'


export const googleAuth= async (req, res) =>{

    try {
        // get token from frontend
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        
        const token = authHeader.split("Bearer ")[1];
        

        // verify firebase token
        const decoded= await admin.auth().verifyIdToken(token);

        const name = decoded.name || decoded.email.split("@")[0];
        const email = decoded.email;
        const picture = decoded.picture || "";
       const uid = decoded.uid;

       if (!email) {
        return res.status(400).json({ message: "Email not found" });
      }

        // Check if user exists
        let user= await User.findOne({firebaseUid:uid});

        let isNewUser=false;

        if(!user){

            user= await User.create({
                name,
                email,
                photo:picture,
                firebaseUid:uid,
                bio: "",
                session: 0,
                streak: 0,
                following: 0,
                minutes: 0,
            });
            isNewUser=true;
        }
        else{
            user.name = name;
            user.photo = picture;
            await user.save();
        }

        const appToken= jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );

        res.json({
            success: true,
            token:appToken,
            user,
            isNewUser,
        });


    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}