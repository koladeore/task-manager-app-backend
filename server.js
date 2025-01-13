import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from "./lib/db.js";
import taskRoutes from './routes/taskRoutes.js';
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-manager-app-frontend-xxbs.vercel.app"
    ],
    credentials: true,
  })
);

// Routes
app.use('/api/tasks', taskRoutes);

// Connect to MongoDB and start the server
app.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});

