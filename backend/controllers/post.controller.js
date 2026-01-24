import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js"; 
import {v2 as cloudinary} from "cloudinary";

export const createPost = async (req, res) => {
	try{
   const {img,text}=req.body;
   const id=req.user.id;
   if(!img || !text){
	   return res.status(400).json({message:"img and text is required"});
   }
   let cloudurl="";
   if(img){
	try{
	const cloudimg= await cloudinary.uploader.upload(img);
	   cloudurl= cloudimg.secure_url;
	}catch(error){
		return res.status(400).json({message:"error in uploading img "});
	}
   }
   const post=new Post({
	user:id,
	text:text,
	img:cloudurl,
	})
	  await  post.save();
	res.status(201).json({meassage:"post created sucessfully",data:post});
}catch(error){
	res.status(500).json({meassage:"internal server error"});
}

};

export const deletepost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ownership check
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // delete image from cloudinary if exists
    if (post.img) {
      const imgid = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgid);
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // post ID
    const userid = req.user._id; // logged-in user ID

    // Find the post by ID
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ✅ Correct check: is this user already in likes array?
    const isLiked = post.likes.includes(userid);

    if (isLiked) {
      // Remove like
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $pull: { likes: userid } },
        { new: true }
      );

      await User.findByIdAndUpdate(userid, { $pull: { likedpost: id } }, { new: true });

      // Delete notification
      await Notification.findOneAndDelete({
        from: userid,
        to: post.user,
        type: "like",
      });

      return res.status(200).json(updatedPost);
    } else {
      // Add like
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $push: { likes: userid } },
        { new: true }
      );

      await User.findByIdAndUpdate(userid, { $push: { likedpost: id } }, { new: true });

      // Create notification
      const notification = new Notification({
        from: userid,
        to: post.user,
        type: "like",
      });
      await notification.save();

      return res.status(200).json(updatedPost);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const  commentpost=async(req,res)=>{
    try{
      const {postid}=req.params;
	  const {text}=req.body;
	  const id=req.user._id;
	  const user=await User.findById(id);
	  if(!user){
		return res.status(404).json({message:"user is not found "});
	  }
	  if (!text || text.trim() === ""){
		return res.status(400).json({message:"please provide the text first"});
	  }
	  const post= await Post.findById(postid);
	  if(!post){
		return res.status(404).json({meassage:"post is not found"});
	  }
       const comment ={
		text,
		user:id
	   }

	   await post.comment.push(comment);
	   const commentvalue=await post.save();
        res.status(201).json(post);
	 


	}catch(error){
       res.status(500).json({message:"internal server error"})
	}
}

export const getAllPostsByUser = async (req, res) => {
  try {
     

    // Find all posts created by the specific user
    const posts = await Post.find().sort({createdAt:-1}).populate({path:"user",select:"-password"}).populate({
      path:"comment.user",
      select:"-password"
    });
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found " });
    }

    // Send back the posts
    return res.status(200).json({posts:posts});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const likedbyuser = async (req, res) => {
  try {
    const {id} = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedPosts = await Post.find({
      _id: { $in: user.likedpost } // ✅ correct
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user", // ✅ correct path
        select: "-password",
      });

    res.status(200).json(likedPosts);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
 
export const getfollowingpost = async (req, res) => {
  try {
    const id = req.user.id; // ✅ correct extraction

    // ✅ await is REQUIRED
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingList = user.following;

    // If user follows no one
    if (followingList.length === 0) {
      return res.status(200).json({meassage:"no following "});
    }

    // ✅ sort & populate MUST be chained on query
    const posts = await Post.find({
      user: { $in: followingList },
    })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comment.user", "-password");

    res.status(200).json(posts);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getuserpost = async (req, res) => {
  try {
    const { username } = req.params;

    // ❗ use findOne, not find
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", "-password");

    res.status(200).json(posts);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
