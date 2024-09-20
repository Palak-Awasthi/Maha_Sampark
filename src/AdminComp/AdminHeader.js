import React from 'react';
import { FaBars, FaGlobe } from 'react-icons/fa';

function AdminHeader() {
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

      {/* Admin Info (Optional) */}
      <div className="hidden md:flex items-center space-x-4">
        <p className="text-sm text-white">Admin Name</p>
        <img
          src="https://via.placeholder.com/40"
          alt="Admin Avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>

      {/* Hamburger Menu Icon for mobile view */}
      <div className="md:hidden">
        <FaBars className="text-2xl text-white" />
      </div>
    </header>
  );
}

export default AdminHeader;

