import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const OfficeNameMaster = () => {
  const [officeNames, setOfficeNames] = useState([]);
  const [formState, setFormState] = useState({ officeName: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOfficeNames();
  }, []);

  const fetchOfficeNames = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/office-names");
      setOfficeNames(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateOfficeName = async () => {
    const trimmedOfficeName = formState.officeName.trim();

    if (!trimmedOfficeName) {
      toast.error("Office Name is required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/office-names/${isEditing}`, { ...formState, officeName: trimmedOfficeName });
        toast.success("Office Name updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/office-names", { ...formState, officeName: trimmedOfficeName });
        toast.success("Office Name added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchOfficeNames();
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
    handleAddOrUpdateOfficeName();
  };

  const handleEditOfficeName = (id) => {
    const officeName = officeNames.find((on) => on.id === id);
    setFormState({ officeName: officeName.officeName, status: officeName.status });
    setIsEditing(id);
  };

  const handleDeleteOfficeName = async (id) => {
    if (window.confirm("Are you sure you want to delete this office name?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/office-names/${id}`);
        setOfficeNames(officeNames.filter((on) => on.id !== id));
        toast.success("Office Name deleted successfully!");
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
        // Sending the current status as a payload to toggle status
        await axios.patch(`http://localhost:8080/api/office-names/${id}/toggle-status`, { status: newStatus });
        fetchOfficeNames(); // Refresh the list
        toast.success(`Office Name status updated to ${newStatus}!`);
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
    setFormState({ officeName: "", status: "Active" });
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

  const filteredOfficeNames = officeNames.filter((on) =>
    on.officeName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const totalPages = Math.ceil(filteredOfficeNames.length / itemsPerPage);
  const currentOfficeNames = filteredOfficeNames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold">Office Name Master</div>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search Office Name"
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

          {/* Add/Update Office Name Form */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-semibold">{isEditing ? "Edit Office Name" : "Add Office Name"}</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col w-full">
                    <label className="mb-1 font-medium">Office Name</label>
                    <input
                      type="text"
                      value={formState.officeName}
                      onChange={(e) => setFormState({ ...formState, officeName: e.target.value })}
                      className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
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

          {/* Loader UI */}
          {loading && <div className="text-center">Loading...</div>}

          {/* Office Name List Table */}
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
            <div className="px-6 py-4">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-2">Sr No</th>
                    <th className="px-4 py-2">Office Name</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOfficeNames.map((officeName, index) => (
                    <tr key={officeName.id}>
                      <td className="border px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="border px-4 py-2">{officeName.officeName}</td>
                      <td className="border px-4 py-2">
                        <span className={`text-${officeName.status === "Active" ? "green" : "red"}-500`}>
                          {officeName.status}
                        </span>
                      </td>
                      <td className="border px-4 py-2 flex items-center space-x-2">
                        <FaEdit
                          className="cursor-pointer text-blue-500 hover:text-blue-600"
                          onClick={() => handleEditOfficeName(officeName.id)}
                          title="Edit"
                          aria-label="Edit office name"
                        />
                        <FaTrash
                          className="cursor-pointer text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteOfficeName(officeName.id)}
                          title="Delete"
                          aria-label="Delete office name"
                        />
                        <button
                          onClick={() => handleToggleStatus(officeName.id, officeName.status)}
                          className={`px-2 py-1 rounded ${officeName.status === "Active" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                        >
                          {officeName.status === "Active" ? <FaTimes /> : <FaCheck />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Previous
            </button>
            <div>Page {currentPage} of {totalPages}</div>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>

        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default OfficeNameMaster;
