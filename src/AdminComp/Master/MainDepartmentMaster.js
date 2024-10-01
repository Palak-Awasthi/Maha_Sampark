import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrashAlt, FaCheck,FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../AdminSidebar"; 
import AdminHeader from "../AdminHeader"; 
import AdminFooter from "../AdminFooter"; 

const MainDepartmentMaster = () => {
  const [mainDepartments, setMainDepartments] = useState([]);
  const [formState, setFormState] = useState({ mainDepartment: "", status: "Active" });
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
    if (!formState.mainDepartment) {
      toast.error("Main Department field is required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isEditing) {
        const departmentId = isEditing;
        const updatedDepartment = { ...formState };
        response = await axios.put(`http://localhost:8080/api/main-departments/${departmentId}`, updatedDepartment);
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

  const handleEditMainDepartment = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/main-departments/${id}`);
      const department = response.data;
      setFormState({ mainDepartment: department.mainDepartment, status: department.status });
      setIsEditing(id);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMainDepartment = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
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

  const handleToggleStatus = async (id) => {
    const department = mainDepartments.find((d) => d.id === id);
    if (department) {
      const newStatus = department.status === "Active" ? "Inactive" : "Active";
      setLoading(true);
      try {
        await axios.put(`http://localhost:8080/api/main-departments/${id}/status`, newStatus, {
          headers: { 'Content-Type': 'text/plain' }, 
        });

        setMainDepartments((prevDepartments) =>
          prevDepartments.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
        );
        toast.success(`Main Department status updated to ${newStatus}`);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const resetForm = () => {
    setFormState({ mainDepartment: "", status: "Active" });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      toast.error(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const filteredDepartments = mainDepartments.filter((d) =>
    d.mainDepartment && d.mainDepartment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold text-black">Main Department Master</div>
            <div className="flex items-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 transition-all hover:bg-blue-600"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaSearch className="inline" /> {showSearch ? "Hide Search" : "Show Search"}
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded flex items-center transition-all hover:bg-gray-600"
                onClick={resetForm}
              >
                <FaSyncAlt className="mr-1" /> Reset
              </button>
            </div>
          </div>
          {showSearch && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search Departments..."
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
          )}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Main Department Name"
                value={formState.mainDepartment}
                onChange={(e) => setFormState({ ...formState, mainDepartment: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-600">
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
          <div className="overflow-x-auto">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border border-gray-300 p-2">Sr. No.</th>
                    <th className="border border-gray-300 p-2">Main Department Name</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((department, index) => (
                    <tr key={department.id}>
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{department.mainDepartment}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`inline-flex items-center px-2 py-1 text-sm font-bold rounded-full ${department.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                          {department.status} {department.status === "Active" ? <FaCheck className="ml-1" /> : <FaTimes className="ml-1" />}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2 flex gap-2">
  <button
    className="text-yellow-500 hover:text-yellow-700 transition-all"
    onClick={() => handleEditMainDepartment(department.id)}
  >
    <FaEdit />
  </button>
  <button
    className="text-red-500 hover:text-red-700 transition-all"
    onClick={() => handleDeleteMainDepartment(department.id)}
  >
    <FaTrash />
  </button>
  <button
    onClick={() => handleToggleStatus(department.id)}
    className={`text-${department.status === "Active" ? "red" : "green"}-600 hover:underline mx-2`}
  >
    {department.status === "Active" ? <FaTimes /> : <FaCheck />}
  </button>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default MainDepartmentMaster;
