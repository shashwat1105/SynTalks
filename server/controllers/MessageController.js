import Message from "../models/MessagesModel.js";
import User from "../models/UserModel.js";

export const getMessages=async(req,res,next)=>{
    try{
const user1=request.userId;
const user2=request.body.id;

        
           if(!user1 ||!user2){
            return res.status(400).send("Both Ids are required!");
           }
           const messages=await Message.find({
            $or:[
                {sender:user1,recipient:user2},
                {sender:user2,recipient:user1},
            ]
           }).sort({timestamp:1});
           


        
return res.status(200).json({messages});

    }catch(err){
        console.log(err);
        return res.status(500).send("INternal server error!");
    }

        
}