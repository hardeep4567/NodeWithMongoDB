// config/dbs.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db = process.env.DATABASE;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

export default connectDB;
