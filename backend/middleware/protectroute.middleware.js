import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectroute = async (req, res, next) => {
  try {
    // ✅ get token from request cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: please login first",
      });
    }

    // ✅ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ get user from DB
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: user not found",
      });
    }

    // ✅ attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: invalid or expired token",
    });
    
  }
};
