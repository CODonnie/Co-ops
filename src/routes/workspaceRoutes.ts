import express from "express";
import protect from "../middlewares/authHandler";
import {createWorkspace, deleteWorkspace, getUserWorkspaces, inviteColleagues} from "../controllers/workspaceController";
import {authorizeWorkspace} from "../middlewares/authorizeHandler";

export const workspaceRoutes = express.Router();

workspaceRoutes.post("/create", protect, createWorkspace);
workspaceRoutes.get("/get", protect, getUserWorkspaces);
workspaceRoutes.delete("/delete/:workspaceId", protect, authorizeWorkspace, deleteWorkspace);
workspaceRoutes.post("/invite/:workspaceId", protect, authorizeWorkspace, inviteColleagues);
