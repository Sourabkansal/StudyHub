
import { User } from "../DbModels/userModel.js";
import {OTP} from "../DbModels/otpModel.js"
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import createTokenSetcookie from "../setJwdToken.js";

export const getOTP = async (req, res) => {
 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
 
  let otp = Math.floor(1000 + Math.random() * 9000);
  let { email } = req.body;
  if (!email) {
    res.status(400).send({ message: "email is required!" });
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "One Time Password (OTP)",
    html: `<p>Please use <strong>OTP : ${otp}</strong> to verify your Shopz account.</p>
         <p>If you're facing any problem, just reply to this email.</p>
         <p>Thank you,<br><strong>Sourab Kansal</strong></p>`,
  };
  let otpp = await OTP.findOneAndUpdate(
    { email },
    { email, otp },
    { upsert: true, new: true }
  );
  console.log(otpp);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(401).send({ message: " Enter valid Email" });
      console.error("Error sending email:", error); 
    } else {
      res.status(200).send({ message: "otp send to email succeessfulllyyyy....." });
      console.log("Email sent:", info.response);
    }
  });
}

export const signup = async (req, res) => {
  let { username, email, password, otp } = req.body;
  // console.log(req.body)
  let usertocheck = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log(usertocheck);
  if (usertocheck) {
    if (usertocheck.username == username) {
      res.status(402).json({ message: "Username already registered" });
    } else if (usertocheck.email == email) {
      res.status(403).json({ message: "email already registered" });
    }
  } else {
    let hashedpas = await bcrypt.hash(password, 10);
    console.log(hashedpas);
    let otpobj = await OTP.findOne({ email });
    if (!otpobj || otpobj.otp != otp) {
      res.status(401).send({ message: "incorrect credentials !" });
      return;
    }
    let user = await User({ username, email, hashedpas });
    user.save();
    res.status(201).json({ message: "Signup success" });
  }
}

export const login = async(req , res )=>{
    let {email , password} = req.body 
  let user = await User.findOne({ email : email });
  if(!user){
         res.status(404).send({ message: "user not find " });
         return
  }
  let matched = await bcrypt.compare(password, user.hashedpas)
  console.log(matched)
  if (!matched) { 
    res.status(401).send({ message: "wront password!" });
    return
  }
  
  createTokenSetcookie(res , user._id)
  res.status(200).send({ message: "Log in success " ,user :delete (user = user.toObject()).hashedpas}?user:"");

}