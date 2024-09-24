// DashboardContent.js
import React, { useEffect, useState } from 'react';
import News from './News'; // Import the News component
import { FaUserTie, FaBuilding, FaFolderOpen, FaBirthdayCake, FaRegSmile } from 'react-icons/fa';
import axios from 'axios'; // Import Axios
import DashboardCard from './DashboardCard'; // Import the reusable card component

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
    <div className="lg:grid lg:grid-cols-4 lg:gap-6 space-y-6 lg:space-y-0 p-6 bg-gray-50 rounded-lg shadow-lg">
      {/* Left Section */}
      <div className="lg:col-span-3">
        <div className="welcome-container bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-bold welcome-text">Welcome to the Dashboard</h2>
        </div>

        {/* Loading and Error States */}
        {loading && <p>Loading officer profiles...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Officer Profiles Section (if available) */}
        {officerProfiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Officer Profiles</h3>
            <ul>
              {officerProfiles.map((officer) => (
                <li key={officer.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <h4 className="font-bold">{officer.name}</h4>
                  <p>Position: {officer.position}</p>
                  <p>Department: {officer.department}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <DashboardCard
            title="MCS Officer Profile"
            icon={<FaUserTie size={30} />}
            gradientFrom="blue-500"
            gradientTo="purple-600"
            onClick={() => onSelectSection('officers-profile')}
          />
          <DashboardCard
            title="Govt Office Contacts"
            icon={<FaBuilding size={30} />}
            gradientFrom="green-400"
            gradientTo="blue-500"
            onClick={() => onSelectSection('govt-offices')}
          />
          <DashboardCard
            title="Department Information"
            icon={<FaFolderOpen size={30} />}
            gradientFrom="yellow-400"
            gradientTo="red-500"
            onClick={() => onSelectSection('department-information')}
          />
        </div>

        {/* Large Cards for Today's Birthday and Joining */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
{/* Today's Birthday */}
<DashboardCard
  title="🎉 Happy Birthday!"
  icon={<FaBirthdayCake size={50} />}
  gradientFrom="pink-500"
  gradientTo="purple-500"
  onClick={() => onSelectSection('todays-birthday')}
  padding="p-20" // Increased padding
/>

{/* Today's Joining */}
<DashboardCard
  title="🎉 Welcome Aboard!"
  icon={<FaRegSmile size={50} />}
  gradientFrom="green-400"
  gradientTo="teal-600"
  onClick={() => onSelectSection('todays-joining')}
  padding="p-20" // Increased padding
/>
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
