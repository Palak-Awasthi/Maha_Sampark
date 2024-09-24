import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const SubBranchMaster = () => {
  const [subBranches, setSubBranches] = useState([]);
  const [formState, setFormState] = useState({ subBranchName: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSubBranches();
  }, []);

  const fetchSubBranches = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/sub-branches");
      setSubBranches(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateSubBranch = async () => {
    const trimmedSubBranchName = formState.subBranchName.trim();

    if (!trimmedSubBranchName) {
      toast.error("Sub Branch Name is required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/sub-branches/${isEditing}`, { ...formState, subBranchName: trimmedSubBranchName });
        toast.success("Sub Branch updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/sub-branches", { ...formState, subBranchName: trimmedSubBranchName });
        toast.success("Sub Branch added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchSubBranches();
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
    handleAddOrUpdateSubBranch();
  };

  const handleEditSubBranch = (id) => {
    const subBranch = subBranches.find((sb) => sb.id === id);
    setFormState({ subBranchName: subBranch.subBranchName, status: subBranch.status });
    setIsEditing(id);
  };

  const handleDeleteSubBranch = async (id) => {
    if (window.confirm("Are you sure you want to delete this sub branch?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/sub-branches/${id}`);
        setSubBranches(subBranches.filter((sb) => sb.id !== id));
        toast.success("Sub Branch deleted successfully!");
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
      await axios.put(`http://localhost:8080/api/sub-branches/${id}/status`, { status: newStatus });
      fetchSubBranches();
      toast.success(`Sub Branch status updated to ${newStatus} successfully!`);
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
    setFormState({ subBranchName: "", status: "Active" });
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

  const filteredSubBranches = subBranches.filter((sb) =>
    sb.subBranchName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const totalPages = Math.ceil(filteredSubBranches.length / itemsPerPage);
  const currentSubBranches = filteredSubBranches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold">Sub Branch Master</div>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search Sub Branch"
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

          {/* Add/Update Sub Branch Form */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-semibold">{isEditing ? "Edit Sub Branch" : "Add Sub Branch"}</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col w-full">
                    <label className="mb-1 font-medium">Sub Branch Name</label>
                    <input
                      type="text"
                      value={formState.subBranchName}
                      onChange={(e) => setFormState({ ...formState, subBranchName: e.target.value })}
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

          {/* Sub Branch List Table */}
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
            <div className="px-6 py-4">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-2">Sub Branch Name</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSubBranches.map((subBranch) => (
                    <tr key={subBranch.id}>
                      <td className="border px-4 py-2">{subBranch.subBranchName}</td>
                      <td className="border px-4 py-2">
                        <span className={`text-${subBranch.status === "Active" ? "green" : "red"}-500`}>
                          {subBranch.status}
                        </span>
                      </td>
                      <td className="border px-4 py-2 flex items-center space-x-2">
                        <FaEdit
                          className="cursor-pointer text-blue-500 hover:text-blue-600"
                          onClick={() => handleEditSubBranch(subBranch.id)}
                          title="Edit"
                          aria-label="Edit sub branch"
                        />
                        <FaTrash
                          className="cursor-pointer text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteSubBranch(subBranch.id)}
                          title="Delete"
                          aria-label="Delete sub branch"
                        />
                        <span
                          onClick={() => handleToggleStatus(subBranch.id, subBranch.status)}
                          title="Toggle Status"
                          aria-label="Toggle sub branch status"
                        >
                          {subBranch.status === "Active" ? <FaTimes /> : <FaCheck />}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center mt-4">
                <button
                  className={`px-3 py-1 mx-1 ${currentPage === 1 ? "text-gray-400" : "text-blue-500"}`}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 mx-1 ${page + 1 === currentPage ? "bg-blue-500 text-white" : "text-blue-500"}`}
                    onClick={() => setCurrentPage(page + 1)}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  className={`px-3 py-1 mx-1 ${currentPage === totalPages ? "text-gray-400" : "text-blue-500"}`}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default SubBranchMaster;
