import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import User from "../models/User";
import Session from "../models/Session";

const router = express.Router();

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, bio, photo } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (photo) user.photo = photo;

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/session", authMiddleware, async (req, res) => {
  try {
    const { minutes } = req.body;

    if (!minutes || minutes <= 0) {
      return res.status(400).json({ message: "Invalid minutes" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const lastDate = user.lastSessionDate
      ? new Date(user.lastSessionDate)
      : null;

    let isNewDay = false;

    if (!lastDate) {
      user.streak = 1;
      isNewDay = true;
    } else {
      lastDate.setUTCHours(0, 0, 0, 0);

      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
        isNewDay = true;
      } else {
        isNewDay = false;
      }
    }

    user.session = (user.session || 0) + 1;
    user.minutes = (user.minutes || 0) + minutes;

    if (isNewDay) {
      user.lastSessionDate = new Date();
    }

    await Session.create({
      user: user._id,
      minutes,
    });

    await user.save();

    return res.json({
      success: true,
      streak: user.streak,
      session: user.session,
      minutes: user.minutes,
      lastSessionDate: user.lastSessionDate,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id }).sort({
      date: -1,
    });

    res.json(sessions);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/stats", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    res.json({
      streak: user.streak,
      session: user.session,
      minutes: user.minutes,
      lastSessionDate: user.lastSessionDate,
    });
});

export default router;
