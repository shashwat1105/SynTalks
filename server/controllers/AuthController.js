import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


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

       const user=await User.findOne({email});

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
         if(!firstName||lastName||!color){
            return res.status(404).send(" FirstName,Lastname,color is required.")
         }

         const userData=await User.findByIdAndUpdate(userId,{
            firstName,lastName,color,profileSetup:true
         },{new:true,runValidators:true});
         
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