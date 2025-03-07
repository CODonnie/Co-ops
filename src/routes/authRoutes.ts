import express from "express";
import {getInfo, login, logout, signUp} from "../controllers/authController";
import protect from "../middlewares/authHandler";

export const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/login", login);
authRoutes.get("/logout", protect,logout);
authRoutes.get("/info", protect, getInfo);
