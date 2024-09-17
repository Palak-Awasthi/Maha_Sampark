import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const NonOfficialTypeMaster = () => {
  const [types, setTypes] = useState([]);
  const [mainTypes, setMainTypes] = useState([]); // State for available main types
  const [form, setForm] = useState({ mainType: "", subType: "", status: "Inactive" }); // Initialize mainType as empty string
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchTypes();
    initializeMainTypes(); // Initialize the static main types
  }, []);

  // Fetch Non-Official Types from the API
  const fetchTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/nonOfficialTypes");
      setTypes(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  // Initialize static main types (AIS, RIS, FIS, ITC)
  const initializeMainTypes = () => {
    const staticMainTypes = [
      { id: "ais", name: "AIS" },
      { id: "ris", name: "RIS" },
      { id: "fis", name: "FIS" },
      { id: "itc", name: "ITC" },
    ];
    setMainTypes(staticMainTypes);
  };

  // Handle form submission for adding/updating types
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mainType || !form.subType) {
      alert("Main Type and Sub-Type are required!");
      return;
    }

    try {
      const newForm = { ...form };
      if (editingId) {
        await axios.put(`http://localhost:8080/api/nonOfficialTypes/${editingId}`, newForm);
        alert("Type updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/nonOfficialTypes", newForm);
        alert("Type added successfully!");
      }
      fetchTypes();
      resetForm();
    } catch (error) {
      handleError(error);
    }
  };

  // Handle edit of a type
  const handleEdit = (id) => {
    const typeToEdit = types.find((type) => type.id === id);
    setForm({ mainType: typeToEdit.mainType, subType: typeToEdit.subType, status: typeToEdit.status });
    setEditingId(id);
  };

  // Handle deletion of a type
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      try {
        await axios.delete(`http://localhost:8080/api/nonOfficialTypes/${id}`);
        fetchTypes();
        alert("Type deleted successfully!");
      } catch (error) {
        handleError(error);
      }
    }
  };

  // Toggle status of a type
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`http://localhost:8080/api/nonOfficialTypes/${id}/toggle-status`);
      setTypes((prevTypes) =>
        prevTypes.map((type) => (type.id === id ? { ...type, status: newStatus } : type))
      );
      alert(`Type status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter types based on the search term
  const filteredTypes = types.filter((type) =>
    type.mainType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset form fields
  const resetForm = () => {
    setForm({ mainType: "", subType: "", status: "Inactive" });
    setEditingId(null);
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
            Non-Official Type Master
          </marquee>
        </h2>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Type"
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

      {/* Add/Update Type Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold">
            {editingId ? "Edit Non-Official Type" : "Add Non-Official Type"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-2">
              {/* Main Type Dropdown */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Main Type</label>
                <select
                  value={form.mainType}
                  onChange={(e) => setForm({ ...form, mainType: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300 w-1/2"
                  required
                >
                  <option value="">Select Main Type</option>
                  {mainTypes.map((mainType) => (
                    <option key={mainType.id} value={mainType.name}>
                      {mainType.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Sub-Type</label>
                <input
                  type="text"
                  value={form.subType}
                  onChange={(e) => setForm({ ...form, subType: e.target.value })}
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
                {editingId ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Type List Table */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="px-6 py-4">
          <table className="w-full bg-white rounded-lg shadow-md mb-6">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2 hover:text-black cursor-pointer">ID</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Main Type</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Sub-Type</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Status</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTypes.map((type) => (
                <tr key={type.id}>
                  <td className="border px-4 py-2">{type.id}</td>
                  <td className="border px-4 py-2">{type.mainType}</td>
                  <td className="border px-4 py-2">{type.subType}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleToggleStatus(type.id, type.status)}>
                      {type.status === "Active" ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </button>
                  </td>
                  <td className="border px-4 py-2 flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(type.id)}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
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

export default NonOfficialTypeMaster;
