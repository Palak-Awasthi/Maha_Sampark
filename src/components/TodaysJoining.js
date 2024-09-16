import React from 'react';

function TodaysJoining() {
  // Dummy data for joinings
  const joinings = [
    { name: 'Alice Johnson', message: 'Welcome, Alice Johnson!' },
    { name: 'Bob Brown', message: 'Welcome, Bob Brown!' },
  ];

  return (
    <div className="p-6 bg-gradient-to-r from-green-200 via-green-300 to-green-400 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Today's Joining</h2>
      <ul className="space-y-4">
        {joinings.map((person, index) => (
          <li
            key={index}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <p className="text-lg font-semibold text-gray-700">{person.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodaysJoining;
