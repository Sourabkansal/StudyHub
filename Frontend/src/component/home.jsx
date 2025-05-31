import React, { useState } from "react";
import Calendar from "react-calendar";

const Home = () => {
     const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('09:00');

  const handleDateChange = (value) => setDate(value);

 
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
        //   onClick={}
          className="bg-blue-600  w-[90%] text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Task
        </button>

       </div>

         <div>
            <div className="flex gap-4 px-4"> 
            <p className="font-medium text-gray-600">9:00</p>
            <h4 className="font-semibold">Review Math notes</h4>
         </div>
            <div className="h-[1px]  bg-gray-600 w-full"></div>
         </div>

         <div>
            <div className="flex gap-4 px-4"> 
            <p className="font-medium text-gray-600">11:00</p>
            <h4 className="font-semibold">Review  notes</h4>
         </div>
            <div className="h-[1px]  bg-gray-600 w-full"></div>
         </div>
      </div>
    </div>

        <div>Goals & Habits</div>
      </div>

      <div className="flex ">
        <div> 
          Study Group 

        </div>
        <div> Pomodoro Timer</div>
      </div>
    </div>
  );
};

export default Home;
