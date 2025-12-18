import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.mjs";
import taskRoutes from "./routes/taskRoutes.mjs";
dotenv.config();
import "./config/dbconfig.mjs"

const app = express();


app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})