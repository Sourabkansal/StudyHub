import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import condb from "./DbConnect.js";
import { User } from "./DbModels/userModel.js";
import {OTP} from "./DbModels/otpModel.js"
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import signupRoute from "./Routes/signup.route.js";
import ScheduleStudy from "./Routes/ScheduleStudy.js";
import authenticateUser from "./Middleware/authenticateUser.js"
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors({
   origin:process.env.FRONTEND_URL,
   credentials:true
}));

condb();
app.use(cookieParser()); 

app.get("/",async(req ,res)=>{
  res.send("api running...");
})

app.use("/auth" , signupRoute )
app.use("/Schedule" , authenticateUser, ScheduleStudy )

app.listen((5000),()=>{
    
})