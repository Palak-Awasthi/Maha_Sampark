import React, { useState, useEffect } from 'react';
import { FaShareAlt, FaPhone } from 'react-icons/fa';
import axios from 'axios';

function GovtOfficeContacts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/contacts'); // Adjust the URL as needed
        setContacts(response.data);
      } catch (err) {
        setError('Error fetching contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const filteredData = contacts.filter((office) =>
    office.officeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  
  const handleShare = (office) => {
    const contactDetails = `
      Department: ${office.departmentName}
      Office: ${office.officeName}
      District: ${office.district}
      Taluka: ${office.taluka}
      Contact No: ${office.landlineNumber}
    `;
    navigator.clipboard.writeText(contactDetails)
      .then(() => alert('Contact details copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-400 min-h-screen rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">Government Office Contacts</h2>
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
              <p><strong>Landline No:</strong> {office.landlineNumber}</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
            <button 
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition transform hover:scale-110"
            onClick={() => handleShare(office)}
          >
            <FaShareAlt size={20} />
          </button>
          <a 
            href={`tel:${office.landlineNumber}`} 
            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition transform hover:scale-110"
          >
            <FaPhone size={20} />
          </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GovtOfficeContacts;
