import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const NonOfficialMainTypeMaster = () => {
  const [mainTypes, setMainTypes] = useState([]);
  const [formData, setFormData] = useState({ mainType: "", status: "Inactive" }); // Default status to Inactive
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMainTypes();
  }, []);

  const fetchMainTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/nonofficialmaintypes");
      setMainTypes(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mainType) {
      alert("Main Type is required!");
      return;
    }

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const mainTypeToEdit = mainTypes.find((type) => type.id === id);
    setFormData({ mainType: mainTypeToEdit.mainType, status: mainTypeToEdit.status });
    setIsEditing(id);
  };

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

  const toggleStatus = async (id) => {
    const mainTypeToUpdate = mainTypes.find((type) => type.id === id);
    const updatedStatus = mainTypeToUpdate.status === "Active" ? "Inactive" : "Active";

    try {
      await axios.put(`http://localhost:8080/api/nonofficialmaintypes/${id}`, {
        ...mainTypeToUpdate,
        status: updatedStatus,
      });
      fetchMainTypes();
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMainTypes = mainTypes.filter((type) =>
    type.mainType.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="relative overflow-hidden whitespace-nowrap">
              <div className="text-2xl font-bold">Non-Official Main Type Master</div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search Main Type"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-1/2"
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

          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
                {isEditing ? "Edit Non-Official Main Type" : "Add Non-Official Main Type"}
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Main Type</label>
                    <input
                      type="text"
                      value={formData.mainType}
                      onChange={(e) => setFormData({ ...formData, mainType: e.target.value })}
                      className="p-2 border rounded hover:scale-105 transition duration-300 w-1/2"
                      required
                    />
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

          <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
            <div className="px-6 py-4">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Sr No</th>
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Main Type</th>
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Status</th>
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMainTypes.length > 0 ? (
                    filteredMainTypes.map((mainType, index) => (
                      <tr key={mainType.id} className="border-b">
                        <td className="px-6 py-3 text-center">{index + 1}</td>
                        <td className="px-6 py-3 text-center">{mainType.mainType}</td>
                        <td className="px-6 py-3 text-center">
                          <span className={`font-bold ${mainType.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                            {mainType.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <button
                            onClick={() => handleEdit(mainType.id)}
                            className="mr-2 p-2 text-blue-500 hover:text-blue-700"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(mainType.id)}
                            className="mr-2 p-2 text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => toggleStatus(mainType.id)}
                            className={`p-2 ${
                              mainType.status === "Active"
                                ? "text-green-500 hover:text-green-700"
                                : "text-red-500 hover:text-red-700"
                            }`}
                            title={mainType.status === "Active" ? "Set Inactive" : "Set Active"}
                          >
                            {mainType.status === "Active" ? <FaCheck /> : <FaTimes />}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No Main Types Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default NonOfficialMainTypeMaster;
