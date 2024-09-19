import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const MCSAISDesignationMaster = () => {
  const [designations, setDesignations] = useState([]);
  const [formState, setFormState] = useState({ designation: "", type: "MCS" }); // Added type field
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/designations");
      setDesignations(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateDesignation = async () => {
    if (!formState.designation) {
      toast.error("Designation field is required!");
      return;
    }

    setLoading(true);
    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/designations/${isEditing}`, formState);
        toast.success("Designation updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/designations", formState);
        toast.success("Designation added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchDesignations();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateDesignation();
  };

  const handleEditDesignation = (id) => {
    const designation = designations.find((d) => d.id === id);
    setFormState({ designation: designation.designation, type: designation.type });
    setIsEditing(id);
  };

  const handleDeleteDesignation = async (id) => {
    if (window.confirm("Are you sure you want to delete this designation?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/designations/${id}`);
        setDesignations(designations.filter((d) => d.id !== id));
        toast.success("Designation deleted successfully!");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/designations/${id}/status`, { status: newStatus });
      fetchDesignations();
      toast.success(`Designation status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDesignations = designations.filter((d) =>
    d.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({ designation: "", type: "MCS" });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      toast.error(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
    } else if (error.request) {
      toast.error("No response received from the server. Please try again.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl font-bold">MCS & AIS Designation Master</marquee>
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
  <div className="grid grid-cols-1 gap-2">
    <div className="flex flex-col md:flex-row md:space-x-4">
      <div className="flex flex-col w-full md:w-1/2"> {/* Adjusted width for responsiveness */}
        <label className="mb-1 font-medium">Type</label>
        <select
          value={formState.type}
          onChange={(e) => setFormState({ ...formState, type: e.target.value })}
          className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
        >
          <option value="MCS">MCS</option>
          <option value="AIS">AIS</option>
        </select>
      </div>
      <div className="flex flex-col w-full md:w-1/2"> {/* Adjusted width for responsiveness */}
        <label className="mb-1 font-medium">Designation</label>
        <input
          type="text"
          value={formState.designation}
          onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
          className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
          required
        />
      </div>
    </div>
  </div>
  <div className="flex justify-center mt-4">
    <button
      type="submit"
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
      disabled={loading}
    >
      {isEditing ? "Update" : "Submit"}
    </button>
  </div>
</form>

        </div>
      </div>

  

      {/* Designation List Table */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
        <div className="px-6 py-4">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">Sr No</th>
                <th className="px-6 py-3 text-cente  hover:text-black cursor-pointerr">Type</th>
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">Designation</th>
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">Status</th>
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDesignations.map((designation) => (
                <tr key={designation.id} className="border-b">
                  <td className="px-6 py-3 text-center">{designation.id}</td>
                  <td className="px-6 py-3 text-center">{designation.type}</td>
                  <td className="px-6 py-3 text-center">{designation.designation}</td>
                  <td className="px-6 py-3 text-center">
                    <span
                      className={`font-bold ${designation.status === "Active" ? "text-green-500" : "text-red-500"}`}
                    >
                      {designation.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleEditDesignation(designation.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteDesignation(designation.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(designation.id, designation.status)}
                      className={`ml-2 ${designation.status === "Active" ? "text-red-500" : "text-green-500"}`}
                    >
                      {designation.status === "Active" ? <FaTimes /> : <FaCheck />}
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
