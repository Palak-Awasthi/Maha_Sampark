import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash,FaCheck, FaTimes } from "react-icons/fa";

const GovtOfficeContact = () => {
  const [contacts, setContacts] = useState([]);
  const [formState, setFormState] = useState({
    officeName: "",
    landlineNumber: "",
    district: "",
    taluka: "",
    departmentName: "",
    approvalStatus: "Pending"
  });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/contacts");
      setContacts(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddOrUpdateContact = async () => {
    if (!formState.officeName || !formState.landlineNumber) {
      alert("Office Name and Landline Number fields are required!");
      return;
    }

    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/contacts/${isEditing}`, formState);
        alert("Contact updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/contacts", formState);
        alert("Contact added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchContacts();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditContact = (id) => {
    const contact = contacts.find((c) => c.id === id);
    setFormState({
      officeName: contact.officeName,
      landlineNumber: contact.landlineNumber,
      district: contact.district,
      taluka: contact.taluka,
      departmentName: contact.departmentName,
      approvalStatus: contact.approvalStatus
    });
    setIsEditing(id);
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`http://localhost:8080/api/contacts/${id}`);
        setContacts(contacts.filter((c) => c.id !== id));
        alert("Contact deleted successfully!");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Approved" ? "Pending" : "Approved";
    try {
      await axios.put(`http://localhost:8080/api/contacts/${id}/status`, { status: newStatus });
      fetchContacts();
      alert(`Contact status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredContacts = contacts.filter((c) =>
    c.officeName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({
      officeName: "",
      landlineNumber: "",
      district: "",
      taluka: "",
      departmentName: "",
      approvalStatus: "Pending"
    });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      alert(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
    } else if (error.request) {
      alert("No response received from the server. Please try again.");
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl sm:text-3xl font-bold">
            <span className="mx-2">Govt Office Contacts</span>
          </marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Office"
              value={searchTerm}
              onChange={handleSearch}
              className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-full sm:w-auto"
            />
          )}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            title="Search"
          >
            <FaSearch />
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              setShowSearch(false);
            }}
            className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            title="Reset"
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>

      {/* Add/Update Contact Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            Govt Office Contacts
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            handleAddOrUpdateContact(); // Call your existing function
          }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label htmlFor="officeName" className="block text-gray-700"><strong>Office Name</strong></label>
                <input
                  type="text"
                  id="officeName"
                  value={formState.officeName}
                  onChange={(e) => setFormState({ ...formState, officeName: e.target.value })}
                  placeholder="Office Name"
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="landlineNumber" className="block text-gray-700"><strong>Landline Number</strong></label>
                <input
                  type="text"
                  id="landlineNumber"
                  value={formState.landlineNumber}
                  onChange={(e) => setFormState({ ...formState, landlineNumber: e.target.value })}
                  placeholder="Landline Number"
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="district" className="block text-gray-700"><strong>District</strong></label>
                <select
                  id="district"
                  value={formState.district}
                  onChange={(e) => setFormState({ ...formState, district: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select District</option>
                  {/* Add district options here */}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="taluka" className="block text-gray-700"><strong>Taluka</strong></label>
                <select
                  id="taluka"
                  value={formState.taluka}
                  onChange={(e) => setFormState({ ...formState, taluka: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Taluka</option>
                  {/* Add taluka options here */}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="departmentName" className="block text-gray-700"><strong>Department Name</strong></label>
                <select
                  id="departmentName"
                  value={formState.departmentName}
                  onChange={(e) => setFormState({ ...formState, departmentName: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Department</option>
                  {/* Add department options here */}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {isEditing ? "Update Contact" : "Add Contact"}
            </button>
            
          </form>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">Govt Office Contacts List</h3>
        </div>
        <div className="p-6">
          <table className="min-w-full">
            <thead className="bg-white-300">
              <tr>
               <th className="border px-4 py-2 ">Sr No</th>
                <th className="border px-4 py-2 ">District</th>
                <th className="border px-4 py-2 ">Taluka</th>
                <th className="border px-4 py-2 ">Department Name</th>
                <th className="border px-4 py-2 ">Office Name</th>
                <th className="border px-4 py-2 ">Landline Number</th>
                <th className="border px-4 py-2 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                 <td className="border px-4 py-2">{contact.srno}</td>
                  <td className="border px-4 py-2">{contact.district}</td>
                  <td className="border px-4 py-2">{contact.taluka}</td>
                  <td className="border px-4 py-2">{contact.departmentName}</td>
                  <td className="border px-4 py-2">{contact.officeName}</td>
                  <td className="border px-4 py-2">{contact.landlineNumber}</td>
                  <td className="border px-4 py-2">
                  <button
                      onClick={() => handleToggleStatus(contact.id)}
                      className={`ml-2 ${contact.approvalStatus === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}
                    >
                      {contact.approvalStatus === 'Approved' ? <FaCheck /> : <FaTimes />}
                    </button>
                  
                    <button onClick={() => handleEditContact(contact.id)} className="text-blue-600">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteContact(contact.id)} className="text-red-600 ml-2">
                      <FaTrash />
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GovtOfficeContact;
