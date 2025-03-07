import { Request, Response, NextFunction } from "express";
import { Workspace } from "../models/allModels";
import logger from "../utils/logger";

export const authorizeWorkspace = async (req: Request, res: Response, next: NextFunction) => {
	try{
		//get userid from req and workspaceId from req.params.
		const userId = (req as any).user.id;
		const workspaceId = req.params.workspaceId;

		//find workspace using workspaceid to confirm existence
		const workspace = await Workspace.findById(workspaceId);
		if(!workspace){
			logger.warn("workspace doesn't exist");
			res.status(404).json({ message: "workspace not found" });
			return;
		};

		//check if userid is in workspace admin or colleague
		const isAdmin = workspace.admin.toString() === userId;
		const isColleague = workspace.colleagues.some((dude: string) => dude.toString() === userId);

		//save user role in req for req circle
		(req as any).isAdmin = isAdmin;
		(req as any).isColleague = isColleague;

		next()
	} catch(error) {
		logger.error(`Authorization error - ${error}`);
		res.status(500).json({ message: "an error occured" });
	}
}
