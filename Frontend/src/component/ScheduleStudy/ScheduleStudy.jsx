import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { FiCheckSquare, FiCalendar, FiWatch } from "react-icons/fi";
import "react-calendar/dist/Calendar.css";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { GettaskToDo } from "../../Slice/TaskSlice";
import { Deletetasak } from "../../Slice/TaskSlice";
import { isDonee } from "../../Slice/TaskSlice";



const ScheduleStudy = () => {
  const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().toString().slice(0, 11));
  
  const [task, settask] = useState([])
  const [filteredata , setfiltered] = useState([])

const dispatch = useDispatch()

useEffect(() => {
  const fetchData = async () => {
    try {   
      const response = await fetch(`${import.meta.env.VITE_API_URL}/Schedule/ReadTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log(data.taskData);
      dispatch(GettaskToDo(data.taskData));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  fetchData();
}, [task] );


const tasks = useSelector((state) => state.taskToDo.value);

const handleDateChange = (value) => {
  setDate(value);
  setSelectedDate(value.toString().slice(0, 11)); // Just update selectedDate
};

useEffect(() => {
  if (!selectedDate || tasks.length === 0) return;
  const filtered = tasks.filter((item) => {
    return item.date.toString().slice(0, 11) === selectedDate;
  });
  setfiltered(filtered)
}, [selectedDate, tasks]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  let sendData = async (data) => {
    try {
      let response = await fetch(
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

      let responseData = await response.json();
      const notify = () => toast("Task Added successful!");
      notify();
      response.ok(settask(data))
    } catch (error) {

    }
  };
  useEffect(() => {
  setValue("date", selectedDate); // keep RHF in sync
}, [selectedDate, setValue]);

let DeleteTask = async (id)=>{
    let response = await fetch(`${import.meta.env.VITE_API_URL}/Schedule/deleteTask/${id}` , {
       method :'DELETE',
       credentials: "include",
    }
    );
    let  data = await response.json()
     setfiltered(prev => prev.filter(task => task._id !== id));
     dispatch(Deletetasak(id))
    const notify = () => toast(data.message);
    notify();
} 

let isDone = async(id)=>{
  let response = await fetch(`${import.meta.env.VITE_API_URL}/Schedule/isDone/${id}` ,{
    credentials: "include",
  }
  );
  let data = await response.json();
  setfiltered(prev => prev.map((item)=>{
       return item._id==id ? {...item , isDone : !item.isDone } : item
  }))
  // dispatch(isDonee(id))
  console.log(filteredata)
}

  return (
    <div className="bg-gray-50 min-h-screen  p-4">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-evenly py-10 gap-10">
        {/* Calendar - stays on left in desktop, top in mobile */}
        <div className="flex justify-center md:block">
          <Calendar method="post"
            onChange={(value) => {
             setDate(value); // updates selected calendar date
             setSelectedDate(value.toString().slice(0, 11)); // updates your custom formatted date
            handleDateChange(value.toString().slice(0, 11));
            }}
            value={date}
            className="!w-full md:!w-[460px] !text-lg calendar-lg"
          />
        </div>
        {/* Input Section - right on desktop, below in mobile */}
        <div className="w-full md:w-auto ">
          <form onSubmit={handleSubmit(sendData)}>
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <input
                  type="text"
                  className="border p-2 rounded-md"
                  value={selectedDate.toString().slice(0, 11)}
                  readOnly
                  placeholder="Selected date"
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
                {errors.Task && <p> *Please Enter Task </p>}
              </div>
            </div>
            <button
              type="submit"
              onClick={() => console.log("fire")}
              className="bg-blue-600 text-white w-[100%] my-3 px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + Add Task
            </button>
          </form>
          {/* Todo List  */}

          <div className=" mx-auto  bg-white shadow-md rounded-md p-6">
            <div className="flex items-center justify-center space-x-4 bg-blue-600 rounded-lg p-3 shadow-lg max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
              <FiCalendar className="text-white w-8 h-8" />
              <h1 className="text-white text-3xl font-extrabold tracking-wide select-none">
                Task To Do
              </h1>
              <FiCheckSquare className="text-white w-8 h-8 opacity-80" />
            </div>

             {
              filteredata.map((item)=>{
                  return <>
            <div className="flex items-center justify-between py-4  border-b border-gray-300">
              <p className="text-gray-700 font-medium text-lg">{item.Time}</p>
              <h3 className= {`flex-1 text-center text-gray-900 font-semibold text-lg ${item.isDone? "line-through text-black  ": ""}  `} style={item.isDone ? { textDecorationColor: "red" } : {}}>
                {item.Task}
              </h3>

               <button  onClick={()=>{isDone(item._id)}} className="relative inline-block px-4 py-1 mb-3  text-white text-md font-bold rounded-full bg-gradient-to-br from-[#00c6ff] to-[#0072ff] shadow-[0_4px_0_#0072ff] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_0_#0072ff] active:translate-y-0 active:shadow-none">
                Done
              </button>
              
              <button onClick={() => DeleteTask(item._id)} className="relative mx-3 inline-block px-4 py-1 mb-3 text-white text-md font-bold rounded-full bg-gradient-to-br from-[#ff4e50] to-[#c82333] shadow-[0_4px_0_#c82333] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_0_#c82333] active:translate-y-0 active:shadow-none" >
                Delete
              </button>
            </div>
                  </>
              })
             }
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStudy;
