import React from 'react'

const Streak = ( {streak , largestStreak }) => {
    let streakdata = 24 ;
    let totalLoginday = 41 ;

   

return (
<div className="relative bg-white rounded-xl shadow-md w-full  h-[10.5rem] p-4">
  <h2 className="text-center text-lg font-semibold text-gray-700">Streak</h2>

  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <span className="font-extrabold text-2xl text-blue-600 tracking-wide">
      {streak}
    </span>
  </div>

  <p className="absolute bottom-2 right-3 text-sm text-gray-500 font-medium">
     Largest  : {largestStreak}
  </p>
</div>



  )
}

export default Streak