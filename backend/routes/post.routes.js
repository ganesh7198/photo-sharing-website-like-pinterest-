import express from "express";

import { commentpost, createPost, deletepost, getAllPostsByUser, getfollowingpost, getuserpost, likedbyuser, likePost } from "../controllers/post.controller.js";

const router=express.Router();

router.post("/create-post",createPost)
router.delete("/delete-post/:id",deletepost)
router.post("/like-post/:id",likePost)
router.get("/get-user-post/:username",getuserpost)
router.get("/liked-post/:id",likedbyuser)
router.post("/comment-post/:postid",commentpost)
router.get( "/posts", getAllPostsByUser);
router.get("/get-following-post",getfollowingpost);

export default router;