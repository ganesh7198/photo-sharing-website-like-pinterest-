
import express from "express";
import { getme, LoginController, LogoutController, SingupController } from "../controllers/auth.controller.js";
import protectroute from "../middleware/protectroute.middleware.js";


const router=express.Router();

router.get("/getme",protectroute,getme);

router.post("/signup",SingupController)

router.post("/login",LoginController)

router.post("/logout",LogoutController)


export default router;