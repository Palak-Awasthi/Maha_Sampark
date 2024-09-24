import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const GovernmentOfficeDepartmentMaster = () => {
  const [departments, setDepartments] = useState([]);
  const [formState, setFormState] = useState({ departmentName: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/government-offices/departments");
      setDepartments(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateDepartment = async () => {
    const trimmedDepartmentName = formState.departmentName.trim();

    if (!trimmedDepartmentName) {
      toast.error("Department Name is required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/government-offices/departments/${isEditing}`, { ...formState, departmentName: trimmedDepartmentName });
        toast.success("Department updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/government-offices/departments", { ...formState, departmentName: trimmedDepartmentName });
        toast.success("Department added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchDepartments();
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
    handleAddOrUpdateDepartment();
  };

  const handleEditDepartment = (id) => {
    const department = departments.find((dep) => dep.id === id);
    setFormState({ departmentName: department.departmentName, status: department.status });
    setIsEditing(id);
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/government-offices/departments/${id}`);
        setDepartments(departments.filter((dep) => dep.id !== id));
        toast.success("Department deleted successfully!");
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
      await axios.put(`http://localhost:8080/api/government-offices/departments/${id}/status`, { status: newStatus });
      fetchDepartments();
      toast.success(`Department status updated to ${newStatus} successfully!`);
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
    setFormState({ departmentName: "", status: "Active" });
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

  const filteredDepartments = departments.filter((dep) =>
    dep.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const currentDepartments = filteredDepartments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold">Government Office Department Master</div>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search Department"
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

          {/* Add/Update Department Form */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-semibold">{isEditing ? "Edit Department" : "Add Department"}</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col w-full">
                    <label className="mb-1 font-medium">Department Name</label>
                    <input
                      type="text"
                      value={formState.departmentName}
                      onChange={(e) => setFormState({ ...formState, departmentName: e.target.value })}
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

          {/* Department List Table */}
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
            <div className="px-6 py-4">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-2">Department Name</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDepartments.map((department) => (
                    <tr key={department.id}>
                      <td className="border px-4 py-2">{department.departmentName}</td>
                      <td className="border px-4 py-2">
                        <span className={`text-${department.status === "Active" ? "green" : "red"}-500`}>
                          {department.status}
                        </span>
                      </td>
                      <td className="border px-4 py-2 flex items-center space-x-2">
                        <FaEdit
                          className="cursor-pointer text-blue-500 hover:text-blue-600"
                          onClick={() => handleEditDepartment(department.id)}
                          title="Edit"
                          aria-label="Edit department"
                        />
                        <FaTrash
                          className="cursor-pointer text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteDepartment(department.id)}
                          title="Delete"
                          aria-label="Delete department"
                        />
                        <span
                          className="cursor-pointer"
                          onClick={() => handleToggleStatus(department.id, department.status)}
                          title="Toggle Status"
                        >
                          {department.status === "Active" ? <FaTimes className="text-red-500" /> : <FaCheck className="text-green-500" />}
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

export default GovernmentOfficeDepartmentMaster;
