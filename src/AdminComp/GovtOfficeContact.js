import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

const GovtOfficeContact = () => {
  const [contacts, setContacts] = useState([]);
  const [filters, setFilters] = useState({
    district: "",
    taluka: "",
    deptName: "",
    officeName: "",
    landlineNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contacts from backend API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/govtoffices", {
        params: filters,
      });
      setContacts(response.data);
    } catch (err) {
      setError("Error fetching contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFilters({
      district: "",
      taluka: "",
      deptName: "",
      officeName: "",
      landlineNumber: "",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-grow">
        <AdminHeader />
        <div className="flex-grow p-6 bg-white overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Govt Office Contacts</h2>

          {/* Filter Section */}
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              name="district"
              value={filters.district}
              onChange={handleInputChange}
              className="border p-2 rounded w-full sm:w-1/4"
            >
              <option value="">Select District</option>
              {/* Add district options here */}
            </select>
            <select
              name="taluka"
              value={filters.taluka}
              onChange={handleInputChange}
              className="border p-2 rounded w-full sm:w-1/4"
            >
              <option value="">Select Taluka</option>
              {/* Add taluka options here */}
            </select>
            <select
              name="deptName"
              value={filters.deptName}
              onChange={handleInputChange}
              className="border p-2 rounded w-full sm:w-1/4"
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
              className="border p-2 rounded w-full sm:w-1/4"
            />
            <input
              name="landlineNumber"
              type="text"
              value={filters.landlineNumber}
              onChange={handleInputChange}
              placeholder="Search Landline Number"
              className="border p-2 rounded w-full sm:w-1/4"
            />
            <button
              onClick={handleReset}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
            <button
              onClick={fetchContacts}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </div>

          {/* Loading and Error Handling */}
          {loading && <p>Loading contacts...</p>}
          {error && <p className="text-red-500">{error}</p>}

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
                        contact.status === "Active" ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <button className="text-yellow-500 mr-2">✏️</button>
                    <button className="text-red-500">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default GovtOfficeContact;
