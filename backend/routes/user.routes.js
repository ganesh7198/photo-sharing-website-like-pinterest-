import express from "express"
import { followunfollowuser, getSuggestedusername, getuserprofile, updateuserprofile } from "../controllers/user.controller.js";
const router=express.Router();

router.get("/profile/:username",getuserprofile)

router.get("/suggested",getSuggestedusername)

router.post("/follow/:id",followunfollowuser)

router.post("/update",updateuserprofile)


export default router;