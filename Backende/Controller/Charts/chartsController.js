import express from "express";
import { User } from "../../DbModels/userModel.js";

export const getChartData = async (req, res) => {
  try {
    const { userid, weekLabel, Readinghrs, Learninghrs } = req.body;

    const user = await User.findOne({ _id: userid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    

    const week = user.weeklyData.find((item) => item.weekLabel === weekLabel);
    if (!week) {
      return res
        .status(404)
        .json({ message: "No week data found for this label" });
    }

    const days = week.days;

    const today = new Date();
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

    const singleday = days.find((item) => item.dayName === dayName);
    if (!singleday) {
      return res
        .status(404)
        .json({ message: "No day data found for today: " + dayName });
    }

    singleday.activityDone = true;
    singleday.learningHours += Learninghrs;
    singleday.readingHours += Readinghrs;

    await user.save();

    console.log(`Updated day: ${dayName}`);
    console.log(singleday);

    res.status(200).json({
      message: `Updated ${dayName} data successfully.`,
      updatedDay: week ,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
