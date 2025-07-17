import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { FiCheckSquare, FiCalendar } from "react-icons/fi";
import "react-calendar/dist/Calendar.css";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { GettaskToDo, Deletetasak, isDonee } from "../../Slice/TaskSlice";

const ScheduleStudy = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toString().slice(0, 11)
  );

  const [task, setTask] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.taskToDo.value);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

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
        dispatch(GettaskToDo(data.taskData));
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, [task, dispatch]);

  const handleDateChange = (value) => {
    setDate(value);
    setSelectedDate(value.toString().slice(0, 11));
  };

  useEffect(() => {
    if (!selectedDate || !Array.isArray(tasks) || tasks.length === 0) return;

    const filtered = tasks.filter((item) => {
      return item.date.toString().slice(0, 11) === selectedDate;
    });
    setFilteredData(filtered);
  }, [selectedDate, tasks]);

  useEffect(() => {
    setValue("date", selectedDate);
  }, [selectedDate, setValue]);

  const sendData = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/Schedule/GetTasktime`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      const responseData = await response.json();
      toast("Task Added successfully!");
      setTask((prev) => [...prev, data]);
    } catch (error) {
      console.error("Add task error:", error);
      toast.error("Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/Schedule/deleteTask/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      setFilteredData((prev) => prev.filter((task) => task._id !== id));
      dispatch(Deletetasak(id));
      toast(data.message);
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error("Failed to delete task");
    }
  };

  const toggleDone = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/Schedule/isDone/${id}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setFilteredData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isDone: !item.isDone } : item
        )
      );
      dispatch(isDonee(id));
    } catch (error) {
      console.error("Update done error:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <ToastContainer />
      <div className="flex flex-col xl:flex-row justify-center xl:justify-evenly items-start py-12 gap-12 max-w-7xl mx-auto">
        <div className="flex justify-center w-full xl:w-auto">
          <Calendar
            onChange={(value) => handleDateChange(value)}
            value={date}
            className="!w-full sm:!w-[500px] lg:!w-[520px] !text-lg calendar-lg shadow-lg rounded-lg"
          />
        </div>

        <div className="w-full xl:w-[600px] space-y-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit(sendData)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={selectedDate}
                    readOnly
                    {...register("date", { required: true })}
                  />
                  {errors.date && <p className="text-red-600 text-sm">*Please choose Date.</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    {...register("Time", { required: true })}
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.Time && (
                    <p className="text-red-600 text-sm">*Please select a time</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Task</label>
                  <input
                    type="text"
                    placeholder="Enter Task"
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    {...register("Task", { required: true })}
                  />
                  {errors.Task && <p className="text-red-600 text-sm">*Please Enter Task</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
              >
                + Add Task
              </button>
            </form>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center justify-center space-x-4 bg-blue-600 rounded-lg p-4 shadow-lg mb-8 transform hover:scale-105 transition-transform duration-300">
              <FiCalendar className="text-white w-8 h-8" />
              <h1 className="text-white text-xl font-extrabold tracking-wide select-none">
                Task To Do
              </h1>
              <FiCheckSquare className="text-white w-8 h-8 opacity-80" />
            </div>

            <div className="space-y-4">
              {filteredData.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-6 px-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 mb-4 sm:mb-0">
                    <p className="text-gray-700 font-medium text-lg bg-blue-100 px-3 py-1 rounded-md min-w-[80px] text-center">
                      {item.Time}
                    </p>
                    <h3
                      className={`flex-1 text-gray-900 font-semibold text-lg break-words ${
                        item.isDone ? "line-through text-gray-500" : ""
                      }`}
                      style={item.isDone ? { textDecorationColor: "red" } : {}}
                    >
                      {item.Task}
                    </h3>
                  </div>

                  <div className="flex gap-3 justify-around sm:justify-start">
                    <button
                      onClick={() => toggleDone(item._id)}
                      className="px-6 py-2 text-white text-sm font-bold rounded-full bg-gradient-to-br from-[#00c6ff] to-[#0072ff] shadow-[0_4px_0_#0072ff] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_0_#0072ff] active:translate-y-0 active:shadow-none"
                    >
                      Done
                    </button>

                    <button
                      onClick={() => deleteTask(item._id)}
                      className="px-6 py-2 text-white text-sm font-bold rounded-full bg-gradient-to-br from-[#ff4e50] to-[#c82333] shadow-[0_4px_0_#c82333] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_0_#c82333] active:translate-y-0 active:shadow-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStudy;