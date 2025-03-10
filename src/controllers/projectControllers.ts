import { Request, Response } from "express";
import { Project, Workspace, Task } from "../models/allModels";
import logger from "../utils/logger";

//@desc - create Project
//@route - POST/api/create-project/:workspaceId
export const createProject = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const { title, description } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      logger.warn("workspace doesn't exist");
      res.status(404).json({ message: "workspace not found" });
      return;
    }

    const project = await Project.create({
      title,
      workspace: "workspaceId",
      description,
    });

    logger.info("Project creation successful");
    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    logger.error(`Project creation error - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - get all project in a workspace
//@route - GET/api/projects/:workspaceId
export const getWorkspaceProjects = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const projects = await Project.findById({
      workspace: workspaceId,
    }).populate("goals");

    if (!projects) {
      logger.warn(`no project found in workspace - ${workspaceId}`);
      res.status(404).json({ message: "no project found" });
      return;
    }

    logger.info(`projects retrieved successfully`);
    res.status(200).json({ projects });
  } catch (error) {
    logger.error(`project retrieval error - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - delete a project
//@route - DELETE/api/project/:projectId
export const deleteProject = async (req: Request, res: Response) => {
	try{
		const { projectId } = req.params
		await Project.findByIdAndDelete(projectId);

		logger.info(`project ${projectId} deleted`);
		res.status(200).json({ message: "project deleted" });
	}catch(error){
		logger.error(`project deletion error - ${error}`);
		res.status(500).json({ message: "an error occured" });
	}
};

//@desc - create goals
//@route - POST/api/create-goals/:projectId
export const createGoals = async (req: Request, res: Response) => {
	try{
		const { title, assignedTo } = req.body;
		const { projectId } = req.params;

		const goal = await Task.create({
			title,
			project: projectId,
			assignedTo
		});
		await Project.findByIdAndUpdate(projectId, { $push: { goals: goal._id } });

		logger.info(`goal ${goal._id} created`);
		res.status(201).json({ message: "goal created successfully" });
	}catch(error){
		logger.error(`creating goal error - ${error}`);
		res.status(500).json({ message: "an error occured" });
	};
};
