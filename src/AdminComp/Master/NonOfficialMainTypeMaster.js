import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const NonOfficialMainTypeMaster = () => {
  const [mainTypes, setMainTypes] = useState([]);
  const [formData, setFormData] = useState({ mainType: "", status: "Inactive" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMainTypes();
  }, []);

  // Fetch Non-Official Main Types from the API
  const fetchMainTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/nonofficialmaintypes");
      setMainTypes(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  // Handle form submission for adding/updating main types
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mainType) {
      alert("Main Type is required!");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/nonofficialmaintypes/${isEditing}`, formData);
        alert("Main Type updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/nonofficialmaintypes", formData);
        alert("Main Type added successfully!");
      }
      fetchMainTypes();
      resetForm();
    } catch (error) {
      handleError(error);
    }
  };

  // Handle edit of a main type
  const handleEdit = (id) => {
    const mainTypeToEdit = mainTypes.find((type) => type.id === id);
    setFormData({ mainType: mainTypeToEdit.mainType, status: mainTypeToEdit.status });
    setIsEditing(id);
  };

  // Handle deletion of a main type
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this main type?")) {
      try {
        await axios.delete(`http://localhost:8080/api/nonofficialmaintypes/${id}`);
        fetchMainTypes();
        alert("Main Type deleted successfully!");
      } catch (error) {
        handleError(error);
      }
    }
  };

  // Toggle status of a main type
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updatedMainType = await axios.put(`http://localhost:8080/api/nonofficialmaintypes/${id}/toggle-status`);
      setMainTypes(prevMainTypes => 
        prevMainTypes.map(mainType =>
          mainType.id === id ? { ...mainType, status: updatedMainType.data.status } : mainType
        )
      );
      alert(`Main Type status updated to ${updatedMainType.data.status} successfully!`);
    } catch (error) {
      handleError(error);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter main types based on the search term
  const filteredMainTypes = mainTypes.filter((type) =>
    type.mainType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset form fields
  const resetForm = () => {
    setFormData({ mainType: "", status: "Inactive" });
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
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold">
          <marquee behavior="scroll" direction="left">
            Non-Official Main Type Master
          </marquee>
        </h2>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Main Type"
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
      {/* Add/Update Main Type Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit Main Type" : "Add Main Type"}
          </h3>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Main Type</label>
              <input
                type="text"
                value={formData.mainType}
                onChange={(e) => setFormData({ ...formData, mainType: e.target.value })}
                required
                className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-full"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            >
              {isEditing ? "Update" : "Add"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-400 text-white rounded-md ml-2"
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>
      {/* Main Types Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Main Type</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMainTypes.length > 0 ? (
              filteredMainTypes.map((mainType) => (
                <tr key={mainType.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{mainType.mainType}</td>
                  <td className="px-4 py-2 border-b">
                    <span
                      className={`font-bold ${mainType.status === "Active" ? "text-green-500" : "text-red-500"}`}
                    >
                      {mainType.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b flex space-x-2">
                    {mainType.status === "Active" ? (
                      <FaCheck
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleToggleStatus(mainType.id, mainType.status)}
                      />
                    ) : (
                      <FaTimes
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleToggleStatus(mainType.id, mainType.status)}
                      />
                    )}
                    <FaEdit
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleEdit(mainType.id)}
                    />
                    <FaTrash
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleDelete(mainType.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No Main Types found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NonOfficialMainTypeMaster;
