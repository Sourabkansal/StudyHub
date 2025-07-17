import React, { useState, useRef, useEffect } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";

const StudyHubNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const profileRef = useRef(null);

  const toggleProfileMenu = () => {
    setIsProfileClicked(!isProfileClicked);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let userdata = null;
  try {
    userdata = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  // If no user data, don't render the navbar
  if (!userdata) {
    return null;
  }
  
  const getRandomColor = () => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-rose-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const avatarColor = getRandomColor();
  const firstLetter = userdata?.username ? userdata.username.charAt(0).toUpperCase() : 'U';
  
  const logout = async () => {
    try {
      // Call backend logout endpoint to clear cookies
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    // Clear localStorage and redirect
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-sm w-full border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">StudyHub</div>

        {/* Desktop Profile and Menu */}
        <div className="relative" ref={profileRef}>
          <div
            className="hidden md:flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors duration-200"
            onClick={toggleProfileMenu}
          >
            <div
              className={`w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center ${avatarColor}`}
            >
              <span className="text-white font-semibold text-sm">{firstLetter}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-800 font-medium text-sm">{userdata?.username || 'User'}</span>
              <span className="text-gray-500 text-xs">{userdata?.email || 'user@example.com'}</span>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-gray-500 transition-transform duration-200 ${
                isProfileClicked ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Desktop Profile Dropdown */}
          {isProfileClicked && (
            <div className="absolute top-14 right-0 z-50 bg-white shadow-lg rounded-xl w-64 p-1 border border-gray-200 transition-all duration-200 transform origin-top-right">
              {/* Profile Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center ${avatarColor}`}
                  >
                    <span className="text-white font-semibold text-sm">{firstLetter}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-sm">{userdata?.username || 'User'}</span>
                    <span className="text-gray-500 text-xs">{userdata?.email || 'user@example.com'}</span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button 
                  className="w-full flex items-center space-x-3 text-left text-sm text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-150"
                >
                  <User size={16} />
                  <span>Profile Settings</span>
                </button>
                
                <button 
                  onClick={logout} 
                  className="w-full flex items-center space-x-3 text-left text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors duration-150"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Content */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 bg-white border-t border-gray-200">
          <div className="relative">
            <div 
              className="flex items-center justify-between mt-4 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
              onClick={toggleProfileMenu}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center ${avatarColor}`}
                >
                  <span className="text-white font-semibold text-sm">{firstLetter}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm">{userdata?.username || 'User'}</span>
                  <span className="text-gray-500 text-xs">{userdata?.email || 'user@example.com'}</span>
                </div>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-500 transition-transform duration-200 ${
                  isProfileClicked ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Mobile Profile Dropdown */}
            {isProfileClicked && (
              <div className="bg-gray-50 rounded-lg p-3 mt-2 space-y-1">
                <button 
                  className="w-full flex items-center space-x-3 text-left text-sm text-gray-700 hover:bg-white px-3 py-2 rounded-lg transition-colors duration-150"
                >
                  <User size={16} />
                  <span>Profile Settings</span>
                </button>
                
                <button 
                  onClick={logout} 
                  className="w-full flex items-center space-x-3 text-left text-sm text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors duration-150"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default StudyHubNavbar;