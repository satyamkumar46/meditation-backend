import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) =>{

    try {
        
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password too short" });
        }

        if (!email.includes("@")) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const existingUser= await User.findOne({email});

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            bio: "",
            session: 0,
            streak: 0,
            following: 0,
            minutes: 0,
        });

        const token= jwt.sign(
            {id:user._id, email:user.email},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        user.password = undefined;

        res.status(201).json({
            success: true,
            token,
            user,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}