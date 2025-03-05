import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/allModels";
import logger from "../utils/logger";

//Signup
export const signUp = async (req: Request, res: Response) => {
	try{
	const { name, email, password } = req.body;

	let user = await User.findOne({ email });
	if(user){
		logger.warn('Registration failed - account exists');
		res.status(400).json({ message: "User already exist" });
		return;
	}

	user = await User.create({ name, email, password });
	await user.save();

	logger.info(`Registration successful - ${user.email}`);
	res.status(201).json({ message: "User created" });
	}catch(error){
		logger.error(`Registration error - ${error}`);
		res.status(500).json({ message: `error creating user - ${error}` });
	};
};

//Login
export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		let user = await User.findOne({ email });
		if(!user) {
			logger.warn('login failed - user does not exist');
			res.status(401).json({ message: "User doesn't exist" });
			return;
		}

		const isMatch = await user.comparePassword(password as string);

		if(!isMatch){
			logger.warn(`login attempt - wrong password`);
			res.status(401).json({ message: "invalid credentials" });
			return;
		}

		const secret = process.env.JWT_SECRET as string;
		const token = jwt.sign({id: user._id}, secret, { expiresIn: "1h" });
		res.cookie("CoopsToken", token, {
			httpOnly: true,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
			maxAge: 1 * 24 * 1200 * 1000
		});

		logger.info(`User logged in - ${user.email}`);
		res.status(200).json({ message: "user access granted" });
	} catch(error) {
		logger.error(`an error ovvured - ${error}`);
		res.status(500).json({ message: "access denied" });
	};
};

//Logout
export const logout = (req: Request, res: Response) => {
	try {
		res.clearCookie("CoopsToken");
		logger.info('User is logged out');
		res.status(200).json({ message: "User logged out successful" });
	}catch(error){
		logger.error(`an errir occured - ${error}`);
		res.status(500).json({ message: 'an error occured' })
	}
};

//Protected endpoint
export const getInfo = async (req: Request, res: Response) => {
	try {
		const users = await User.find({});
		if(!users) return;

		res.status(200).json({ data: users });
	} catch(error) {
		res.status(500).json({ message: `an error occured - ${error}`})
	}
}
