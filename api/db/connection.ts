import mongoose from "mongoose";
import {MONGO_URI} from '../utils/config'
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGO_URI);

    console.log(
      `MongoDB Connected: ${conn.connection.host}`
    );
  } catch (err: any) {
    // console.log(`Error: ${err.message}`);
    throw err;
  }
};
export default connectDB;
