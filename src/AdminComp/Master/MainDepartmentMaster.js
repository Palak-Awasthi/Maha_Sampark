import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainDepartmentMaster = () => {
  const [mainDepartments, setMainDepartments] = useState([]);
  const [formState, setFormState] = useState({ mainDepartmentName: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMainDepartments();
  }, []);

  const fetchMainDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/main-departments");
      setMainDepartments(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateMainDepartment = async () => {
    if (!formState.mainDepartmentName) {
      toast.error("Main Department Name field is required!");
      return;
    }

    setLoading(true);
    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/main-departments/${isEditing}`, formState);
        toast.success("Main Department updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/main-departments", formState);
        toast.success("Main Department added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchMainDepartments();
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
    handleAddOrUpdateMainDepartment();
  };

  const handleEditMainDepartment = (id) => {
    const department = mainDepartments.find((d) => d.id === id);
    setFormState({ mainDepartmentName: department.mainDepartmentName });
    setIsEditing(id);
  };

  const handleDeleteMainDepartment = async (id) => {
    if (window.confirm("Are you sure you want to delete this main department?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/main-departments/${id}`);
        setMainDepartments(mainDepartments.filter((d) => d.id !== id));
        toast.success("Main Department deleted successfully!");
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
      await axios.put(`http://localhost:8080/api/main-departments/${id}/status`, { status: newStatus });
      fetchMainDepartments();
      toast.success(`Main Department status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMainDepartments = mainDepartments.filter((d) =>
    d.mainDepartmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({ mainDepartmentName: "" });
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
          <marquee className="text-2xl font-bold">Main Department Master</marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Main Department"
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

      {/* Add/Update Main Department Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit Main Department" : "Add Main Department"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Main Department Name</label>
                <input
                  type="text"
                  value={formState.mainDepartmentName}
                  onChange={(e) => setFormState({ mainDepartmentName: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300 w-full sm:w-1/2"
                  required
                />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                disabled={loading} // Disable button while loading
              >
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

    
      {/* Main Department List Table */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
        <div className="px-6 py-4">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">Sr No</th>
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">Main Department Name</th>
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">Status</th>
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMainDepartments.map((department) => (
                <tr key={department.id} className="border-b">
                  <td className="px-6 py-3 text-center">{department.id}</td>
                  <td className="px-6 py-3 text-center">{department.mainDepartmentName}</td>
                  <td className="px-6 py-3 text-center">
                    <span
                      className={`font-bold ${department.status === "Active" ? "text-green-500" : "text-red-500"}`}
                    >
                      {department.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <span
                        onClick={() => handleToggleStatus(department.id, department.status)}
                        className="cursor-pointer"
                        title={`Mark as ${department.status === "Active" ? "Inactive" : "Active"}`}
                      >
                        {department.status === "Active" ? (
                          <FaTimes className="text-red-500" />
                        ) : (
                          <FaCheck className="text-green-500" />
                        )}
                      </span>
                      <span
                        onClick={() => handleEditMainDepartment(department.id)}
                        className="cursor-pointer text-blue-500"
                        title="Edit"
                      >
                        <FaEdit />
                      </span>
                      <span
                        onClick={() => handleDeleteMainDepartment(department.id)}
                        className="cursor-pointer text-red-500"
                        title="Delete"
                      >
                        <FaTrash />
                      </span>
                    </div>
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

export default MainDepartmentMaster;
