import React, { useState } from 'react';
import { FaShareAlt, FaPhone } from 'react-icons/fa';

const mockData = [
  {
    departmentName: 'Revenue Department',
    officeName: 'Office A',
    district: 'District 1',
    taluka: 'Taluka A',
    contactNo: '123-456-7890',
  },
  {
    departmentName: 'Health Department',
    officeName: 'Office B',
    district: 'District 2',
    taluka: 'Taluka B',
    contactNo: '987-654-3210',
  },
  // Add more mock data as needed
];

function GovtOfficeContacts() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockData.filter((office) =>
    office.officeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-blue-100 min-h-screen rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Government Office Contacts</h2>
      <input
        type="text"
        placeholder="Search Offices..."
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredData.map((office, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center"
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{office.officeName}</h3>
              <p className="mb-1"><strong>Department:</strong> {office.departmentName}</p>
              <p className="mb-1"><strong>District:</strong> {office.district}</p>
              <p className="mb-1"><strong>Taluka:</strong> {office.taluka}</p>
              <p><strong>Contact No:</strong> {office.contactNo}</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition transform hover:scale-110">
                <FaShareAlt size={20} />
              </button>
              <button className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition transform hover:scale-110">
                <FaPhone size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GovtOfficeContacts;
