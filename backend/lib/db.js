import mongoose from "mongoose";

export const connectDB = async ()=>{
        try {
                const connect =  await mongoose.connect(process.env.MONGO_URL)
                console.log(`mongo db connected: ${connect.connection.host}`);
        } catch (error) {
                console.log(`error in connectDB: ${error.message}`);
                process.exit(1);
        }
}