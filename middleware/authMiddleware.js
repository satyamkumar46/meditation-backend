import jwt from "jsonwebtoken";
import BlackList from "../models/BlackList";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split("Bearer ")[1];

  const isBlackListed= await BlackList.findOne({token});

  if (isBlackListed) {
    return res.status(401).json({ message: "Token expired" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
        return res.status(400).json({ message: "Invalid token data" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
