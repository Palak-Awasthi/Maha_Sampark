import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const MCSAISDesignationMaster = () => {
  const [designations, setDesignations] = useState([]);
  const [formState, setFormState] = useState({ designation: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(null);
  const [errors, setErrors] = useState({ designation: "", status: "" });
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    const trimmedDesignation = formState.designation.trim();

    // Real-time validation check
    if (!trimmedDesignation) {
      setErrors((prevErrors) => ({ ...prevErrors, designation: "Designation is required." }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, designation: "" }));
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
    setFormState({ designation: designation.designation, status: designation.status });
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

  const resetForm = () => {
    setFormState({ designation: "", status: "Active" });
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

  const filteredDesignations = designations.filter((d) =>
    d.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const totalPages = Math.ceil(filteredDesignations.length / itemsPerPage);
  const currentDesignations = filteredDesignations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold">Designation Master</div>
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
              <h3 className="text-lg sm:text-xl font-semibold">{isEditing ? "Edit Designation" : "Add Designation"}</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  {/* Designation Field */}
                  <div className="flex flex-col w-full">
                    <label className="mb-1 font-medium">Designation</label>
                    <input
                      type="text"
                      value={formState.designation}
                      onChange={(e) => {
                        setFormState({ ...formState, designation: e.target.value });
                        if (e.target.value.trim() === "") {
                          setErrors((prevErrors) => ({ ...prevErrors, designation: "Designation is required." }));
                        } else {
                          setErrors((prevErrors) => ({ ...prevErrors, designation: "" }));
                        }
                      }}
                      className={`p-2 border rounded hover:scale-105 transition duration-300 w-full ${
                        errors.designation ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.designation && <p className="text-red-500">{errors.designation}</p>}
                  </div>

                  {/* Status Field */}
                  <div className="flex flex-col w-full">
                    <label className="mb-1 font-medium">Status</label>
                    <select
                      value={formState.status}
                      onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                      className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
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
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Designation List */}
          <div className="bg-white rounded-lg shadow-md">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Designation</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                )}
                {!loading && currentDesignations.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No designations found.
                    </td>
                  </tr>
                )}
                {currentDesignations.map((designation) => (
                  <tr key={designation.id} className="border-t hover:bg-gray-100">
                    <td className="border px-4 py-2">{designation.id}</td>
                    <td className="border px-4 py-2">{designation.designation}</td>
                    <td className="border px-4 py-2 text-center">
                      <span className={`font-semibold text-${designation.status === "Active" ? "green" : "red"}-500`}>
                        {designation.status}
                      </span>
                    </td>
                    <td className="border px-4 py-2 flex justify-around">
                      <button
                        onClick={() => handleEditDesignation(designation.id)}
                        className="p-1 bg-yellow-300 text-black rounded-full hover:scale-105 transition-transform"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteDesignation(designation.id)}
                        className="p-1 bg-red-500 text-white rounded-full hover:scale-105 transition-transform"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(designation.id, designation.status)}
                        className={`p-1 rounded-full transition-transform ${
                          designation.status === "Active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                        } hover:scale-105`}
                        title={designation.status === "Active" ? "Mark Inactive" : "Mark Active"}
                      >
                        {designation.status === "Active" ? <FaCheck /> : <FaTimes />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mr-2"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default MCSAISDesignationMaster;
