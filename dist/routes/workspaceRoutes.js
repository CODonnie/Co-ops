"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authHandler_1 = __importDefault(require("../middlewares/authHandler"));
const workspaceController_1 = require("../controllers/workspaceController");
const authorizeHandler_1 = require("../middlewares/authorizeHandler");
exports.workspaceRoutes = express_1.default.Router();
exports.workspaceRoutes.post("/create", authHandler_1.default, workspaceController_1.createWorkspace);
exports.workspaceRoutes.get("/get", authHandler_1.default, workspaceController_1.getUserWorkspaces);
exports.workspaceRoutes.delete("/delete/:workspaceId", authHandler_1.default, authorizeHandler_1.authorizeWorkspace, workspaceController_1.deleteWorkspace);
exports.workspaceRoutes.post("/invite/:workspaceId", authHandler_1.default, authorizeHandler_1.authorizeWorkspace, workspaceController_1.inviteColleagues);
