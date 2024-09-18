import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const TalukaMaster = () => {
  const [talukas, setTalukas] = useState([]);
  const [formState, setFormState] = useState({
    stateName: "",
    district: "",
    talukaName: "",
    status: "Inactive", // Set status to Inactive by default
  });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTalukas();
  }, []);

  // Fetch Talukas from API
  const fetchTalukas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/talukas");
      setTalukas(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  // Add or Update Taluka
  const handleAddOrUpdateTaluka = async () => {
    if (!formState.stateName || !formState.district || !formState.talukaName) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }

    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/talukas/${isEditing}`, formState);
        Swal.fire("Success", "Taluka updated successfully!", "success");
      } else {
        response = await axios.post("http://localhost:8080/api/talukas", formState);
        Swal.fire("Success", "Taluka added successfully!", "success");
      }

      if (response.status === 200 || response.status === 201) {
        fetchTalukas();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateTaluka();
  };

  const handleEditTaluka = (id) => {
    const taluka = talukas.find((t) => t.id === id);
    setFormState({
      stateName: taluka.stateName,
      district: taluka.district,
      talukaName: taluka.talukaName,
      status: taluka.status,
    });
    setIsEditing(id);
  };

  // Delete Taluka
  const handleDeleteTaluka = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this taluka!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/talukas/${id}`);
        setTalukas(talukas.filter((t) => t.id !== id));
        Swal.fire("Deleted!", "Taluka has been deleted.", "success");
      } catch (error) {
        handleError(error);
      }
    }
  };

  // Toggle Taluka Status
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`http://localhost:8080/api/talukas/${id}/status`, { status: newStatus });
      fetchTalukas();
      Swal.fire("Success", `Taluka status updated to ${newStatus} successfully!`, "success");
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTalukas = talukas.filter((t) =>
    t.talukaName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({
      stateName: "",
      district: "",
      talukaName: "",
      status: "Inactive",
    });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      Swal.fire("Error", `Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`, "error");
    } else if (error.request) {
      Swal.fire("Error", "No response received from the server. Please try again.", "error");
    } else {
      Swal.fire("Error", "An unexpected error occurred. Please try again.", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl sm:text-3xl font-bold">
            <span className="mx-2">Taluka</span>
            <span className="mx-2">Master</span>
          </marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Taluka"
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

      {/* Add/Update Taluka Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit Taluka" : "Add Taluka"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">State</label>
                <input
                  type="text"
                  value={formState.stateName}
                  onChange={(e) => setFormState({ ...formState, stateName: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300 w-1/2"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">District</label>
                <input
                  type="text"
                  value={formState.district}
                  onChange={(e) => setFormState({ ...formState, district: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300 w-1/2"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Taluka Name</label>
                <input
                  type="text"
                  value={formState.talukaName}
                  onChange={(e) => setFormState({ ...formState, talukaName: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300 w-1/2"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Taluka Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold">Taluka List</h3>
        </div>
        <div className="p-6">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">State</th>
                <th className="px-4 py-2 border-b">District</th>
                <th className="px-4 py-2 border-b">Taluka Name</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalukas.map((taluka) => (
                <tr key={taluka.id}>
                  <td className="px-4 py-2 border-b">{taluka.stateName}</td>
                  <td className="px-4 py-2 border-b">{taluka.district}</td>
                  <td className="px-4 py-2 border-b">{taluka.talukaName}</td>
                  <td className="px-4 py-2 border-b">
                    <span
                      onClick={() => handleToggleStatus(taluka.id, taluka.status)}
                      className={`cursor-pointer ${
                        taluka.status === "Active" ? "text-green-500" : "text-red-500"
                      }`}
                      title="Toggle Status"
                    >
                      {taluka.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b flex items-center space-x-2">
                    <button
                      onClick={() => handleEditTaluka(taluka.id)}
                      className="p-2 bg-green-500 text-white rounded-md transition-transform transform hover:scale-110"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTaluka(taluka.id)}
                      className="p-2 bg-red-500 text-white rounded-md transition-transform transform hover:scale-110"
                      title="Delete"
                    >
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

export default TalukaMaster;
