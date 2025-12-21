import express from "express"
import { followunfollowuser, getSuggestedusername, getuserprofile, updateuserprofile } from "../controllers/user.controller.js";
import { protectroute } from "../middleware/protectroute.middleware.js";

const router=express.Router();

router.get("/profile/:username",protectroute,getuserprofile)

router.get("/suggested",protectroute,getSuggestedusername)

router.post("/follow/:id",protectroute,followunfollowuser)

router.post("/update",protectroute,updateuserprofile)


export default router;