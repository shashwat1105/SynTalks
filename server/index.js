import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { authRoutes } from './routes/AuthRoutes.js';

const app=express();
const port=process.env.PORT||3001;
const databaseURL=process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/synchronous" ;

app.use(cors(
//     {
//     origin:[process.env.ORIGIN||"http://localhost:5173"],
//     methods:["GET","POST","PUT","PATCH","DELETE"],
//     credentials:true,
// }
));

app.use(cookieParser()); 
app.use(express.json());

app.use("/api/auth",authRoutes);

const server=app.listen(port,()=>{
    console.log(`Server is running  at port ${port}`);
})

mongoose.connect(databaseURL)
.then(()=>{
    console.log("Database Connected!");
})
.catch(err=>console.log(err));
