import express from 'express';
import { googleAuth } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/firebase', googleAuth);
router.get('/me', authMiddleware, async(req, res) =>{
    
    try {
        const user= await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;