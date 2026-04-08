import admin from "../config/firebase.js";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'


export const googleAuth= async (req, res) =>{

    try {
        // get token from frontend
        const token = req.headers.authorization.split('Bearer ')[1];
        console.log(req.headers.authorization);

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // verify firebase token
        const decoded= await admin.auth().verifyIdToken(token);

        const {email, name, picture, uid}= decoded;

        // Check if user exists
        let user= await User.findOne({email});

        let isNewUser=false;

        if(!user){

            user= await User.create({
                name,
                email,
                photo:picture,
                firebaseUid:uid,
            });
            isNewUser=true;
        }

        const appToken= jwt.sign(
            {id: user._id},
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
        res.status(401).json({ error: 'Unauthorized' });
    }
}