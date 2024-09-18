import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from 'sweetalert';  // Import SweetAlert
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";


const DepartmentMaster = () => {
  const [departments, setDepartments] = useState([]);
  const [formState, setFormState] = useState({ departmentName: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/departments");
      setDepartments(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddOrUpdateDepartment = async () => {
    if (!formState.departmentName) {
      swal("Error", "Department Name field is required!", "error");
      return;
    }

    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/departments/${isEditing}`, formState);
        swal("Success", "Department updated successfully!", "success");
      } else {
        response = await axios.post("http://localhost:8080/api/departments", formState);
        swal("Success", "Department added successfully!", "success");
      }

      if (response.status === 200 || response.status === 201) {
        fetchDepartments();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateDepartment();
  };

  const handleEditDepartment = (id) => {
    const department = departments.find((d) => d.id === id);
    setFormState({
      departmentName: department.departmentName,
    });
    setIsEditing(id);
  };

  const handleDeleteDepartment = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this department!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`http://localhost:8080/api/departments/${id}`);
          setDepartments(departments.filter((d) => d.id !== id));
          swal("Success", "Department deleted successfully!", "success");
        } catch (error) {
          handleError(error);
        }
      }
    });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`http://localhost:8080/api/departments/${id}/status`, { status: newStatus });
      fetchDepartments();
      swal("Success", `Department status updated to ${newStatus} successfully!`, "success");
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDepartments = departments.filter((d) =>
    d.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({ departmentName: "" });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      swal("Error", `Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`, "error");
    } else if (error.request) {
      swal("Error", "No response received from the server. Please try again.", "error");
    } else {
      swal("Error", "An unexpected error occurred. Please try again.", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl sm:text-3xl font-bold">
            <span className="mx-2">Department</span>
            <span className="mx-2">Master</span>
          </marquee>
        </div>
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
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit Department" : "Add Department"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Department Name</label>
                <input
                  type="text"
                  value={formState.departmentName}
                  onChange={(e) => setFormState({ departmentName: e.target.value })}
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
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Department List Table */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="px-6 py-4">
          <table className="w-full bg-white rounded-lg shadow-md mb-6 ">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2 hover:text-black cursor-pointer">ID</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Department Name</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Status</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDepartments.map((department) => (
                <tr key={department.id}>
                  <td className="px-4 py-2">{department.id}</td>
                  <td className="px-4 py-2">{department.departmentName}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`font-bold ${department.status === "Active" ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {department.status === "Active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditDepartment(department.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(department.id, department.status)}
                        className={`hover:text-${department.status === "Active" ? "red" : "green"
                          }-700`}
                      >
                        {department.status === "Active" ? <FaTimes /> : <FaCheck />}
                      </button>
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

export default DepartmentMaster;
