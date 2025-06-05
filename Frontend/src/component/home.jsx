import React, { useState } from "react";
import Calendar from "react-calendar";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import robotvideo from "../assets/WhatsApp Video 2025-06-03 at 2.18.23 AM.mp4";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { GettaskToDo } from "../Slice/TaskSlice";

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toString().slice(0, 11));
  const [filteredata, setfiltered] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDateChange = (value) => {
    setDate(value);
    setSelectedDate(value.toString().slice(0, 11)); // Just update selectedDate
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
        dispatch(GettaskToDo(data.taskData));
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const tasks = useSelector((state) => state.taskToDo.value);

  useEffect(() => {
    if (!selectedDate || tasks.length === 0) return;
    const filtered = tasks.filter((item) => {
      return item.date.toString().slice(0, 11) === selectedDate;
    });
    console.log("Filtered Tasks for", selectedDate, filtered);
    setfiltered(filtered);
  }, [selectedDate, tasks]);

  let isDone = async (id) => {
    let response = await fetch(
      `${import.meta.env.VITE_API_URL}/Schedule/isDone/${id}`,
      {
        credentials: "include",
      }
    );
    let data = await response.json();
    setfiltered((prev) =>
      prev.map((item) => {
        return item._id == id ? { ...item, isDone: !item.isDone } : item;
      })
    );
    console.log(data);
  };

  return (
    <div className="bg-gray-50">
      <div className="flex ">
        <div className="  flex  p-6">
          <div className="bg-white p-6 rounded-xl shadow-lg  space-y-4">
            <h2 className="text-2xl font-bold">📅 Schedule Study </h2>

            <Calendar
              onChange={handleDateChange}
              value={date}
              className="!w-[260px] !text-sm calendar-sm"
            />

            <div className="flex justify-center">
              <button
                onClick={() => navigate("/ScheduleStudy")}
                className="bg-blue-600  w-[90%] text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                + Add Task
              </button>
            </div>
            {filteredata.map((item) => {
              return (
                <>
                  <div>
                    <div className="flex justify-between  px-4">
                      <div className="flex gap-4">
                        <p className="font-medium text-gray-600">{item.Time}</p>
                      <h4
                        className={`font-semibold max-w-[65%] whitespace-nowrap overflow-ellipsis overflow-hidden  ${
                          item.isDone ? "line-through text-black  " : ""
                        } `}
                        style={
                          item.isDone ? { textDecorationColor: "red" } : {}
                        }
                      >
                        {item.Task}
                      </h4>
                      </div>
                      <button
                        onClick={() => {
                          isDone(item._id);
                        }}
                        className="relative inline-block px-3 py-1 mb-3 text-white text-sm font-bold rounded-full bg-gradient-to-br from-[#00c6ff] to-[#0072ff] shadow-[0_4px_0_#0072ff] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_0_#0072ff] active:translate-y-0 active:shadow-none"
                      >
                        Done
                      </button>
                    </div>
                    <div className="h-[1px]  bg-gray-600 w-full"></div>
                  </div>
                </>
              );
            })}
          </div>
        </div>

        <div> charts and records </div>
        <div className="fixed right-0 bottom-0 h-[45vh] animate-none ">
          {/* <video
            src={robotvideo}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            // className="w-0 h-0 "
            className="w-full h-full mix-blend-color-burn"
          ></video> */}
        </div>
      </div>

      <div className="flex ">
        <div>Study Group</div>
        <div> Pomodoro Timer</div>
      </div>
    </div>
  );
};

export default Home;
