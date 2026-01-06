import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js";

export const LoginController=async(req,res)=>{
  try{
    const {username,password}=req.body;
    const user= await User.findOne({username});
    const ispasswordcorrect= await bcrypt.compare(password,user?.password || "");
    if(!user || !ispasswordcorrect){
       return res.status(404).json({message:"user is not found "})
    }
    generateTokenAndSetCookie(user._id,res);
    res.status(201).json({
      sucess:true,
      message:"sucessfull login welcome to our website",
      _id:user._id,
      usename:user.username,
    })
}catch(error){
     console.log("error in the login controller ",error.message)
     res.status(500).json({
      success:false,
      message:"error in login controller internal server error"
     })
  }
}


export const LogoutController=async(req,res)=>{
  try{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({
          sucess:true,
          message:"logout sucessfully",
      })
  }catch(error){
    console.log(error)
      res.status(500).json({
        sucess:false,
        message:"failed in logout controller "
      })
  }
}


export const SingupController = async (req, res) => {
   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
   if(password.length <6){
      res.status(400).json({message:"password length should be greater than 6"})
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
    generateTokenAndSetCookie(newUser._id,res);



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


export const getme=async(req,res)=> {
  try{
    const user=await User.findById(req.user._id).select("-password")
    res.status(201).json(user);


  }catch(error){
   res.status(500).json({
    message:"eroor in the getme"
   })
  }
}
