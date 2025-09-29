// db.js — connect to MongoDB using mongoose
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/eventdb';
  try {
    await mongoose.connect(uri, {
      // options
    });
    console.log(' MongoDB connected:', uri);
  } catch (err) {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1);
  }
}
