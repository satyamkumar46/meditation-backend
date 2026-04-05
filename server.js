import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import soundRoutes from "./routes/soundRoutes.js";
import TeacherRoutes from "./routes/TeacherRoutes.js"
import authRoutes from "./routes/authRoutes.js"

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/sounds", soundRoutes);
app.use("/teachers", TeacherRoutes);
app.use("/auth", authRoutes);

const PORT= process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("server running 🚀");
});