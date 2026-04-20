import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });

      if (!email.includes("@")) {
        return res.status(400).json({ message: "Invalid email" });
      }
  
      if (!user || !user.password) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password too short" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      user.password = undefined;
  
      res.json({
        success: true,
        token,
        user,
      });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };