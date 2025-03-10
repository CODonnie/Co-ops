"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    var _a, _b, _c;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.CoopsToken) || ((_c = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1]);
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log("decoded token", decoded);
            req.user = decoded;
            next();
        }
        catch (error) {
            res.status(403).json({ message: `access denied` });
        }
    }
    else {
        res.status(401).json({ message: "no token provided" });
        return;
    }
};
exports.default = protect;
