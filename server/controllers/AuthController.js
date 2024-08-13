import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {renameSync,unlinkSync} from "fs";
  

const maxAge=3*24*60*1000;
const secretKey="mysecretkeyiskakashihatake";
const createToken=(email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY||secretKey,{
        expiresIn:maxAge
    })
}

export const signUp=async(req,res,next)=>{
    try{
const {email,password}=req.body;
console.log("email,p:",email,password);

if(!email|| !password){
    return res.status(500).send("Email and password is required!");
    
}
const user=await User.create({email,password});
res.cookie("jwt",createToken(email,user.id),{
    maxAge,
    secure:true,
    sameSite:"None"
})

return res.status(201).json({user:{
    id:user.id,
    email:user.email,
    firstName:user.firstName,
    profileSetup:user.profileSetup    
}})
    }catch(err){
        console.log({err});
        return res.status(500).send("internal Server Error!");

    }
}

export const Login= async(req,res,next)=>{

    try{
        const {email,password}=req.body;
        console.log("email,p:",email,password);
        
        if(!email|| !password){
            return res.status(500).send("Email and password is required!");
            
        }

       const user=await User.findOne({email:email});

       if(!user){
        return res.status(404).send("User with given email is not found");

       }

       const auth=await bcrypt.compare(password,user.password);
       if(!auth){
        return res.status(400).send("Password is incorrect.");
       }

        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        })
        
        return res.status(200).json({user:{
            id:user.id,
            email:user.email,
            firstName:user.firstName,
            profileSetup:user.profileSetup,
            firstName:user.firstName,
            lastName:user.lastName,
            image:user.image,
            color:user.color, 
        }})
            }catch(err){
                console.log({err});
                return res.status(500).send("internal Server Error!");
        
            }

}

export const getUserInfo=async(req,res,next)=>{
    try{
         console.log(req.userId);
         const userData=await User.findById(req.userId);
         if(!userData){
            return res.status(404).send("User with given id not found.")
         }
        return res.status(200).json({
            id:userData.id,
            email:userData.email,
            firstName:userData.firstName,
            profileSetup:userData.profileSetup,
            firstName:userData.firstName,
            lastName:userData.lastName,
            image:userData.image,
            color:userData.color, 
        })
            }catch(err){
                console.log({err});
                return res.status(500).send("internal Server Error!");
        
            }
}


export const updateProfile=async(req,res,next)=>{
    try{
        const {userId}=req;
        const {firstName,lastName,color}=req.body;
        
        console.log("Request Body:", req.body); // Add this line to debug
        console.log("User ID:", userId); 
        
        if(!firstName||!lastName){
            return res.status(400).send(" FirstName,Lastname,color is required.")
         }

         const userData=await User.findByIdAndUpdate(userId,{
            firstName,lastName,color,profileSetup:true
         },{new:true,runValidators:true});
         console.log("updated data: ",userData);

        return res.status(200).json({
            id:userData.id,
            email:userData.email,
            firstName:userData.firstName,
            profileSetup:userData.profileSetup,
            firstName:userData.firstName,
            lastName:userData.lastName,
            image:userData.image,
            color:userData.color, 
        })
            }catch(err){
                console.log({err});
                return res.status(500).send("internal Server Error!");
        
            }
}


export const addProfileImage=async(req,res,next)=>{
    try{

        if(!req.file){
            return res.status(400).send("File is required!");
        }
           
        const date=Date.now();
        let fileName="uploads/profiles/"+date+req.file.originalname;
        renameSync(req.file.path,fileName);

        const updatedUser=await User.findOneAndUpdate({_id:req.userId},
            {image:fileName},
            {new:true,runValidators:true}
        )
        return res.status(200).json({
            image:updatedUser.image,
        })
            }catch(err){
                console.log({err});
                return res.status(500).send("internal Server Error!");
        
            }
}

export const removeProfileImage=async(req,res,next)=>{
    try{
        const {userId}=req;
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).send("user not found!")
        }
        if(user.image){
            unlinkSync(user.image);
        }
user.image=null;
await user.save()
 
         
        return res.status(200).send( "Profile image remived succdessfully")
            }catch(err){
                console.log({err});
                return res.status(500).send("internal Server Error!");
        
            }
}