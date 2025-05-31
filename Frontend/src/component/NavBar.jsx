import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const StudyHubNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm w-full">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">StudyHub</div>

        <div className="hidden md:flex items-center space-x-4">
          <span className="text-gray-800 font-medium">Alex</span>
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="w-10 h-10 rounded-full border"
          />
        </div>

        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex items-center justify-between mt-2 border-t pt-4">
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
