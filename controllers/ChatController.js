import Chat from "../models/Chat.js";
import { updateUserActivity } from "../services/activityService.js";
import { runAgent } from "../services/agent/graph.js";


export const chatHandler = async (req, res) =>{

    try {
        
        const {message}= req.body;

        const userId= req.user.id;

        if (!message || !userId) {
            return res.status(400).json({ error: "message and userId required" });
        }

        const result= await runAgent({message,userId});

        const stats= await updateUserActivity({userId,minutes:1});

        // save user message
        await Chat.create({
            userId,
            role:"user",
            content:message,
            emotion:result.emotion,
        });

        // save ai reply
        await Chat.create({
            userId,
            role:"assistant",
            content:result.response,
            emotion:result.emotion,
        });

        res.json({
            reply:result.response,
            suggestion: result.suggestion,
            stats:stats,
        });

    } catch (error) {
        res.status(500).json(error.message);
    }
}