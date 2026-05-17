import mongoose from "mongoose";
import { MONGO_DB_URI } from "./index.js";

const MONGO_URI = `${MONGO_DB_URI}`;


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("bufferCommands", false); 

    cached.promise = mongoose
      .connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      })
      .then((mongoose) => {
        console.log("MongoDB connected..");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        next(err);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
