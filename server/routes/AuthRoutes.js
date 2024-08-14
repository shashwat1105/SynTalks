import { Router } from "express";
import { addProfileImage, getUserInfo, Login, logOut, removeProfileImage, signUp,updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from 'multer';

const upload=multer({dest:"uploads/profiles/"})

const authRoutes=Router();
authRoutes.post("/signup",signUp);
authRoutes.post("/login",Login);
authRoutes.get("/user-info",verifyToken,getUserInfo)
authRoutes.post("/update-profile",verifyToken,updateProfile)
authRoutes.post(
    "/add-profile-image",
    verifyToken,
    upload.single("profile-image") ,
    addProfileImage);
authRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage)
authRoutes.post("/logout",logOut)


export {authRoutes};

