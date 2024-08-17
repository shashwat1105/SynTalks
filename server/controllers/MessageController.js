import Message from "../models/MessagesModel.js";

export const getMessages=async(req,res,next)=>{
    try{

const user1=req.userId;
const user2=req.body.id;
console.log("user1:",user1);
console.log("user2:",user2);
        
           if(!user1 ||!user2){
            return res.status(400).send("Both Ids are required!");
           }
           const messages=await Message.find({
            $or:[
                {sender:user1,recipient:user2},
                {sender:user2,recipient:user1},
            ]
           }).sort({timestamp:1});
           

if(!messages){
    return res.status(400).send("Messages not found!")
}
        
return res.status(200).json({messages});

    }catch(err){
        console.log(err);
        return res.status(500).send("INternal server error!");
    }

        
}