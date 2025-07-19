import { User } from "../DbModels/userModel.js";
import { OTP } from "../DbModels/otpModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import createTokenSetcookie from "../setJwdToken.js";

export const getOTP = async (req, res) => {
  const transporter = nodemailer.createTransporter({
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
    html: `<p>Please use <strong>OTP : ${otp}</strong> to verify your StudyHub account.</p>
         <p>If you're facing any problem, just reply to this email.</p>
         <p>Thank you,<br><strong>Sourab Kansal</strong></p>`,
  };
  let otpp = await OTP.findOneAndUpdate(
    { email },
    { email, otp },
    { upsert: true, new: true }
  );
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(401).send({ message: " Enter valid Email" });
      console.error("Error sending email:", error);
    } else {
      res
        .status(200)
        .send({ message: "otp send to email succeessfulllyyyy....." });
      console.log("Email sent:", info.response);
    }
  });
};

const getcurrentweekdata = () => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day; //day return its number like monday 1

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0); //time reset to 12am

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
};

function getWeekLabel(date = new Date()) {
  const year = date.getFullYear();
  const firstJan = new Date(year, 0, 1);
  const daysPassed = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000)); //<--- mseconds ko days ma kr rha h  //firstjan sa ajj ta kitna din pass ho gya
  const weekNumber = Math.ceil((firstJan.getDay() + 1 + daysPassed) / 7);
  return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
}

export const signup = async (req, res) => {
  let { username, email, password, otp } = req.body;

  let usertocheck = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (usertocheck) {
    if (usertocheck.username == username) {
      res.status(402).json({ message: "Username already registered" });
    } else if (usertocheck.email == email) {
      res.status(403).json({ message: "email already registered" });
    }
  } else {
    let hashedpas = await bcrypt.hash(password, 10);
    let otpobj = await OTP.findOne({ email });
    if (!otpobj || otpobj.otp != otp) {
      res.status(401).send({ message: "incorrect credentials !" });
      return;
    }

    //preparing for weekdata in db
    const { monday, sunday } = getcurrentweekdata();
    const weekLabel = getWeekLabel();

    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday); // new iss liya bnaya h date ko ham direct change nhi kr skata
      date.setDate(monday.getDate() + i);

      weekDays.push({
        date,
        dayName: dayNames[i],
        activityDone: false,
        learningHours: 0,
        readingHours: 0,
      });
    }

    let user = await User({
      username,
      email,
      hashedpas,
      streak: 1,
      longestStreak: 1,
      weeklyData: [
        {
          weekLabel,
          startDate: monday,
          endDate: sunday,
          daysCompleted: 0,
          days: weekDays,
        },
      ],
    });
    user.save();
    res.status(201).json({ message: "Signup success" });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const { monday, sunday } = getcurrentweekdata();
    const currentLabel = getWeekLabel();
    
    let user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).send({ message: "user not find " });
      return;
    }
    
    let matched = await bcrypt.compare(password, user.hashedpas);
    if (!matched) {
      res.status(401).send({ message: "wront password!" });
      return;
    }

    // CRITICAL iOS FIX: Safe array access with proper null checking
    if (!user.weeklyData || !Array.isArray(user.weeklyData)) {
      user.weeklyData = [];
    }

    const latestWeek = user.weeklyData.length > 0 
      ? user.weeklyData[user.weeklyData.length - 1] 
      : null;
      
    console.log(`last week ${latestWeek}`);
    console.log(`current week ${currentLabel}`);
    
    if (!latestWeek || latestWeek.weekLabel !== currentLabel) {
      // yaha ajj bala sa compare
      const dayNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        days.push({
          date,
          dayName: dayNames[i],
          activityDone: false,
          learningHours: 0,
          readingHours: 0,
        });
      }
      user.weeklyData.push({
        weekLabel: currentLabel,
        startDate: monday,
        endDate: sunday,
        daysCompleted: 0,
        days,
      });
      await user.save();
    }

    createTokenSetcookie(res, user._id);
    
    // Fix the response object handling
    const userResponse = user.toObject();
    delete userResponse.hashedpas;
    
    res.status(200).send({
      message: "Log in success ",
      user: userResponse
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};