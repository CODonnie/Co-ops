import express from "express";
import {getInfo, login, logout, signUp} from "../controllers/authController";
import protect from "../middlwares/authHandler";

export const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/login", login);
authRoutes.get("/logout", logout);
authRoutes.get("/info", protect, getInfo);
