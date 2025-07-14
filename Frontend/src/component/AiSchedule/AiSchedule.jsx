import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./AiScheduleLoading.jsx";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

const AiSchedule = () => {
  const location = useLocation();
  const dataToSend = location.state;
  const [ShowInputField, setShowInputField] = useState(false);
  const [searchedData, setSearchedData] = useState({});
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [savedSchedules, setSavedSchedules] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const ShaduleStudy = (data) => {
    const ShaduleData = {
      Standerd: data.standerd,
      Subject: data.Subject,
      Time: data.TimeLeft,
    };
    console.log("ShaduleData", ShaduleData);
    getScheduleData(ShaduleData);
    setShowInputField(false);
  };

  useEffect(() => {
    console.log("Current data state:", data);
    console.log("Is data array?", Array.isArray(data));
  }, [data]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getScheduleData = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/AiSchedul/AiDays`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      const resData = await response.json();
      console.log("API Response:", resData);
      console.log("Schedule data:", resData.schedule);
      setSearchedData(data);
      setData(resData.schedule || []);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setData([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  const SaveSchedule = () => {
    const existingData = JSON.parse(localStorage.getItem("savedSchedule")) || [];
    const updatedData = [...existingData, [data, searchedData]];
    localStorage.setItem("savedSchedule", JSON.stringify(updatedData));
    setSavedSchedules(updatedData); // This will trigger re-render
    toast.success("Saved Successfully");
  };

  const viewShaduled = (schedule) => {
    console.log("Viewing schedule:", schedule);
     const existingData = JSON.parse(localStorage.getItem("savedSchedule")) || [];
     let filterdData =  existingData.filter((item) => item[1].id === schedule);
     setData(filterdData[0][0]);
  };

  const DeleteShadule = (id) => {
    const existingData = JSON.parse(localStorage.getItem("savedSchedule")) || [];
     let filterdData =  existingData.filter((item) => item[1].id != id);
    localStorage.setItem("savedSchedule", JSON.stringify(filterdData));
    setSavedSchedules(filterdData); // Update state to trigger re-render
  }

  useEffect(() => {
    if(dataToSend){
      getScheduleData(dataToSend);
    } else {
      setShowInputField(true);
    }
    
    // Load saved schedules from localStorage
    const saved = localStorage.getItem("savedSchedule");
    if (saved) {
      setSavedSchedules(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
     <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content (80% width) */}
          <div className="w-full lg:w-4/5">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-blue-100">
              {ShowInputField ? (
                <div className="p-6 md:p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 bg-clip-text">
                      Create New Study Schedule
                    </h1>
                    <p className="text-gray-600 mt-3 text-lg">
                      Let AI help you plan your study sessions efficiently
                    </p>
                  </div>
                  <form onSubmit={handleSubmit(ShaduleStudy)} className="max-w-md mx-auto space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Standard <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.standerd
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        } focus:ring-2 focus:outline-none transition`}
                        type="text"
                        placeholder="e.g., 10th Grade"
                        {...register("standerd", { required: true })}
                        />
                      {errors.standerd && (
                        <p className="mt-2 text-sm text-red-600">
                          Please enter your standard
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.Subject
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        } focus:ring-2 focus:outline-none transition`}
                        type="text"
                        placeholder="e.g., Mathematics"
                        {...register("Subject", { required: true })}
                        />
                      {errors.Subject && (
                        <p className="mt-2 text-sm text-red-600">
                          Please enter your subject
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Days Until Exam <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.TimeLeft
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        } focus:ring-2 focus:outline-none transition`}
                        type="number"
                        placeholder="e.g., 14"
                        {...register("TimeLeft", { required: true })}
                        />
                      {errors.TimeLeft && (
                        <p className="mt-2 text-sm text-red-600">
                          Please enter days until exam
                        </p>
                      )}
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full flex justify-center items-center py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                            ></path>
                        </svg>
                        Generate Schedule
                      </button>
                    </div>
                  </form>
                </div>
              ) : isLoading ? (
                <Loader />
              ) : isMobile ? ( 
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-blue-600 mb-6">Your Study Schedule</h2>
                  <div className="space-y-4">
                    {data && Array.isArray(data) && data.map((dayData, dayIndex) => (
                      <div key={dayIndex} className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
                        <button
                          onClick={() => toggleDay(dayIndex)}
                          className={`flex items-center justify-between w-full p-4 font-medium text-left transition-colors ${
                            expandedDay === dayIndex 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                          >
                          <span className="font-semibold">Day {dayIndex + 1}</span>
                          <svg
                            className={`w-5 h-5 transform transition-transform ${
                              expandedDay === dayIndex ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                              />
                          </svg>
                        </button>
                        
                        {expandedDay === dayIndex && (
                          <div className="p-4 space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="text-sm font-medium text-blue-600">Morning</div>
                              <div className="mt-1 text-gray-700">{dayData.morning?.topic}</div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="text-sm font-medium text-blue-600">Afternoon</div>
                              <div className="mt-1 text-gray-700">{dayData.afternoon?.topic}</div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="text-sm font-medium text-blue-600">Evening</div>
                              <div className="mt-1 text-gray-700">{dayData.evening?.topic}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-8 justify-center">
                    <button 
                      onClick={() => setShowInputField(true)}
                      className="flex-1 max-w-xs py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition"
                      >
                      Re-Schedule
                    </button>
                    <button onClick={SaveSchedule} className="flex-1 max-w-xs py-3 px-6 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition">
                      Save Schedule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-600">Your Study Schedule</h2>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowInputField(true)}
                        className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition"
                        >
                        Re-Schedule
                      </button>
                      <button onClick={SaveSchedule} className="py-2 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition">
                        Save Schedule
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-hidden rounded-lg border border-blue-100 shadow">
                    <table className="min-w-full divide-y divide-blue-200">
                      <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Day
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Session
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Scheduled Topics
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-blue-100">
                        {data && Array.isArray(data) && data.map((dayData, dayIndex) => (
                          <React.Fragment key={dayIndex}>
                            <tr className={dayIndex % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                              <td
                                rowSpan="3"
                                className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-800"
                                >
                                Day {dayIndex + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                Morning
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {dayData.morning?.topic}
                              </td>
                            </tr>
                            <tr className={dayIndex % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                Afternoon
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {dayData.afternoon?.topic}
                              </td>
                            </tr>
                            <tr className={dayIndex % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                Evening
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {dayData.evening?.topic}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Saved Schedules Sidebar (20% width) */}
          <div className="w-full lg:w-1/5">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-blue-100 h-full">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                <h3 className="text-lg font-bold">Your Saved Schedules</h3>
              </div>
              <div className="p-4">
                {savedSchedules.length > 0 ? (
                  <div className="space-y-3">
                    {savedSchedules.map((schedule, index) => (
                      <div 
                      key={index} 
                      className="p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-blue-700">{schedule[1].Subject}</h4>
                            <p className="text-sm text-gray-600">{schedule[1].Standerd}th</p>
                          </div>
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                            {schedule[1].Time}d
                          </span>
                        </div>
                        <div className="flex">
                          <button onClick={() => viewShaduled(schedule[1].id)} className="mt-2 w-full text-xs text-center text-blue-600 hover:text-blue-800 font-medium">
                          View Details
                        </button>
                         <button onClick={() => DeleteShadule(schedule[1].id)} className="mt-2 w-full text-xs text-center text-blue-600 hover:text-blue-800 font-medium">
                            Delete
                        </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-12 w-12 mx-auto text-blue-200 mb-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1} 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                        />
                    </svg>
                    <p className="text-sm">No saved schedules yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSchedule;