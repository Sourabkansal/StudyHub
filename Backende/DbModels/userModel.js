import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  hashedpas: { type: String, required: true },
  streak: { type: Number, default: 1 },
  LargestStreak: { type: Number, default: 1 },
  weeklyData: [
    {
      weekLabel: String,  //konsa week h sal ka
      startDate: Date,    //monday iss week ka 
      endDate: Date,      // sunday iss week ka kis date ko 
      daysCompleted: {    // 
        type: Number,
        default: 0,
      },
      days: [
        {
          date: Date,
          dayName: {type: String,required: true,},
          activityDone: {type: Boolean,default: false,},
          learningHours: {type: Number,default: 0,},
          readingHours: {type: Number,default: 0,},
        },
      ],
    },
  ],
});

export const User = mongoose.model("user", userSchema);
