import React, { useState, useEffect } from "react";
import { FiPause, FiPlay } from "react-icons/fi";
import ChartBarMultiple from "./BarChart";
import TodayVsWeekChart from "./TodayVsWeekChart";

export const RepostCharts = () => {
  const [chartData, setChartData] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [learningSeconds, setLearningSeconds] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  function getWeekLabel(date = new Date()) {
    const year = date.getFullYear();
    const firstJan = new Date(year, 0, 1);
    const daysPassed = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((firstJan.getDay() + 1 + daysPassed) / 7);
    return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
  }

  const currentLabel = getWeekLabel();

  useEffect(() => {
    const localChartData = JSON.parse(localStorage.getItem("ChartData"));
    const localUserData = JSON.parse(localStorage.getItem("user"));

    if (localChartData && localChartData.weekLabel === currentLabel) {
      setChartData(localChartData);
    } else if (localUserData) {
      const weekData = localUserData.weeklyData.find(
        (item) => item.weekLabel === currentLabel
      );
      if (weekData) {
        setChartData(weekData);
      } else {
        fetchInitialData(localUserData);
      }
    }
  }, []);

  useEffect(() => {
    let readingTimerInterval;
    let readingApiInterval;
    let learningTimerInterval;
    let learningApiInterval;

    if (isReading) {
      readingTimerInterval = setInterval(() => {
        setReadingSeconds((prev) => prev + 1);
      }, 1000);

      readingApiInterval = setInterval(() => {
        sendTimeUpdate("reading");
      }, 10 * 1000);
    }

    if (isLearning) {
      learningTimerInterval = setInterval(() => {
        setLearningSeconds((prev) => prev + 1);
      }, 1000);

      learningApiInterval = setInterval(() => {
        sendTimeUpdate("learning");
      }, 10 * 1000);
    }

    return () => {
      clearInterval(readingTimerInterval);
      clearInterval(readingApiInterval);
      clearInterval(learningTimerInterval);
      clearInterval(learningApiInterval);
    };
  }, [isReading, isLearning]);

  const fetchInitialData = async (localUserData) => {
    if (!localUserData) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/Charts/Get&Send`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userid: localUserData._id,
            weekLabel: currentLabel,
            Readinghrs: 0,
            Learninghrs: 0,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();
      localStorage.setItem("ChartData", JSON.stringify(data.updatedDay));
      setChartData(data.updatedDay);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const sendTimeUpdate = async (type) => {
    try {
      const localUserData = JSON.parse(localStorage.getItem("user"));
      if (!localUserData) return;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/Charts/Get&Send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: localUserData._id,
            weekLabel: currentLabel,
            Readinghrs: type === "reading" ? 0.002777 : 0,
            Learninghrs: type === "learning" ? 0.002777 : 0,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();
      localStorage.setItem("ChartData", JSON.stringify(data.updatedDay));
      setChartData(data.updatedDay);
      setLastUpdateTime(Date.now());
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatHours = (hours) => {
    return (Math.round(hours * 100) / 100).toFixed(1);
  };

  const handleReadingClick = () => {
    setIsReading((prev) => !prev);
    if (isLearning) setIsLearning(false);
  };

  const handleLearningClick = () => {
    setIsLearning((prev) => !prev);
    if (isReading) setIsReading(false);
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  const chartSortedData = chartData.days.map((item) => ({
    dayName: item.dayName,
    ReadingHours: item.readingHours,
    LearningHours: item.learningHours,
  }));

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const todayData = chartData.days.find((item) => item.dayName === dayName);

  const totalTodayHours = todayData
    ? todayData.readingHours + todayData.learningHours
    : 0;

  const weektotaltotal = chartData.days.reduce((total, curr) => {
    return total + curr.readingHours + curr.learningHours;
  }, 0);

  const localUserData = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col lg:flex-row w-full justify-between gap-4 mb-4">
        <div className="w-full lg:w-[60%]">
          <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-1">
            <h6 className="text-center font-semibold text-sm sm:text-base">
              Today Vs WeekChart
            </h6>
            <TodayVsWeekChart
              todayTotal={formatHours(totalTodayHours)}
              weektotal={formatHours(weektotaltotal)}
              key={lastUpdateTime}
            />
          </div>
        </div>

        <div className="w-full lg:w-[40%] flex flex-col">
          <div className="my-2 sm:my-4 text-center lg:text-left">
            <p className="text-lg font-medium text-gray-800">
              <span className="font-bold text-indigo-600">Streak: </span>
              <span className="font-bold text-orange-500">1</span>
              <span className="ml-1 text-xl">🔥</span>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleReadingClick}
              className="inline-flex items-center gap-2 text-white font-semibold rounded-full px-5 py-2 shadow-md transition-transform transform hover:-translate-y-0.5"
              style={{
                backgroundColor: "#2563EB",
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2563EB";
              }}
            >
              <span className="relative w-5 h-5">
                <FiPause
                  size={20}
                  className={`absolute transition-opacity duration-300 ${
                    !isReading ? "opacity-100" : "opacity-0"
                  }`}
                />
                <FiPlay
                  size={20}
                  className={`absolute transition-opacity duration-300 ${
                    isReading ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
              <span className="inline-block min-w-[60px] text-left">
                {!isReading ? "Reading?" : formatTime(readingSeconds)}
              </span>
            </button>

            <button
              onClick={handleLearningClick}
              className="inline-flex items-center gap-2 text-white font-semibold rounded-full px-5 py-2 shadow-md transition-transform transform hover:-translate-y-0.5"
              style={{ backgroundColor: "#22d3ee" }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#22d3ee";
              }}
            >
              <span className="relative w-5 h-5">
                <FiPause
                  size={20}
                  className={`absolute transition-opacity duration-300 ${
                    !isLearning ? "opacity-100" : "opacity-0"
                  }`}
                />
                <FiPlay
                  size={20}
                  className={`absolute transition-opacity duration-300 ${
                    isLearning ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
              <span className="inline-block min-w-[60px] text-left">
                {!isLearning ? "Learning?" : formatTime(learningSeconds)}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <ChartBarMultiple chartsdata={chartSortedData} key={lastUpdateTime} />
      </div>
    </div>
  );
};
