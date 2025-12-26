import express from "express";
import { protectroute } from "../middleware/protectroute.middleware.js";
import { allnotification, deletenotification } from "../controllers/notification.controller.js";

const router=express.Router();
router.get("/",protectroute,allnotification);
router.delete("/delete",protectroute,deletenotification)




export default router;