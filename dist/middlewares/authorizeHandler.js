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
exports.authorizeWorkspace = void 0;
const allModels_1 = require("../models/allModels");
const logger_1 = __importDefault(require("../utils/logger"));
const authorizeWorkspace = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get userid from req and workspaceId from req.params.
        const userId = req.user.id;
        const workspaceId = req.params.workspaceId;
        //find workspace using workspaceid to confirm existence
        const workspace = yield allModels_1.Workspace.findById(workspaceId);
        if (!workspace) {
            logger_1.default.warn("workspace doesn't exist");
            res.status(404).json({ message: "workspace not found" });
            return;
        }
        ;
        //check if userid is in workspace admin or colleague
        const isAdmin = workspace.admin.toString() === userId;
        const isColleague = workspace.colleagues.some((dude) => dude.toString() === userId);
        //save user role in req for req circle
        req.isAdmin = isAdmin;
        req.isColleague = isColleague;
        next();
    }
    catch (error) {
        logger_1.default.error(`Authorization error - ${error}`);
        res.status(500).json({ message: "an error occured" });
    }
});
exports.authorizeWorkspace = authorizeWorkspace;
