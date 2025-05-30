import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
function condb (){
     mongoose.connect(process.env.MONGO_ATLAS_URL).then((data)=>{
        console.log("mongoose connect to mongodb")
    }).catch((error)=>{
        console.log( "heloerror",error)
    })  
}  

export default condb 