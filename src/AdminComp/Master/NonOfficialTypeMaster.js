import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
      const response = await axios.get("http://localhost:8080/api/nonOfficialTypes/all");
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
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Main Type and Sub-Type are required!',
      });
      return;
    }

    try {
      const newForm = { ...form };
      if (editingId) {
        await axios.put(`http://localhost:8080/api/nonOfficialTypes/${editingId}`, newForm);
        Swal.fire('Updated!', 'Type updated successfully!', 'success');
      } else {
        await axios.post("http://localhost:8080/api/nonOfficialTypes/save", newForm);
        Swal.fire('Added!', 'Type added successfully!', 'success');
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/nonOfficialTypes/delete/${id}`);
        fetchTypes();
        Swal.fire('Deleted!', 'Type deleted successfully!', 'success');
      } catch (error) {
        handleError(error);
      }
    }
  };

  // Toggle status of a type
  const handleToggleStatus = async (id, currentStatus) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${currentStatus === "Active" ? "deactivate" : "activate"} this type?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: currentStatus === "Active" ? 'Yes, deactivate it!' : 'Yes, activate it!',
    });
    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:8080/api/nonOfficialTypes/toggle-status/${id}`);
        fetchTypes(); // Re-fetch to update the status
        Swal.fire('Updated!', `Type status updated successfully!`, 'success');
      } catch (error) {
        handleError(error);
      }
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter types based on the search term
  const filteredTypes = types.filter((type) =>
    type.mainType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset form fields
  const resetForm = () => {
    setForm({ mainType: "", subType: "", status: "Inactive" });
    setEditingId(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`,
      });
    } else if (error.request) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No response received from the server. Please try again.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
      });
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
                <label className="mb-1 font-medium">Sub Type</label>
                <input
                  type="text"
                  value={form.subType}
                  onChange={(e) => setForm({ ...form, subType: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
                >
                  {editingId ? "Update" : "Add"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="ml-2 p-2 bg-gray-500 text-white rounded-md transition-transform transform hover:scale-110"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Non-Official Types Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold">Non-Official Types List</h3>
        </div>
        <div className="p-6">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Main Type</th>
                <th className="border border-gray-300 px-4 py-2">Sub Type</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTypes.map((type) => (
                <tr key={type.id}>
                  <td className="border border-gray-300 px-4 py-2">{type.mainType}</td>
                  <td className="border border-gray-300 px-4 py-2">{type.subType}</td>
                  <td className="border border-gray-300 px-4 py-2">{type.status}</td>
                  <td className="border border-gray-300 px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(type.id)}
                      className="p-2 bg-yellow-500 text-white rounded-md transition-transform transform hover:scale-110"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="p-2 bg-red-500 text-white rounded-md transition-transform transform hover:scale-110"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(type.id, type.status)}
                      className={`p-2 rounded-md transition-transform transform hover:scale-110 ${
                        type.status === "Active" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                      }`}
                      title={type.status === "Active" ? "Deactivate" : "Activate"}
                    >
                      {type.status === "Active" ? <FaTimes /> : <FaCheck />}
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
