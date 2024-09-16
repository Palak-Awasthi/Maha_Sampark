import React, { useState } from 'react';
import { FaShare, FaEnvelope, FaPhone, FaCommentDots } from 'react-icons/fa';

function MCAOfficersProfile() {
  const [searchTerm, setSearchTerm] = useState('');

  const officers = [
    // Example officer data
    { name: 'John Doe', designation: 'Officer', contact: '123-456-7890', profilePic: 'https://via.placeholder.com/150' },
    { name: 'Jane Smith', designation: 'Senior Officer', contact: '987-654-3210', profilePic: 'https://via.placeholder.com/150' },
    // Add more officers as needed
  ];

  const filteredOfficers = officers.filter(officer =>
    officer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search Officers"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full shadow-md focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOfficers.map((officer, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            {/* Officer Image */}
            <img
              src={officer.profilePic}
              alt={officer.name}
              className="w-24 h-24 rounded-full object-cover mb-4 mx-auto animate-fadeIn"
            />
            {/* Officer Info */}
            <h3 className="text-xl font-semibold mb-2 text-center">
              {officer.name}
            </h3>
            <p className="mb-2 text-center">{officer.designation}</p>
            <p className="mb-4 text-center">{officer.contact}</p>
            
            {/* Action Buttons */}
            <div className="flex justify-around">
              <button className="hover:text-gray-200 hover:scale-110 transform transition duration-200">
                <FaShare size={20} />
              </button>
              <button className="hover:text-gray-200 hover:scale-110 transform transition duration-200">
                <FaEnvelope size={20} />
              </button>
              <button className="hover:text-gray-200 hover:scale-110 transform transition duration-200">
                <FaPhone size={20} />
              </button>
              <button className="hover:text-gray-200 hover:scale-110 transform transition duration-200">
                <FaCommentDots size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MCAOfficersProfile;
