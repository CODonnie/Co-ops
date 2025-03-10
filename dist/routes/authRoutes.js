"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authHandler_1 = __importDefault(require("../middlewares/authHandler"));
exports.authRoutes = express_1.default.Router();
exports.authRoutes.post("/signup", authController_1.signUp);
exports.authRoutes.post("/login", authController_1.login);
exports.authRoutes.get("/logout", authHandler_1.default, authController_1.logout);
exports.authRoutes.get("/info", authHandler_1.default, authController_1.getInfo);
