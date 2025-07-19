import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GettaskToDo } from "../Slice/TaskSlice";
import { useForm } from "react-hook-form";
import { RepostCharts } from "./charts/RepostCharts";
import ChatBot from "./ChatBot";

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toString().slice(0, 11)
  );
  const [filteredata, setfiltered] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let ShaduleStudy = (data) => {
    const ShaduleData = {
      id: Math.random().toString(36).substring(2, 15),
      Standerd: data.standerd,
      Subject: data.Subject,
      Time: data.TimeLeft,
    };
    navigate("/AiSchedule", { state: ShaduleData });
  };

  const handleDateChange = (value) => {
    setDate(value);
    setSelectedDate(value.toString().slice(0, 11));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/Schedule/ReadTask`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        // CRITICAL iOS FIX: Ensure taskData is always an array
        const taskData = data?.taskData || [];
        dispatch(GettaskToDo(taskData));
      } catch (error) {
        console.error("Fetch error:", error);
        // Dispatch empty array on error
        dispatch(GettaskToDo([]));
      }
    };
    fetchData();
  }, [dispatch]);

  // CRITICAL iOS FIX: Ensure tasks is always an array
  const tasks = useSelector((state) => state.taskToDo.value) || [];

  useEffect(() => {
    // CRITICAL iOS FIX: Comprehensive null checking for arrays
    if (!selectedDate || !tasks || !Array.isArray(tasks) || tasks.length === 0) {
      setfiltered([]);
      return;
    }
    
    const filtered = tasks.filter((item) => {
      // Additional safety checks for item properties
      if (!item || !item.date) return false;
      
      try {
        return item.date.toString().slice(0, 11) === selectedDate;
      } catch (error) {
        console.error("Error filtering task:", error);
        return false;
      }
    });
    setfiltered(filtered);
  }, [selectedDate, tasks]);

  let isDone = async (id) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/Schedule/isDone/${id}`,
        {
          credentials: "include",
        }
      );
      let data = await response.json();
      
      // CRITICAL iOS FIX: Safe state update with array checks
      setfiltered((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.map((item) =>
          item && item._id === id ? { ...item, isDone: !item.isDone } : item
        );
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          {/* Calendar + Tasks */}
          <div className="w-full lg:w-[320px]">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">📅 Schedule Study</h2>
              <Calendar
                onChange={handleDateChange}
                value={date}
                className="!w-full text-sm"
              />
              <div className="flex justify-center">
                <button
                  onClick={() => navigate("/ScheduleStudy")}
                  className="bg-blue-600 w-full text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  + Add Task
                </button>
              </div>
              {/* CRITICAL iOS FIX: Safe array mapping with additional checks */}
              {Array.isArray(filteredata) && filteredata.length > 0 && filteredata.map((item) => {
                // Additional safety check for each item
                if (!item || !item._id) return null;
                
                return (
                  <div key={item._id}>
                    <div className="flex justify-between px-2 sm:px-4 items-center">
                      <div className="flex gap-2 sm:gap-4 items-center">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">
                          {item.Time || 'N/A'}
                        </p>
                        <h4
                          className={`text-xs sm:text-sm font-semibold w-[100px] overflow-hidden overflow-ellipsis whitespace-nowrap ${
                            item.isDone ? "line-through text-black" : ""
                          }`}
                          style={
                            item.isDone ? { textDecorationColor: "red" } : {}
                          }
                        >
                          {item.Task || 'No Task'}
                        </h4>
                      </div>
                      <button
                        onClick={() => isDone(item._id)}
                        className="text-xs sm:text-sm px-3 py-1 text-white rounded-full bg-gradient-to-br from-[#00c6ff] to-[#0072ff] shadow hover:-translate-y-1 transition-all"
                      >
                        Done
                      </button>
                    </div>
                    <div className="h-[1px] bg-gray-300 w-full my-1"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts */}
          <div className="w-full lg:w-[40%] bg-white rounded-xl shadow-lg p-4">
            <RepostCharts />
          </div>

          {/* AI Assistance */}
          <div className="w-full lg:w-[30%] bg-white p-4 sm:p-6 rounded-xl shadow-lg space-y-4">
            <h1 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
              <span className="text-blue-600 text-xl sm:text-2xl font-bold">
                Schedule
              </span>{" "}
              Your Study <br />
              <span className="text-purple-600 font-medium">Smartly</span> with{" "}
              <span className="text-green-600 font-semibold">AI Assistance</span>
            </h1>

            <form onSubmit={handleSubmit(ShaduleStudy)} className="space-y-3">
              <input
                className="w-full border p-2 rounded-md"
                type="text"
                placeholder="Enter Standard"
                {...register("standerd", { required: true })}
              />
              {errors.standerd && (
                <p className="text-red-500 text-sm">Please enter standard</p>
              )}

              <input
                className="w-full border p-2 rounded-md"
                type="text"
                placeholder="Enter Subject"
                {...register("Subject", { required: true })}
              />
              {errors.Subject && (
                <p className="text-red-500 text-sm">Please enter subject</p>
              )}

              <input
                className="w-full border p-2 rounded-md"
                type="number"
                placeholder="Days left in Exam"
                {...register("TimeLeft", { required: true })}
              />
              {errors.TimeLeft && (
                <p className="text-red-500 text-sm">Please enter time left</p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                <svg height={20} width={20} fill="white" viewBox="0 0 24 24">
                  <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
                </svg>
                <span className="font-semibold">Schedule</span>
              </button>
            </form>
              <NavLink to={"/AiSchedule"}>
              <button
                className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                <span className="font-semibold">Check Scheduled Plan</span>
              </button>
                </NavLink>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 flex flex-col sm:flex-row justify-around items-center gap-4 text-center text-gray-600 text-sm sm:text-base">
          <div className="bg-white px-4 py-2 rounded-lg shadow w-full sm:w-auto">
            📚 Study Group
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow w-full sm:w-auto">
            ⏳ Pomodoro Timer
            <ChatBot/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;