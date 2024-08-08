 import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
 
 const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"EMail is required!"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required!"],
        unique:true
    },
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
    },
    color:{
        type:Number,
        required:false
    },
    profileSetup:{
        type:Boolean,
        default:false,
    }
 })

 userSchema.pre("save",async function(next){
const salt=await bcrypt.genSalt();
this.password=await bcrypt.hash(this.password,salt);
next();
 } )

 const User=mongoose.model("User",userSchema);
 export default User;

