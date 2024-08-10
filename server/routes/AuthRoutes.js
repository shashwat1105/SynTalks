import { Router } from "express";
import { getUserInfo, Login, signUp,updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const authRoutes=Router();
authRoutes.post("/signup",signUp);
authRoutes.post("/login",Login);
authRoutes.get("/user-info",verifyToken,getUserInfo)
authRoutes.post("/update-profile",verifyToken,updateProfile);


export {authRoutes};

