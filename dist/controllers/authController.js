"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = exports.logout = exports.login = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const allModels_1 = require("../models/allModels");
const logger_1 = __importDefault(require("../utils/logger"));
//Signup
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        let user = yield allModels_1.User.findOne({ email });
        if (user) {
            logger_1.default.warn('Registration failed - account exists');
            res.status(400).json({ message: "User already exist" });
            return;
        }
        user = yield allModels_1.User.create({ name, email, password });
        yield user.save();
        logger_1.default.info(`Registration successful - ${user.email}`);
        res.status(201).json({ message: "User created" });
    }
    catch (error) {
        logger_1.default.error(`Registration error - ${error}`);
        res.status(500).json({ message: `error creating user - ${error}` });
    }
    ;
});
exports.signUp = signUp;
//Login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let user = yield allModels_1.User.findOne({ email });
        if (!user) {
            logger_1.default.warn('login failed - user does not exist');
            res.status(401).json({ message: "User doesn't exist" });
            return;
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            logger_1.default.warn(`login attempt - wrong password`);
            res.status(401).json({ message: "invalid credentials" });
            return;
        }
        const secret = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({ id: user._id }, secret, { expiresIn: "1h" });
        res.cookie("CoopsToken", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1 * 24 * 1200 * 1000
        });
        logger_1.default.info(`User logged in - ${user.email}`);
        res.status(200).json({ message: "user access granted" });
    }
    catch (error) {
        logger_1.default.error(`an error ovvured - ${error}`);
        res.status(500).json({ message: "access denied" });
    }
    ;
});
exports.login = login;
//Logout
const logout = (req, res) => {
    try {
        res.clearCookie("CoopsToken");
        logger_1.default.info('User is logged out');
        res.status(200).json({ message: "User logged out successful" });
    }
    catch (error) {
        logger_1.default.error(`an errir occured - ${error}`);
        res.status(500).json({ message: 'an error occured' });
    }
};
exports.logout = logout;
//Protected endpoint
const getInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield allModels_1.User.find({});
        if (!users)
            return;
        res.status(200).json({ data: users });
    }
    catch (error) {
        res.status(500).json({ message: `an error occured - ${error}` });
    }
});
exports.getInfo = getInfo;
