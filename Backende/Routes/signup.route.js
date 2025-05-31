import express from "express" 
import { signup } from "../Controller/authController.js"
import { getOTP } from "../Controller/authController.js"
import { login } from "../Controller/authController.js"

const signupRoute = express.Router()
signupRoute.post("/signup",signup) 
signupRoute.post("/getotp",getOTP)
signupRoute.post("/login" , login)

export default signupRoute 