import jwt from 'jsonwebtoken'
const secretKey="mysecretkeyiskakashihatake";

export const verifyToken=(req,res,next)=>{
console.log(req.cookie);
    const token=req.cookies.jwt;
    console.log({token});
    if(!token) return res.status(401).send("YOu are not authenticated!");
    
    jwt.verify(token,secretKey,async(err,payload)=>{

        if(err) return res.status(403).send("Token is not valid");
        req.userId=payload.userId;
        next();
    })
}