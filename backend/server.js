import dotenv from "dotenv";
dotenv.config();
import express from "express";
import {v2 as cloudinary} from "cloudinary"
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET

})
import authRoutes from "./routes/authRoutes.routes.js";
import user from "./routes/user.routes.js"
import connectmongodb from "./Database/db.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/user",user)
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

