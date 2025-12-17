import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js";

// Simple email validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const SignupController = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if username/email exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      fullname,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT and set cookie
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      success: true,
      message: "Successfully created user",
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileimg: newUser.profileimg,
      coverimg: newUser.coverimg,
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({
      message: "Cannot signup",
      success: false,
    });
  }
};
