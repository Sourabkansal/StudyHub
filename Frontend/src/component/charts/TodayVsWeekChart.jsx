import React from "react";
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Streak from "./Streak";

const CircularStats = ({ todayTotal, weektotal }) => {
  const data = JSON.parse(localStorage.getItem("user"));
  const todayPercentage = (todayTotal / 24) * 100;
  const weekPercentage = (weektotal / 168) * 100;

  return (
    <div className="flex gap-6 justify-center mt-2 mb-2 font-bold ">
      {/* Today Circle with Tooltip */}
      <div className="relative group w-20 h-20">
        <CircularProgressbar
          value={todayPercentage}
          text="1D"
          strokeWidth={9}
          styles={buildStyles({
            textSize: "13px",
            pathColor: "#3b82f6",
            textColor: "#111827",
            trailColor: "#e5e7eb",
          })}
        />

        {/* Tooltip */}
        <div className="absolute bottom-[110%] left-1/2 transform -translate-x-1/2 w-32 bg-white border border-gray-300 shadow-md text-sm text-center rounded-md p-2 opacity-0 group-hover:opacity-100 transition duration-200 z-10">
          <div className="font-semibold text-gray-800">Today</div>
          <div className="text-blue-600 font-medium">
            {todayTotal} hrs / 24 hrs
          </div>
        </div>
      </div>

      {/* Week Circle with Tooltip */}
      <div className="relative group w-20 h-20 font-bold">
        <CircularProgressbar
          value={weekPercentage}
          text="7D"
          strokeWidth={9}
          styles={buildStyles({
            textSize: "13px",
            pathColor: "#3b82f6",
            textColor: "#111827",
            trailColor: "#e5e7eb",
          })}
        />

        {/* Tooltip */}
        <div className="absolute bottom-[110%] left-1/2 transform -translate-x-1/2 w-32 bg-white border border-gray-300 shadow-md text-sm text-center rounded-md p-2 opacity-0 group-hover:opacity-100 transition duration-200 z-10">
          <div className="font-semibold text-gray-800">This Week</div>
          <div className="text-blue-600 font-medium">
            {weektotal} hrs / 168 hrs
          </div>
        </div>
      </div>
    {/* streak compo */}
    <div>
        {/* <Streak streak={data.streak} largestStreak={data.LargestStreak} /> */}
    </div>
    </div>
  );
};

export default CircularStats;
