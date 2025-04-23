import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from "./lib/db.js";
import taskRoutes from './routes/taskRoutes.js';
import cors from "cors";
// import redis from './lib/redis.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(cors());

// Routes
app.use('/api/tasks', taskRoutes);

// app.get('/api/redis-test', async (req, res) => {
//   try {
//     await redis.set('test-key', 'Redis is working!', 'EX', 60); // 60 sec expiry
//     const value = await redis.get('test-key');
//     res.json({ message: value });
//   } catch (error) {
//     res.status(500).json({ error: 'Redis not working', details: error.message });
//   }
// });

// Connect to MongoDB and start the server
app.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});

