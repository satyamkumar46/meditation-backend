import express from "express";
import { chatHandler } from "../controllers/ChatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", authMiddleware ,chatHandler);

export default router;
