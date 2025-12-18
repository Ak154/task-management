import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = mongoose.connect(process.env.MONGO_URI);

const connection = mongoose.connection;

connection.on("connected", ()=>{
    console.log("db connected successfully")
})

connection.on("error", (err)=>{
    console.log("db connection error", err);
})

export default mongoose;