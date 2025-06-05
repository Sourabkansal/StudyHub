import jwt from "jsonwebtoken";
import express from "express"

express().use(express.json());


const authenticateUser = async (req , res , next )=>{
      
    try{
       let token = req.cookies.token;
       console.log(token , req.body)
       if(!token){
         return res.status(401).json({ message: "Access denied. No token provided." });
       }
       else{
           const decoded = jwt.verify(token , process.env.JWT_SECRET )
           req.user = decoded
           next();
       }
    }
    catch{
       return res.status(401).json({ message: "Invalid token" });
    }
}
export default authenticateUser