import { disconnect } from "mongoose";
import {Server as SocketIoServer} from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./routes/ChannelModel.js";

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


const sendChannelMessage=async(message)=>{


    const {channelId,sender,content,messageType,fileUrl}=message;
    const createdMessage=await Message.create({
        sender,recipient:null,
        content,messageType,
        timestamp:new Date(),
        fileUrl
    });

    const messageData=await Message.findById(createdMessage._id)
    .populate("sender","id email firstName lastName image color")
    .exec();


    await Channel.findByIdAndUpdate(channelId,{
        $push:{messages:createdMessage._id}
    });

    const channel=await Channel.findById(channelId)
    .populate("members");

    const finalData={...messageData._doc,channelId:channel._id}

    if(channel && channel.members){
        channel.members.forEach((member)=>{
            const memberSocketId=userSocketMap.get(member._id.toString());
        if(memberSocketId){
            io.to(memberSocketId)
            .emit("recieve-channel-message",finalData);
        }
     })

    const adminSocketId=userSocketMap.get(channel.admin._id.toString())

    if(adminSocketId){
        io.to(adminSocketId).emit("recieve-channel-message",finalData);

    }
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
    socket.on("send-channel-message",(message)=>sendChannelMessage(message))
})
}

export default setupSocket;