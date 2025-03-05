import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const protect = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies?.CoopsToken || req.headers?.authorization?.split(" ")[1]

	if(token){
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
			(req as any).user = decoded;
			next();
		} catch(error) {
			res.status(403).json({ message: `access denied` });
		}
	} else {
		res.status(401).json({ message: "no token provided" });
		return;
	}
}

export default protect;
