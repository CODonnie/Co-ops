"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const authRoutes_1 = require("./routes/authRoutes");
const errorHandler_1 = require("./middlwares/errorHandler");
//init
dotenv_1.default.config();
(0, dbConnect_1.default)();
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 5002;
//middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
//route
app.use('/api/auth', authRoutes_1.authRoutes);
//error middleware
app.use(errorHandler_1.errorHandler);
app.use(errorHandler_1.notFound);
//server
const server = app.listen(port, () => console.log(`app running on port ${port}`));
exports.server = server;
