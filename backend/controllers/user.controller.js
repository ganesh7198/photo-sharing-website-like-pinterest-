import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";

export const getuserprofile=async(req,res)=>{
   const {username}=req.params;
   try{
	const user=await User.findOne({username}).select("-password");
	if(!user){
		return  res.status(404).json({
			message:"user not found "
		})
	}
	res.status(201).json(user)

   }catch(error){
	console.log("eroor inside the usercontroller js",error)
      res.status(500).json({
		message:"internal server error"
	  })
   }
}
export const followunfollowuser=async(req,res)=>{
   try{
	const {id}=req.params
	const usertomodify=await User.findById(id)
	const currentuser= await User.findById(req.user._id)
	if(usertomodify._id==currentuser._id){
		res.status(404).json({message:"cannot follow yourself"})
	}
	const isfollowing = currentuser.following.includes(id);
	if(isfollowing){
		await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
		await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
		res.status(200).json({message:"unfollow sucessfully"})
	}
	if(!isfollowing){
		await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
		await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});
		const notification=new Notification({
              type:"follow",
			  from:req.user._id,
			  to:id
		})
		await notification.save();
		// return the id of the user as response
		res.status(200).json({message:"follow sccuessfully"});
	}

   }catch(error){
	console.log("eroor inside the usercontroller js",error)
      res.status(500).json({
		message:"internal server error"
	  })
   }
}
export const updateuserprofile = async (req, res) => {
  try {
    const { fullname, email, username, currentpassword, newpassword, bio, link } = req.body;
    let { profileimg, coverimg } = req.body;

    const userid = req.user._id;
    let user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Password update
    if ((currentpassword && !newpassword) || (!currentpassword && newpassword)) {
      return res.status(400).json({
        message: "Both current password and new password are required",
      });
    }

    if (currentpassword && newpassword) {
      const ismatch = await bcrypt.compare(currentpassword, user.password);
      if (!ismatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      if (newpassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newpassword, salt);
    }

    // 🖼️ Profile image
    if (profileimg) {
      if (user.profileimg) {
        await cloudinary.uploader.destroy(
          user.profileimg.split("/").pop().split(".")[0]
        );
      }
      const imgRes = await cloudinary.uploader.upload(profileimg);
      user.profileimg = imgRes.secure_url;
    }

    // 🖼️ Cover image
    if (coverimg) {
      if (user.coverimg) {
        await cloudinary.uploader.destroy(
          user.coverimg.split("/").pop().split(".")[0]
        );
      }
      const coverRes = await cloudinary.uploader.upload(coverimg);
      user.coverimg = coverRes.secure_url;
    }

    // 🧾 Update other fields
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    await user.save();
    user.password = undefined;

    return res.status(200).json(user);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSuggestedusername = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get users followed by current user
    const userFollowedByMe = await User
      .findById(userId)
      .select("following");

    // Get random users except current user
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId } // ✅ fixed
        }
      },
      {
        $sample: { size: 10 }
      }
    ]);

    // Filter out users already followed
    const filteredUsers = users.filter(
      (u) => !userFollowedByMe.following.includes(u._id)
    );

    return res.status(200).json(filteredUsers);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
