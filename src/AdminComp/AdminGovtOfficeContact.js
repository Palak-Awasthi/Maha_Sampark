import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GovtOfficeContact() {
  const [contacts, setContacts] = useState([]);
  const [filters, setFilters] = useState({
    district: '',
    taluka: '',
    deptName: '',
    officeName: '',
    landlineNumber: '',
  });

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/govtoffices'); // Replace with actual API endpoint
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    // You can add logic to filter contacts based on filters here
    fetchContacts(); // For now, just refetch the contacts
  };

  const handleReset = () => {
    setFilters({
      district: '',
      taluka: '',
      deptName: '',
      officeName: '',
      landlineNumber: '',
    });
    fetchContacts(); // Reset the filters and refetch the data
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">Govt Office Contacts</h2>
      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <select
          name="district"
          value={filters.district}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Select District</option>
          {/* Add district options here */}
        </select>
        <select
          name="taluka"
          value={filters.taluka}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Select Taluka</option>
          {/* Add taluka options here */}
        </select>
        <select
          name="deptName"
          value={filters.deptName}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Select Department</option>
          {/* Add department options here */}
        </select>
        <input
          name="officeName"
          type="text"
          value={filters.officeName}
          onChange={handleInputChange}
          placeholder="Search Office Name"
          className="border p-2 rounded"
        />
        <input
          name="landlineNumber"
          type="text"
          value={filters.landlineNumber}
          onChange={handleInputChange}
          placeholder="Search Landline Number"
          className="border p-2 rounded"
        />
      </div>
      {/* Search and Reset buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded ml-auto">
          + Add New Contact
        </button>
      </div>

      {/* Contact List */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Sr.No.</th>
            <th className="border px-4 py-2">District</th>
            <th className="border px-4 py-2">Taluka</th>
            <th className="border px-4 py-2">Dept Name</th>
            <th className="border px-4 py-2">Office Name</th>
            <th className="border px-4 py-2">STD Code/Landline Number</th>
            <th className="border px-4 py-2">Phone Number</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={contact.id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{contact.district}</td>
              <td className="border px-4 py-2">{contact.taluka || '--'}</td>
              <td className="border px-4 py-2">{contact.deptName || '--'}</td>
              <td className="border px-4 py-2">{contact.officeName || '--'}</td>
              <td className="border px-4 py-2">{contact.landline || '--'}</td>
              <td className="border px-4 py-2">{contact.phoneNumber || '--'}</td>
              <td className="border px-4 py-2">
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    contact.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                  } text-white`}
                >
                  {contact.status}
                </span>
              </td>
              <td className="border px-4 py-2">
                <button className="text-yellow-500 mr-2">
                  {/* Edit Icon */}
                  ✏️
                </button>
                <button className="text-red-500">
                  {/* Delete Icon */}
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GovtOfficeContact;
