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

app.listen(PORT,"0.0.0.0", () => {
    console.log("server running 🚀");
});