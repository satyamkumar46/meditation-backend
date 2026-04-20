import BlackList from "../models/BlackList";
import jwt from "jsonwebtoken";

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];

    if (!token) return res.status(400).json({ message: "No token" });

    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
        return res.status(400).json({ message: "Invalid token" });
    }

    await BlackList.create({
      token,
      expiresAt: new Date(decoded.exp * 1000)
    });

    res.json({ message: "Logged out successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};