import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const PoliticianList = () => {
  const [politicians, setPoliticians] = useState([]);
  const [formState, setFormState] = useState({
    name: "",
    party: "",
    constituency: "",
    state: "", // Changed to dropdown
    yearOfElection: "", // Changed to dropdown
    position: "", // Changed to dropdown
    phoneNumber: "",
    email: "",
    approvalStatus: "Pending"
  });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Options for dropdowns
  const stateOptions = ["State A", "State B", "State C"]; // Replace with actual states
  const yearOfElectionOptions = ["2020", "2021", "2022", "2023", "2024"]; // Add more years as needed
  const positionOptions = ["Member of Parliament", "State Legislator", "Mayor"]; // Replace with actual positions

  useEffect(() => {
    fetchPoliticians();
  }, []);

  const fetchPoliticians = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/politicians");
      setPoliticians(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddOrUpdatePolitician = async () => {
    if (!formState.name || !formState.party) {
      alert("Name and Party fields are required!");
      return;
    }

    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/politicians/${isEditing}`, formState);
        alert("Politician updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/politicians", formState);
        alert("Politician added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchPoliticians();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdatePolitician();
  };

  const handleEditPolitician = (id) => {
    const politician = politicians.find((p) => p.id === id);
    setFormState({
      name: politician.name,
      party: politician.party,
      constituency: politician.constituency,
      state: politician.state, // Updated
      yearOfElection: politician.yearOfElection, // Updated
      position: politician.position, // Updated
      phoneNumber: politician.phoneNumber,
      email: politician.email,
      approvalStatus: politician.approvalStatus
    });
    setIsEditing(id);
  };

  const handleDeletePolitician = async (id) => {
    if (window.confirm("Are you sure you want to delete this politician?")) {
      try {
        await axios.delete(`http://localhost:8080/api/politicians/${id}`);
        setPoliticians(politicians.filter((p) => p.id !== id));
        alert("Politician deleted successfully!");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Approved" ? "Pending" : "Approved";
    try {
      await axios.put(`http://localhost:8080/api/politicians/${id}/status`, { status: newStatus });
      fetchPoliticians();
      alert(`Politician status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPoliticians = politicians.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({
      name: "",
      party: "",
      constituency: "",
      state: "", // Reset dropdown
      yearOfElection: "", // Reset dropdown
      position: "", // Reset dropdown
      phoneNumber: "",
      email: "",
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
            <span className="mx-2">Politician</span>
            <span className="mx-2">Profile</span>
            <span className="mx-2">List</span>
          </marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Politician"
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

      {/* Add/Update Politician Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit Politician" : "Add Politician"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Row 1 - Name and Party */}
              <div className="col-span-1">
                <label htmlFor="name" className="block text-gray-700"><strong>Name</strong></label>
                <input
                  type="text"
                  id="name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Name"
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="party" className="block text-gray-700"><strong>Party</strong></label>
                <input
                  type="text"
                  id="party"
                  value={formState.party}
                  onChange={(e) => setFormState({ ...formState, party: e.target.value })}
                  placeholder="Party"
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="constituency" className="block text-gray-700"><strong>Constituency</strong></label>
                <input
                  type="text"
                  id="constituency"
                  value={formState.constituency}
                  onChange={(e) => setFormState({ ...formState, constituency: e.target.value })}
                  placeholder="Constituency"
                  className="p-2 border rounded w-full"
                />
              </div>
            </div>

            {/* Row 2 - Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="state" className="block text-gray-700"><strong>State</strong></label>
                <select
                  id="state"
                  value={formState.state}
                  onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select State</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="yearOfElection" className="block text-gray-700"><strong>Year of Election</strong></label>
                <select
                  id="yearOfElection"
                  value={formState.yearOfElection}
                  onChange={(e) => setFormState({ ...formState, yearOfElection: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Year</option>
                  {yearOfElectionOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="position" className="block text-gray-700"><strong>Position</strong></label>
                <select
                  id="position"
                  value={formState.position}
                  onChange={(e) => setFormState({ ...formState, position: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Position</option>
                  {positionOptions.map((position) => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3 - Phone and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="phoneNumber" className="block text-gray-700"><strong>Phone Number</strong></label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={formState.phoneNumber}
                  onChange={(e) => setFormState({ ...formState, phoneNumber: e.target.value })}
                  placeholder="Phone Number"
                  className="p-2 border rounded w-full"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="email" className="block text-gray-700"><strong>Email</strong></label>
                <input
                  type="email"
                  id="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="Email"
                  className="p-2 border rounded w-full"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end mt-6">
              <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
                {isEditing ? "Update Politician" : "Add Politician"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Politician List Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold">Politician List</h3>
        </div>
        <div className="p-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Name</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Party</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Constituency</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left">State</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Year of Election</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Position</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Phone Number</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Email</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Approval Status</th>
                <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPoliticians.map((politician) => (
                <tr key={politician.id}>
                  <td className="border-b border-gray-200 px-4 py-2">{politician.name}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{politician.party}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{politician.constituency}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{politician.state}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{politician.yearOfElection}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{politician.position}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{politician.phoneNumber}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{politician.email}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{politician.approvalStatus}</td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    <button
                      onClick={() => handleEditPolitician(politician.id)}
                      className="p-1 text-yellow-500 hover:text-yellow-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeletePolitician(politician.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(politician.id, politician.approvalStatus)}
                      className={`p-1 ${politician.approvalStatus === "Approved" ? "text-green-500 hover:text-green-700" : "text-gray-500 hover:text-gray-700"}`}
                      title="Toggle Approval Status"
                    >
                      {politician.approvalStatus === "Approved" ? <FaCheck /> : <FaTimes />}
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

export default PoliticianList;
