const app = express();
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {v2 as cloudinary} from "cloudinary"
import protectroute from "./middleware/protectroute.middleware.js"
import authRoutes from "./routes/authRoutes.routes.js";
import post from "./routes/post.routes.js";
import user from "./routes/user.routes.js"
import notification from "./routes/notification.routes.js"
import connectmongodb from "./Database/db.js";
import cookieParser from "cookie-parser";

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET

})



app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies if needed
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/user",protectroute,user)
app.use("/api/post",protectroute,post)
app.use("/api/notification",protectroute,notification);
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectmongodb(); 

    app.listen(PORT, () => {
      console.log(`App is listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

