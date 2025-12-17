import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/authRoutes.routes.js";
import connectmongodb from "./Database/db.js";
const app = express();
app.use(express.json());


app.use("/api/auth", authRoutes);





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

