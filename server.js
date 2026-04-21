import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import soundRoutes from "./routes/soundRoutes.js";
import TeacherRoutes from "./routes/TeacherRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import updateRoutes from "./routes/updateRoutes.js"
import FollowRoutes from "./routes/FollowRoutes.js"
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

connectDB();

const app = express();

app.use(cors({
  origin:true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const limiter= rateLimit({
  windowMs:15*60*1000,
  max:100,
});


app.use(morgan("dev"));
app.use(helmet());
app.use(limiter);

app.use("/sounds", soundRoutes);
app.use("/teachers", TeacherRoutes);
app.use("/auth", authRoutes);
app.use("/user", FollowRoutes);
app.use("/user", updateRoutes);



const PORT= process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("server running 🚀");
});