import { Router } from "express";
import {registerUser,loginUser,uploadAssignment} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/upload").post(
    upload.single("file"),uploadAssignment)




export default router