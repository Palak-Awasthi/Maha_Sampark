import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";  // Import SweetAlert

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
      Swal.fire("Error", "Main Type is required!", "error");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/nonofficialmaintypes/${isEditing}`, formData);
        Swal.fire("Success", "Main Type updated successfully!", "success");
      } else {
        await axios.post("http://localhost:8080/api/nonofficialmaintypes", formData);
        Swal.fire("Success", "Main Type added successfully!", "success");
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

  // Handle deletion of a main type with SweetAlert confirmation
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/nonofficialmaintypes/${id}`);
          fetchMainTypes();
          Swal.fire("Deleted!", "Main Type has been deleted.", "success");
        } catch (error) {
          handleError(error);
        }
      }
    });
  };

  // Toggle status of a main type with confirmation
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the status to ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedMainType = await axios.put(`http://localhost:8080/api/nonofficialmaintypes/${id}/toggle-status`);
          setMainTypes((prevMainTypes) =>
            prevMainTypes.map((mainType) =>
              mainType.id === id ? { ...mainType, status: updatedMainType.data.status } : mainType
            )
          );
          Swal.fire("Success", `Main Type status updated to ${updatedMainType.data.status} successfully!`, "success");
        } catch (error) {
          handleError(error);
        }
      }
    });
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
      Swal.fire("Error", `${error.response.status} - ${error.response.data.message || "An error occurred."}`, "error");
    } else if (error.request) {
      Swal.fire("Error", "No response received from the server. Please try again.", "error");
    } else {
      Swal.fire("Error", "An unexpected error occurred. Please try again.", "error");
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
                    <span className={`px-2 py-1 rounded-md ${mainType.status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {mainType.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b flex space-x-2">
                    <button
                      onClick={() => handleEdit(mainType.id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(mainType.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(mainType.id, mainType.status)}
                      className={`text-${mainType.status === "Active" ? "green" : "gray"}-500 hover:text-${mainType.status === "Active" ? "green" : "gray"}-700`}
                      title={mainType.status === "Active" ? "Deactivate" : "Activate"}
                    >
                      {mainType.status === "Active" ? <FaTimes /> : <FaCheck />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">No Main Types Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NonOfficialMainTypeMaster;
