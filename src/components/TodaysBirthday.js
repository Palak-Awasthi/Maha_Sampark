import React from 'react';

function TodaysBirthday() {
  // Dummy data for birthday
  const birthdays = [
    { name: 'John Doe', message: 'Happy Birthday John!' },
    { name: 'Jane Smith', message: 'Happy Birthday Jane!' },
  ];

  return (
    <div className="p-6 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Today's Birthday</h2>
      <ul className="space-y-4">
        {birthdays.map((person, index) => (
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

export default TodaysBirthday;
