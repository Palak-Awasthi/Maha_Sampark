import React from 'react';
import { FaBars, FaGlobe } from 'react-icons/fa';

function Header({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-green-500 py-4 px-6 shadow-md flex items-center justify-between">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <h1 className="text-3xl font-bold hover:scale-105 transition-transform duration-300">
          <span className="text-orange-500">महा</span>
          <span className="text-white">SAMPARK</span>
        </h1>
      </div>

      {/* Tagline Section */}
      <div className="hidden md:flex items-center space-x-2 text-white text-base md:text-sm italic">
        <FaGlobe />
        <span>Connecting Communities</span>
      </div>

      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={onToggleSidebar}
        className="text-white md:hidden"
        aria-label="Toggle Sidebar"
      >
        <FaBars size={24} />
      </button>
    </header>
  );
}

export default Header;
