import { disconnect } from "mongoose";
import {Server as SocketIoServer} from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket=(server)=>{
const io=new SocketIoServer(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }
})
     
const userSocketMap=new Map();

const disconnect=(socket)=>{
    console.log(`Client Dissconnected: ${socket.id}`);
    for(const [userId,socketId] of userSocketMap.entries()){
        if(socketId===socket.is){
            userSocketMap.delete(userId);
            break;
        }
    }
}


const sendMessage=async(message)=>{
const senderSocketId=userSocketMap.get(message.sender);
const recipientSocketId=userSocketMap.get(message.recipient);


const createMessage=await Message.create(message);

const messageData=await Message.findById(createMessage._id)
.populate("sender","id email firstName lastName image color")
.populate("recipient","id email firstName lastName image color")


if(recipientSocketId){
    io.to(recipientSocketId)
    .emit("receiveMessage",messageData);
}
if(senderSocketId){
    io.to(senderSocketId)
    .emit("receiveMessage",messageData);
}


}

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId){
        userSocketMap.set(userId,socket.id);
        console.log(`User connected: ${userId} with socket id ${socket.id}`);
    }else{
        console.log("User ID not provided!")
    }

    socket.on("sendMessage",()=>sendMessage(socket))

    socket.on("disconnect",()=>disconnect(socket));
})
}

export default setupSocket;