import React, { useEffect, useState } from 'react';

function TodaysJoining() {
  const [joinings, setJoinings] = useState([]); // State to store names of today's joiners
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage any errors

  // Function to fetch today's joining names from the API
  const fetchTodaysJoinings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/mcs/todays-joinings'); // API call
      if (!response.ok) {
        throw new Error('Failed to fetch data from the API'); // Handle response errors
      }
      const data = await response.json(); // Parse JSON response
      console.log('API Response:', data); // Log the response for debugging
      setJoinings(data); 
    } catch (error) {
      setError(error.message); // Set error state if there's an issue
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  useEffect(() => {
    fetchTodaysJoinings(); // Fetch data on component mount
  }, []);

  // Show loading state while fetching
  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  // Render the list of names or a message if no joinings today
  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-400 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">Today's Joinings</h2>
      <ul className="space-y-4">
        {joinings.length > 0 ? (
          joinings.map((name, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <p className="text-lg font-semibold text-gray-700">Welcome {name} !!</p> {/* Display name */}
            </li>
          ))
        ) : (
          <li className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-700">No joinings today.</p> {/* Fallback message */}
          </li>
        )}
      </ul>
    </div>
  );
}

export default TodaysJoining;
