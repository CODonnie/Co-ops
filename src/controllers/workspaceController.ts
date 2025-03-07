import { Request, Response } from "express";
import { Workspace, User } from "../models/allModels";
import logger from "../utils/logger";

//Create workspace
export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = (req as any).user.id;

    let workspace = await Workspace.findOne({ name });
    if (workspace) {
      logger.warn(`user ${userId} already has ${name} workspace`);
      res.status(400).json({ message: "workspace already exist" });
      return;
    }

    workspace = await Workspace.create({
      name,
      admin: userId,
      colleagues: [userId],
    });

    await workspace.save();

    logger.info(`workspace - ${workspace.name} created`);
    res.status(201).json({ message: "workspace created successfully" });
  } catch (error) {
    logger.error(`error creating workspace - ${error}`);
    res.status(500).json({ message: "error creating workspace" });
  }
};

//Get Workspace
export const getUserWorkspaces = async (req: Request, res: Response) => {
	try{
		const userId = (req as any).user.id;

		const workspaces = await Workspace.find({ $or : [{ admin: userId }, { colleagues: userId }] });

		if(!workspaces){
			logger.warn(' no workspace found');
			res.status(404).json({ message: "no workspace found" });
			return;
		}

		logger.info(`${userId} workspaces retrieved`);
		res.status(200).json({ workspaces });
	} catch(error){
		logger.error(`workspaces retrieval error - ${error}`);
		res.status(500).json({ message: "could not retrieve workspaces" });
	}
};

//Delete Workspace
export const deleteWorkspace = async (req: Request, res: Response) => {
	try{
		const { workspaceId } = req.params;

		if(!(req as any).isAdmin){
			logger.warn("unauthorized access - admin access required");
			res.status(403).json({ message: "access denied" });
			return;
		}

		await Workspace.findByIdAndDelete(workspaceId);

		logger.info(`workspace ${workspaceId} deleted`);
		res.status(200).json({ message: "workspace deleted" });
	}catch(error){
		logger.error(`workspace deletion error - ${error}`);
		res.status(500).json({ message: "an error occured" })
	}
};

//Invite colleagues
export const inviteColleagues = async (req: Request, res: Response) => {
	try{
		if(!(req as any).isAdmin){
			logger.warn('unauthorized access - user not admin');
			res.status(403).json({ message: "accesa denied" });
			return;
		}

		const { workspaceId } = req.params;
		const { email } = req.body;

		const user = await User.findOne({ email });
		if(!user){
			logger.warn(`user invite failed - ${email} not registered`);
			res.status(404).json({ message: "user not registered" });
			return;
		}

		const workspace = await Workspace.findById(workspaceId);
		if(!workspace){
			logger.warn(`workspace ${workspaceId} not found`);
			res.status(404).json({ message: "workspace not found" })
		}

		if(workspace.colleagues.includes(user._id)){
			logger.warn(`user ${user._id} already exist in workspace`);
			res.status(400).json({ message: "user already exist in workspace" });
			return;
		}

		workspace.colleagues.push(user._id);
		await workspace.save();

		logger.info(`user ${user._id} added as colleague`);
		res.status(200).json({ message: "colleague added successfully" })
	} catch(error) {
		logger.error(`error adding colleague - ${error}`);
		res.status(500).json({ message: "an error occured" });
	}
};
