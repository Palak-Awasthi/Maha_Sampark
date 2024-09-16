import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";

const MCSAISDesignationMaster = () => {
  const [designations, setDesignations] = useState([]);
  const [addedDesignations, setAddedDesignations] = useState([]); // State for newly added designations
  const [formState, setFormState] = useState({ type: "", designationName: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all designations on component mount
  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/designations");
      setDesignations(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddOrUpdateDesignation = async () => {
    if (!formState.type || !formState.designationName) {
      alert("Both fields are required!"); // Ensure both fields are filled
      return;
    }
  
    try {
      let response;
  
      if (isEditing) {
        // Update existing designation
        response = await axios.put(`http://localhost:8080/api/designations/${isEditing}`, {
          type: formState.type,
          designation: formState.designationName // Ensure the correct field name
        });
        alert("Designation updated successfully!");
      } else {
        // Add new designation
        response = await axios.post("http://localhost:8080/api/designations", {
          type: formState.type,
          designation: formState.designationName // Ensure the correct field name
        });
        alert("Designation added successfully!");
  
        // Directly add the new designation to the state without fetching
        // This ensures the UI is updated immediately
        setDesignations((prevDesignations) => [
          ...prevDesignations,
          { 
            id: response.data.id, // Assuming the server returns the new ID
            type: formState.type,
            designationName: formState.designationName,
            status: "Inactive" // Set the default status as needed
          }
        ]);
      }
  
      if (response.status === 200 || response.status === 201) {
        resetForm(); // Reset form after successful add/update
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateDesignation();
  };

  const handleEditDesignation = (id) => {
    const designation = designations.find((d) => d.id === id);
    setFormState({
      type: designation.type,
      designationName: designation.designationName,
    });
    setIsEditing(id);
  };

  const handleDeleteDesignation = async (id) => {
    if (window.confirm("Are you sure you want to delete this designation?")) {
      try {
        await axios.delete(`http://localhost:8080/api/designations/${id}`);
        setDesignations(designations.filter((d) => d.id !== id));
        alert("Designation deleted successfully!");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const toggleStatus = async (id) => {
    const designation = designations.find((d) => d.id === id);
    if (!designation) return;
  
    try {
      const updatedStatus = designation.status === "Active" ? "Inactive" : "Active";
      const response = await axios.patch(`http://localhost:8080/api/designations/${id}/status`, { status: updatedStatus });
  
      // Update the status in the frontend
      setDesignations((prevDesignations) =>
        prevDesignations.map((d) => (d.id === id ? { ...d, status: updatedStatus } : d))
      );
      alert(`Status updated to ${updatedStatus}!`);
    } catch (error) {
      handleError(error);
    }
  };
  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDesignations = [...designations, ...addedDesignations].filter((d) =>
    d.designationName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({ type: "", designationName: "" });
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
            <span className="mx-2">MCS</span>
            <span className="mx-2">&</span>
            <span className="mx-2">AIS</span>
            <span className="mx-2">Designation</span>
            <span className="mx-2">Master</span>
          </marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Designation"
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

      {/* Add/Update Designation Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit Designation" : "Add Designation"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Type</label>
                <select
                  value={formState.type}
                  onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="MCS">MCS</option>
                  <option value="AIS">AIS</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Designation Name</label>
                <input
                  type="text"
                  value={formState.designationName}
                  onChange={(e) => setFormState({ ...formState, designationName: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Designation List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold">Designation List</h3>
        </div>
        <div className="p-6">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Designation</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDesignations.map((designation) => (
                <tr key={designation.id}>
                  <td className="border px-4 py-2">{designation.id}</td>
                  <td className="border px-4 py-2">{designation.type}</td>
                  <td className="border px-4 py-2">{designation.designationName}</td>
                  <td className={`border px-4 py-2 ${designation.status === "Active" ? "text-green-500" : "text-red-500"}`}>
                    {designation.status}
                  </td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <button onClick={() => toggleStatus(designation.id)} className="p-1">
                      {designation.status === "Active" ? (
                        <FaTimes className="text-red-500" />
                      ) : (
                        <FaCheck className="text-green-500" />
                      )}
                    </button>
                    <button onClick={() => handleEditDesignation(designation.id)} className="p-1 text-blue-500">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteDesignation(designation.id)} className="p-1 text-red-500">
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

export default MCSAISDesignationMaster;
