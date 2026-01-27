import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import protectroute from "./middleware/protectroute.middleware.js";
import authRoutes from "./routes/authRoutes.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import connectmongodb from "./Database/db.js";

// ✅ Load environment variables FIRST
dotenv.config();

// ✅ Initialize express AFTER dotenv
const app = express();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Debug Cloudinary config (remove after testing)
console.log("Cloudinary config loaded:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✅ OK" : "❌ Missing",
  api_key: process.env.CLOUDINARY_API_KEY ? "✅ OK" : "❌ Missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ OK" : "❌ Missing",
});

// ✅ Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", protectroute, userRoutes);
app.use("/api/post", protectroute, postRoutes);
app.use("/api/notification", protectroute, notificationRoutes);

// ✅ Test route (optional)
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectmongodb();
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
