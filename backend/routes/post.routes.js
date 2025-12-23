import express from "express";
import { protectroute } from "../middleware/protectroute.middleware.js";
import { commentpost, createpost, deletepost, getAllPostsByUser, likePost } from "../controllers/post.controller.js";

const router=express.Router();

router.post("/create-post",protectroute,createpost)
router.delete("/delete-post/:id",protectroute,deletepost)
router.post("/like-post/:id",protectroute,likePost)
router.post("/comment-post/:id",protectroute,commentpost)
router.get("/get-all-post/:id",protectroute,getAllPostsByUser)

export default router;