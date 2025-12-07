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
      console.log("MongoDB already connected (cached)");
      return global.mongooseCache;
    }

    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000,
    });

    global.mongooseCache = conn.connection;
    console.log("✅ MongoDB connected");

    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);

    // Log detailed error info
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
    }

    // Clear cache on error
    global.mongooseCache = null;

    throw new Error("Failed to connect to MongoDB");
  }
};
