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
exports.inviteColleagues = exports.deleteWorkspace = exports.getUserWorkspaces = exports.createWorkspace = void 0;
const allModels_1 = require("../models/allModels");
const logger_1 = __importDefault(require("../utils/logger"));
//Create workspace
const createWorkspace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const userId = req.user.id;
        let workspace = yield allModels_1.Workspace.findOne({ name });
        if (workspace) {
            logger_1.default.warn(`user ${userId} already has ${name} workspace`);
            res.status(400).json({ message: "workspace already exist" });
            return;
        }
        workspace = yield allModels_1.Workspace.create({
            name,
            admin: userId,
            colleagues: [userId],
        });
        yield workspace.save();
        logger_1.default.info(`workspace - ${workspace.name} created`);
        res.status(201).json({ message: "workspace created successfully" });
    }
    catch (error) {
        logger_1.default.error(`error creating workspace - ${error}`);
        res.status(500).json({ message: "error creating workspace" });
    }
});
exports.createWorkspace = createWorkspace;
//Get Workspace
const getUserWorkspaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const workspaces = yield allModels_1.Workspace.find({ $or: [{ admin: userId }, { colleagues: userId }] });
        if (!workspaces) {
            logger_1.default.warn(' no workspace found');
            res.status(404).json({ message: "no workspace found" });
            return;
        }
        logger_1.default.info(`${userId} workspaces retrieved`);
        res.status(200).json({ workspaces });
    }
    catch (error) {
        logger_1.default.error(`workspaces retrieval error - ${error}`);
        res.status(500).json({ message: "could not retrieve workspaces" });
    }
});
exports.getUserWorkspaces = getUserWorkspaces;
//Delete Workspace
const deleteWorkspace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workspaceId } = req.params;
        if (!req.isAdmin) {
            logger_1.default.warn("unauthorized access - admin access required");
            res.status(403).json({ message: "access denied" });
            return;
        }
        yield allModels_1.Workspace.findByIdAndDelete(workspaceId);
        logger_1.default.info(`workspace ${workspaceId} deleted`);
        res.status(200).json({ message: "workspace deleted" });
    }
    catch (error) {
        logger_1.default.error(`workspace deletion error - ${error}`);
        res.status(500).json({ message: "an error occured" });
    }
});
exports.deleteWorkspace = deleteWorkspace;
//Invite colleagues
const inviteColleagues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.isAdmin) {
            logger_1.default.warn('unauthorized access - user not admin');
            res.status(403).json({ message: "accesa denied" });
            return;
        }
        const { workspaceId } = req.params;
        const { email } = req.body;
        const user = yield allModels_1.User.findOne({ email });
        if (!user) {
            logger_1.default.warn(`user invite failed - ${email} not registered`);
            res.status(404).json({ message: "user not registered" });
            return;
        }
        const workspace = yield allModels_1.Workspace.findById(workspaceId);
        if (!workspace) {
            logger_1.default.warn(`workspace ${workspaceId} not found`);
            res.status(404).json({ message: "workspace not found" });
        }
        if (workspace.colleagues.includes(user._id)) {
            logger_1.default.warn(`user ${user._id} already exist in workspace`);
            res.status(400).json({ message: "user already exist in workspace" });
            return;
        }
        workspace.colleagues.push(user._id);
        yield workspace.save();
        logger_1.default.info(`user ${user._id} added as colleague`);
        res.status(200).json({ message: "colleague added successfully" });
    }
    catch (error) {
        logger_1.default.error(`error adding colleague - ${error}`);
        res.status(500).json({ message: "an error occured" });
    }
});
exports.inviteColleagues = inviteColleagues;
