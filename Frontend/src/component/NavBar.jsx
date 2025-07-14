import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const StudyHubNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isclick, setisclick] = useState(false);

  const clicked = () => {
    setisclick(!isclick);
    console.log(isclick);
  };

  const logout =()=>{
        localStorage.removeItem('user');
        window.location.reload(); 
  }

  return (
    <header className="bg-white shadow-sm w-full">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">StudyHub</div>

        <div className="relative">
  <div
    className="hidden md:flex items-center space-x-4 cursor-pointer"
    onClick={clicked}
  >
    <span className="text-gray-800 font-medium">Alex</span>
    <img
      src="https://i.pravatar.cc/40"
      alt="Profile"
      className="w-10 h-10 rounded-full border"
    />
  </div>

  {isclick && (
    <div className="absolute top-14 right-0 z-50 bg-white shadow-lg rounded-xl w-40 p-3 transition-all duration-300">
      <button onClick={logout} className="w-full text-left text-sm font-medium text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg">
        Logout
      </button>
    </div>
  )}
</div>


        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden px-4 pb-4">
          <div
            className="flex items-center justify-between mt-2 border-t pt-4"   
          >
            <span className="text-gray-800 font-medium">Alex</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default StudyHubNavbar;
