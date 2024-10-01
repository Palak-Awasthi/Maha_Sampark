import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";
import Swal from "sweetalert2"; // Import SweetAlert

const OfficeNameMaster = () => {
  const [officeNames, setOfficeNames] = useState([]);
  const [formState, setFormState] = useState({ officeName: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (officeName) {
      setFormState({ officeName: officeName.officeName, status: officeName.status });
      setIsEditing(id);
    }
  };

  const handleDeleteOfficeName = async (id) => {
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

  const handleToggleStatus = async (id) => {
    const officeName = officeNames.find((on) => on.id === id);
    if (officeName) {
      const newStatus = officeName.status === "Active" ? "Inactive" : "Active";
      setLoading(true);
      try {
        // Update the status on the backend
        await axios.put(`http://localhost:8080/api/office-names/${id}/status`, { status: newStatus });
  
        // Optimistically update the status in the frontend
        setOfficeNames((prev) =>
          prev.map((on) => (on.id === id ? { ...on, status: newStatus } : on))
        );
  
        toast.success(`Office Name status updated to ${newStatus}`);
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
    setFormState({ officeName: "", status: "Active" });
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

  const filteredOfficeNames = officeNames.filter((on) =>
    on.officeName && on.officeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold text-black">Office Name Master</div>
            <div className="flex items-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 transition-all hover:bg-blue-600"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaSearch className="inline" /> {showSearch ? "Hide Search" : "Show Search"}
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded flex items-center transition-all hover:bg-gray-600"
                onClick={() => {
                  resetForm(); // Reset form fields when resetting search
                }}
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
                placeholder="Search Office Names..."
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
                placeholder="Office Name"
                value={formState.officeName}
                onChange={(e) => setFormState({ ...formState, officeName: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-600">
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
          {/* Office Name Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border border-gray-300 p-2">Sr. No.</th>
                    <th className="border border-gray-300 p-2">Office Name</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOfficeNames.map((officeName, index) => (
                    <tr key={officeName.id}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{officeName.officeName}</td>
                      <td className="border border-gray-300 p-2">
  <span
    className={`inline-flex items-center px-2 py-1 text-sm font-bold rounded-full ${
      officeName.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
    }`}
  >
    {officeName.status} {officeName.status === "Active" ? <FaCheck className="ml-1" /> : <FaTimes className="ml-1" />}
  </span>
</td>
<td className="border border-gray-300 p-2 flex gap-2">
  <button
    className="text-yellow-500 hover:text-yellow-700 transition-all"
    onClick={() => handleEditOfficeName(officeName.id)}
  >
    <FaEdit />
  </button>
  <button
    className="text-red-500 hover:text-red-700 transition-all"
    onClick={() => handleDeleteOfficeName(officeName.id)}
  >
    <FaTrash />
  </button>
  <button
    onClick={() => handleToggleStatus(officeName.id)}
    className={`text-${officeName.status === "Active" ? "red" : "green"}-600 hover:underline mx-2`}
  >
    {officeName.status === "Active" ? <FaTimes /> : <FaCheck />}
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

export default OfficeNameMaster;
