import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDb from "./config/dbConnect";
import {authRoutes} from "./routes/authRoutes";
import {errorHandler, notFound} from "./middlwares/errorHandler";

//init
dotenv.config();
connectDb();
const app = express();
const port = process.env.PORT || 5002;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

//route
app.use('/api/auth', authRoutes);

//error middleware
app.use(errorHandler);
app.use(notFound);

//server
const server = app.listen(port, () => console.log(`app running on port ${port}`));

export { app, server };
