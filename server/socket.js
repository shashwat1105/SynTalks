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
        if(socketId===socket.id){
            userSocketMap.delete(userId);
            break;
        }
    }
}


const sendMessage=async(message)=>{
    // console.log("message received from the fromtend:",message.sender," dsd::  ",message.recipient)
const senderSocketId=userSocketMap.get(message.sender);
const recipientSocketId=userSocketMap.get(message.recipient);
// console.log("sender id message:",senderSocketId)
// console.log("recepient id message:",recipientSocketId)


const createdMessage=await Message.create(message);
// console.log("created message:",createdMessage);

const messageData=await Message.findById(createdMessage._id)
.populate("sender","id email firstName lastName image color")
.populate("recipient","id email firstName lastName image color")
// console.log("messageData: ",messageData);

if(recipientSocketId){
    io.to(recipientSocketId)
    .emit("recieveMessage",messageData);
}
if(senderSocketId){
    io.to(senderSocketId)
    .emit("recieveMessage",messageData);
}

}

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId){
        userSocketMap.set(userId,socket.id);
        // console.log(`User connected: ${userId} with socket id ${socket.id}`);
    }else{
        console.log("User ID not provided during connection!")
    }

    socket.on("sendMessage",(message)=>sendMessage(message))

    socket.on("disconnect",()=>disconnect(socket));
})
}

export default setupSocket;