import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing in .env.local");
}

// Global cache (agar tidak connect berulang kali saat development)
declare global {
  var mongooseCache: mongoose.Connection | null | undefined;
}

export const connectDB = async () => {
  try {
    if (global.mongooseCache) {
      return global.mongooseCache;
    }

    const conn = await mongoose.connect(MONGODB_URI);

    global.mongooseCache = conn.connection;
    console.log("✅ MongoDB connected");

    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
