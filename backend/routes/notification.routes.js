import express from "express";

import { allnotification, deletenotification } from "../controllers/notification.controller.js";

const router=express.Router();
router.get("/",allnotification);
router.delete("/delete",deletenotification)




export default router;