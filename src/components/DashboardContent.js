import React, { useEffect, useState } from 'react';
import { FaUserTie, FaBuilding, FaFolderOpen, FaBirthdayCake, FaRegSmile } from 'react-icons/fa';
import axios from 'axios'; // Import Axios
import DashboardCard from './DashboardCard'; // Import the reusable card component
import News from './News'; // Import the News component
import Skeleton from 'react-loading-skeleton'; // Loading skeleton for better UX

function DashboardContent({ onSelectSection }) {
  const [officerProfiles, setOfficerProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Axios function to fetch officer profiles from Spring Boot backend
  const fetchOfficerProfiles = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      const response = await axios.get('http://localhost:8080/api/officers'); // Change the URL to your Spring Boot endpoint
      setOfficerProfiles(response.data); // Assuming the backend returns an array of officer profiles
    } catch (error) {
      setError('Error fetching officer profiles. Please try again later.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch officer profiles when the component mounts
  useEffect(() => {
    fetchOfficerProfiles();
  }, []);

  return (
    <div className="lg:grid lg:grid-cols-4 lg:gap-6 space-y-6 lg:space-y-0 p-10 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg shadow-lg">
      {/* Left Section */}
      <div className="lg:col-span-4">
        <div className="bg-gradient-to-br from-blue-400 to-blue-100 rounded-lg p-10 mb-6 shadow-md text-white transition-transform transform hover:scale-105 duration-300">
          <h2 className="text-3xl font-bold">Welcome to the Dashboard</h2>
          <p className="mt-2">Here is a quick overview of today's highlights and updates</p>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="mt-6">
            <Skeleton count={5} height={50} className="mb-4" />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {/* Officer Profiles Section (if available) */}
        {officerProfiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Officer Profiles</h3>
            <ul className="space-y-4">
              {officerProfiles.map((officer) => (
                <li key={officer.id} className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
                  <h4 className="font-bold text-gray-700">{officer.name}</h4>
                  <p className="text-gray-600">Position: {officer.position}</p>
                  <p className="text-gray-600">Department: {officer.department}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <DashboardCard
            title="MCS Officer Profile"
            icon={<FaUserTie size={50} />}
            gradientFrom="bg-gradient-to-r from-blue-500 to-purple-600"
            onClick={() => onSelectSection('officers-profile')}
            description={`${officerProfiles.length} Profiles`}
          />
          <DashboardCard
            title="Govt Office Contacts"
            icon={<FaBuilding size={50} />}
            gradientFrom="bg-gradient-to-r from-green-400 to-blue-500"
            onClick={() => onSelectSection('govt-offices')}
            description="Explore Contacts"
          />
          <DashboardCard
            title="Department Information"
            icon={<FaFolderOpen size={0} />}
            gradientFrom="bg-gradient-to-r from-yellow-400 to-red-500"
            onClick={() => onSelectSection('department-information')}
            description="Details and Statistics"
          />
        </div>

        {/* Large Cards for Today's Birthday and Joining */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Today's Birthday */}
          <DashboardCard
            title="🎉 Happy Birthday!"
            icon={<FaBirthdayCake size={50} />}
            gradientFrom="bg-gradient-to-r from-pink-500 to-purple-500"
            onClick={() => onSelectSection('todays-birthday')}
            description="Celebrate their special day"
            padding="p-7" // Adjust padding for better appearance
          />

          {/* Today's Joining */}
          <DashboardCard
            title="🎉 Welcome Aboard!"
            icon={<FaRegSmile size={50} />}
            gradientFrom="bg-gradient-to-r from-green-400 to-teal-600"
            onClick={() => onSelectSection('todays-joining')}
            description="Meet the new members"
            padding="p-7" // Adjust padding for better appearance
          />
        </div>

        {/* News Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">Latest News</h3>
          <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300">
            <News /> {/* Embed the News component */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
