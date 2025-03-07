"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authHandler_1 = __importDefault(require("../middlwares/authHandler"));
const workspaceController_1 = require("../controllers/workspaceController");
const authorizeHandler_1 = require("../middlwares/authorizeHandler");
exports.workspaceRoutes = express_1.default.Router();
exports.workspaceRoutes.post("/workspace", authHandler_1.default, workspaceController_1.createWorkspace);
exports.workspaceRoutes.get("/workspace", authHandler_1.default, workspaceController_1.getUserWorkspace);
exports.workspaceRoutes.delete("/workspace/:workspaceId", authHandler_1.default, authorizeHandler_1.authorizeWorkspace, workspaceController_1.deleteWorkspace);
exports.workspaceRoutes.post("/workspace/invite/:workspaceId", authHandler_1.default, authorizeHandler_1.authorizeWorkspace, workspaceController_1.invite);
