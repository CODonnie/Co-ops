import mongoose from "mongoose";

const connectDb = async() => {
	const mongoUri = process.env.MONGO_URI as string;
	
	try {
		const conn = await mongoose.connect(mongoUri);
		console.log(`database connected - ${conn.connection.host}`);
	} catch(error) {
		console.log(`database connection error - ${error}`);
		process.exit(1);
	}
};

export default connectDb;
