import React, { useEffect, useState } from 'react';
import News from './News'; // Import the News component
import { FaUserTie, FaBuilding, FaFolderOpen, FaBirthdayCake, FaRegSmile } from 'react-icons/fa';
import axios from 'axios'; // Import Axios

function DashboardContent({ onSelectSection }) {
  const [officerProfiles, setOfficerProfiles] = useState([]);

  // Axios function to fetch officer profiles from Spring Boot backend
  const fetchOfficerProfiles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/officers'); // Change the URL to your Spring Boot endpoint
      setOfficerProfiles(response.data); // Assuming the backend returns an array of officer profiles
    } catch (error) {
      console.error('Error fetching officer profiles:', error);
    }
  };

  // Fetch officer profiles when the component mounts
  useEffect(() => {
    fetchOfficerProfiles();
  }, []);

  return (
    <div className="lg:grid lg:grid-cols-4 lg:gap-6 space-y-6 lg:space-y-0 p-6 bg-gray-50 rounded-lg shadow-lg">
      {/* Left Section */}
      <div className="lg:col-span-3">
        <div className="welcome-container bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-bold welcome-text">Welcome to the Dashboard</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Officer Profile Card */}
          <div
            className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-500 hover:shadow-lg hover:shadow-indigo-500/50 overflow-hidden"
            onClick={() => onSelectSection('officers-profile')}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-30"></div>
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-lg font-semibold">MCS Officer Profile</h3>
              <FaUserTie size={30} />
            </div>
          </div>

          {/* Govt Office Contacts Card */}
          <div
            className="relative bg-gradient-to-r from-green-400 to-blue-500 text-white p-8 rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-500 hover:shadow-lg hover:shadow-blue-500/50 overflow-hidden"
            onClick={() => onSelectSection('govt-offices')}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-30"></div>
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Govt Office Contacts</h3>
              <FaBuilding size={30} />
            </div>
          </div>

          {/* Department Information Card */}
          <div
            className="relative bg-gradient-to-r from-yellow-400 to-red-500 text-white p-8 rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-500 hover:shadow-lg hover:shadow-red-500/50 overflow-hidden"
            onClick={() => onSelectSection('department-information')}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-30"></div>
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Department Information</h3>
              <FaFolderOpen size={30} />
            </div>
          </div>
        </div>

        {/* Large Cards for Today's Birthday and Joining */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Today's Birthday */}
          <div
            className="relative bg-gradient-to-r from-pink-500 to-purple-500 text-white p-12 h-64 lg:h-96 rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-500 hover:shadow-lg hover:shadow-pink-500/50 overflow-hidden"
            onClick={() => onSelectSection('todays-birthday')}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-30"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold text-center">🎉 Happy Birthday!</h3>
              <FaBirthdayCake size={50} className="mx-auto mt-4" />
              <p className="text-center mt-4">John Doe</p> {/* Example content */}
            </div>
          </div>

          {/* Today's Joining */}
          <div
            className="relative bg-gradient-to-r from-green-400 to-teal-600 text-white p-12 h-64 lg:h-96 rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-500 hover:shadow-lg hover:shadow-teal-500/50 overflow-hidden"
            onClick={() => onSelectSection('todays-joining')}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-30"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold text-center">🎉 Welcome Aboard!</h3>
              <FaRegSmile size={50} className="mx-auto mt-4" />
              <p className="text-center mt-4">Jane Smith</p> {/* Example content */}
            </div>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="lg:col-span-1 p-8 bg-white rounded-2xl shadow-lg flex flex-col">
        <h3 className="text-xl font-semibold mb-6">News</h3>
        <div className="flex-1 overflow-auto">
          <News /> {/* Embed the News component */}
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
