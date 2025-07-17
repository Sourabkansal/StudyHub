import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import condb from "./DbConnect.js";
import signupRoute from "./Routes/signup.route.js";
import ScheduleStudy from "./Routes/ScheduleStudy.js";
import authenticateUser from "./Middleware/authenticateUser.js"
import cookieParser from "cookie-parser";
import AiSchedull from "./Routes/AiSchedule.js";
import charts from "./Routes/Charts.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://study-hub-dqql.vercel.app",
  credentials:true
}));

condb();
app.use(cookieParser()); 

app.get("/",async(req ,res)=>{
  res.send("api running...");
})

app.use("/auth" , signupRoute )
app.use("/Schedule",authenticateUser,  ScheduleStudy )
app.use("/AiSchedul",authenticateUser, AiSchedull)
app.use("/Charts" , authenticateUser, charts)

app.listen((5000),()=>{
  console.log(process.env.FRONTEND_URL);
    console.log("Server is running on port 5000");
})