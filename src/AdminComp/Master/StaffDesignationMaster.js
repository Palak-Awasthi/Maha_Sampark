import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";
import Swal from "sweetalert2"; // Import SweetAlert

const StaffDesignationMaster = () => {
  const [designations, setDesignations] = useState([]);
  const [formState, setFormState] = useState({ designation: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/staff");
      setDesignations(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateDesignation = async () => {
    const trimmedDesignation = formState.designation.trim();

    if (!trimmedDesignation) {
      toast.error("Designation is required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/staff/${isEditing}`, { ...formState, designation: trimmedDesignation });
        toast.success("Designation updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/staff", { ...formState, designation: trimmedDesignation });
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
    const designation = designations.find((des) => des.id === id);
    setFormState({ designation: designation.designation, status: designation.status });
    setIsEditing(id);
  };

  const handleDeleteDesignation = async (id) => {
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
        await axios.delete(`http://localhost:8080/api/staff/${id}`);
        setDesignations(designations.filter((des) => des.id !== id));
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
      // Using the specified API for status updates
      await axios.put(`http://localhost:8080/api/staff/${id}/status`, { status: newStatus });
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
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const filteredDesignations = designations.filter((des) =>
    des.designation && des.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold text-black">Staff Designation Master</div>
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
          {/* Search Bar */}
          {showSearch && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search Designations..."
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
          )}
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Designation"
                value={formState.designation}
                onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-600">
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
          {/* Designation Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border border-gray-300 p-2">Sr. No.</th>
                    <th className="border border-gray-300 p-2">Designation</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDesignations.map((designation, index) => (
                    <tr key={designation.id}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{designation.designation}</td>
                      <td className="border border-gray-300 p-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-sm font-bold rounded-full ${
                            designation.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                          }`}
                        >
                          {designation.status} {designation.status === "Active" ? <FaCheck className="ml-1" /> : <FaTimes className="ml-1" />}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2 flex gap-2">
                        <button
                          className="text-yellow-500 hover:text-yellow-700 transition-all"
                          onClick={() => handleEditDesignation(designation.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 transition-all"
                          onClick={() => handleDeleteDesignation(designation.id)}
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(designation.id, designation.status)}
                          className={`text-${designation.status === "Active" ? "red" : "green"}-600 hover:underline mx-2`}
                        >
                          {designation.status === "Active" ? <FaTimes /> : <FaCheck />}
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

export default StaffDesignationMaster;
