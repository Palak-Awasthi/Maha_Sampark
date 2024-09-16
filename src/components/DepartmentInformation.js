import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

const mockData = [
  {
    title: 'Department Policy',
    type: 'Policy',
    subType: 'Internal',
    dateOfUpdate: '2024-09-10',
    fileUrl: 'https://via.placeholder.com/300x200' // Placeholder URL
  },
  {
    title: 'Annual Report',
    type: 'Report',
    subType: 'Annual',
    dateOfUpdate: '2024-08-15',
    fileUrl: 'https://via.placeholder.com/300x200' // Placeholder URL
  },
  // Add more mock data as needed
];

function DepartmentInformation() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = mockData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-blue-100 min-h-screen rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Department Information</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Title"
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />

      {/* List of Department Information */}
      <div className="space-y-6">
        {filteredData.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="mb-1"><strong>Type:</strong> {item.type}</p>
            <p className="mb-1"><strong>Sub-Type:</strong> {item.subType}</p>
            <p className="mb-1"><strong>Date of Update:</strong> {item.dateOfUpdate}</p>
            <a
              href={item.fileUrl}
              download
              className="inline-flex items-center mt-4 text-yellow-200 hover:text-yellow-100 transition"
            >
              <FaDownload className="mr-2" size={20} />
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentInformation;
