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
      setTask((prev) => [...prev, data]); // Add task to local state to refetch
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
    <div className="bg-gray-50 min-h-screen p-4">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-evenly py-10 gap-10">
        {/* Calendar */}
        <div className="flex justify-center md:block">
          <Calendar
            onChange={(value) => handleDateChange(value)}
            value={date}
            className="!w-full md:!w-[460px] !text-lg calendar-lg"
          />
        </div>

        {/* Form and Tasks */}
        <div className="w-full md:w-auto">
          <form onSubmit={handleSubmit(sendData)}>
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <input
                  type="text"
                  className="border p-2 rounded-md"
                  value={selectedDate}
                  readOnly
                  {...register("date", { required: true })}
                />
                {errors.date && <p>*Please choose Date.</p>}
              </div>

              <div>
                <input
                  type="time"
                  {...register("Time", { required: true })}
                  className="border p-2 rounded-md"
                />
                {errors.Time && (
                  <p className="text-red-600 text-sm mt-1">
                    *Please select a time
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Enter Task"
                  className="border p-2 rounded-md"
                  {...register("Task", { required: true })}
                />
                {errors.Task && <p>*Please Enter Task</p>}
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white w-full my-3 px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + Add Task
            </button>
          </form>

          {/* Task List */}
          <div className="bg-white shadow-md rounded-md p-6">
            <div className="flex items-center justify-center space-x-4 bg-blue-600 rounded-lg p-3 shadow-lg max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
              <FiCalendar className="text-white w-8 h-8" />
              <h1 className="text-white text-3xl font-extrabold tracking-wide select-none">
                Task To Do
              </h1>
              <FiCheckSquare className="text-white w-8 h-8 opacity-80" />
            </div>

            {filteredData.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between py-4 border-b border-gray-300"
              >
                <p className="text-gray-700 font-medium text-lg">{item.Time}</p>
                <h3
                  className={`flex-1 text-center text-gray-900 font-semibold w-[150px] whitespace-nowrap overflow-ellipsis overflow-hidden text-lg ${
                    item.isDone ? "line-through text-black" : ""
                  }`}
                  style={item.isDone ? { textDecorationColor: "red" } : {}}
                >
                  {item.Task}
                </h3>

                <button
                  onClick={() => toggleDone(item._id)}
                  className="relative inline-block px-4 py-1 mb-3 text-white text-md font-bold rounded-full bg-gradient-to-br from-[#00c6ff] to-[#0072ff] shadow-[0_4px_0_#0072ff] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_0_#0072ff] active:translate-y-0 active:shadow-none"
                >
                  Done
                </button>

                <button
                  onClick={() => deleteTask(item._id)}
                  className="relative mx-3 inline-block px-4 py-1 mb-3 text-white text-md font-bold rounded-full bg-gradient-to-br from-[#ff4e50] to-[#c82333] shadow-[0_4px_0_#c82333] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_0_#c82333] active:translate-y-0 active:shadow-none"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStudy;
