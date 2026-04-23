import express from 'express';
import { googleAuth } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { signup } from '../controllers/SignUp.js';
import { logout } from '../controllers/LogOut.js';
import { login } from '../controllers/Login.js';

const router = express.Router();

router.post('/firebase', googleAuth);
router.get('/profile', authMiddleware, async(req, res) =>{
    
    try {
        const user= await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success:true,
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

router.post("/signup",signup);
router.post("/logout", authMiddleware ,logout);
router.post("/login",login);

export default router;