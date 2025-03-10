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
exports.createGoals = exports.deleteProject = exports.getWorkspaceProjects = exports.createProject = void 0;
const allModels_1 = require("../models/allModels");
const logger_1 = __importDefault(require("../utils/logger"));
//@desc - create Project
//@route - POST/api/create-project/:workspaceId
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workspaceId } = req.params;
        const { title, description } = req.body;
        const workspace = yield allModels_1.Workspace.findById(workspaceId);
        if (!workspace) {
            logger_1.default.warn("workspace doesn't exist");
            res.status(404).json({ message: "workspace not found" });
            return;
        }
        const project = yield allModels_1.Project.create({
            title,
            workspace: "workspaceId",
            description,
        });
        logger_1.default.info("Project creation successful");
        res.status(201).json({ message: "Project created successfully" });
    }
    catch (error) {
        logger_1.default.error(`Project creation error - ${error}`);
        res.status(500).json({ message: "an error occured" });
    }
});
exports.createProject = createProject;
//@desc - get all project in a workspace
//@route - GET/api/projects/:workspaceId
const getWorkspaceProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workspaceId } = req.params;
        const projects = yield allModels_1.Project.findById({
            workspace: workspaceId,
        }).populate("goals");
        if (!projects) {
            logger_1.default.warn(`no project found in workspace - ${workspaceId}`);
            res.status(404).json({ message: "no project found" });
            return;
        }
        logger_1.default.info(`projects retrieved successfully`);
        res.status(200).json({ projects });
    }
    catch (error) {
        logger_1.default.error(`project retrieval error - ${error}`);
        res.status(500).json({ message: "an error occured" });
    }
});
exports.getWorkspaceProjects = getWorkspaceProjects;
//@desc - delete a project
//@route - DELETE/api/project/:projectId
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        yield allModels_1.Project.findByIdAndDelete(projectId);
        logger_1.default.info(`project ${projectId} deleted`);
        res.status(200).json({ message: "project deleted" });
    }
    catch (error) {
        logger_1.default.error(`project deletion error - ${error}`);
        res.status(500).json({ message: "an error occured" });
    }
});
exports.deleteProject = deleteProject;
//@desc - create goals
//@route - POST/api/create-goals/:projectId
const createGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, assignedTo } = req.body;
        const { projectId } = req.params;
        const goal = yield allModels_1.Task.create({
            title,
            project: projectId,
            assignedTo
        });
        yield allModels_1.Project.findByIdAndUpdate(projectId, { $push: { goals: goal._id } });
        logger_1.default.info(`goal ${goal._id} created`);
        res.status(201).json({ message: "goal created successfully" });
    }
    catch (error) {
        logger_1.default.error(`creating goal error - ${error}`);
        res.status(500).json({ message: "an error occured" });
    }
    ;
});
exports.createGoals = createGoals;
