import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import soundRoutes from "./routes/soundRoutes.js";
import TeacherRoutes from "./routes/TeacherRoutes.js"


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/sounds", soundRoutes);
app.use("/api/teachers", TeacherRoutes);

const PORT= process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});