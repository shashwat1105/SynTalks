import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { authRoutes } from './routes/AuthRoutes.js';
import contactRoutes from './routes/ContactRoutes.js';
import setupSocket from './socket.js';
import messagesRoutes from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';
import dotenv from "dotenv";

const app=express();
dotenv.config()

const port=process.env.PORT||3001;
const databaseURL=process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/synchronous" ;

app.use(cors(
    {
    origin:process.env.FRONTEND_URL || "http://localhost:5173",
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
}
));


app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));
app.use(cookieParser()); 
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/contacts",contactRoutes);
app.use("/api/messages",messagesRoutes);
app.use("/api/channel",channelRoutes);


const server=app.listen(port,()=>{
    console.log(`Server is running  at port ${port}`);
})
setupSocket(server);


mongoose.connect(databaseURL)
.then(()=>{
    console.log("Database Connected!");
})
.catch(err=>console.log(err));
