import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const MCSAISDesignationMaster = () => {
  const [designations, setDesignations] = useState([]);
  const [formState, setFormState] = useState({ type: "", designation: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(null);
  const [errors, setErrors] = useState({ designation: "" });
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
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
    setFormState({ type: designation.type, designation: designation.designation, status: designation.status });
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
      await axios.put(`http://localhost:8080/api/designations/${id}`, { ...formState, status: newStatus });
      toast.success(`Designation status updated to ${newStatus} successfully!`);
      fetchDesignations(); // Fetch updated designations
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setShowSearch(false);
  };

  const resetForm = () => {
    setFormState({ type: "", designation: "", status: "Active" });
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

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold">MCS & AIS Designation Master</div>
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
                onClick={resetSearch}
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
                <div className="grid grid-cols-3 gap-2">
                  {/* Type Dropdown */}
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Type</label>
                    <select
                      value={formState.type}
                      onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                      className="p-1 border rounded hover:scale-105 transition duration-300 w-full"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="AIS">AIS</option>
                      <option value="MCS">MCS</option>
                    </select>
                  </div>

                  {/* Designation Input Field */}
                  <div className="flex flex-col">
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
                      className={`p-1 border rounded hover:scale-105 transition duration-300 w-full ${errors.designation ? "border-red-500" : ""}`}
                      required
                    />
                    {errors.designation && <p className="text-red-500">{errors.designation}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                  {isEditing ? "Update Designation" : "Add Designation"}
                </button>
              </form>
            </div>
          </div>

          {/* Designation Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 overflow-auto">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      <th className="text-left border-b p-2">Sr No</th>
                      <th className="text-left border-b p-2">Type</th>
                      <th className="text-left border-b p-2">Designation</th>
                      <th className="text-left border-b p-2">Status</th>
                      <th className="text-left border-b p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDesignations.map((designation, index) => (
                      <tr key={designation.id}>
                        <td className="border-b p-2">{index + 1}</td>
                        <td className="border-b p-2">{designation.type}</td>
                        <td className="border-b p-2">{designation.designation}</td>
                        <td className="border-b p-2">
                          <span
                            className={`font-bold ${designation.status === "Active" ? "text-green-500" : "text-red-500"}`}
                          >
                            {designation.status}
                          </span>
                        </td>
                        <td className="border-b p-2 flex space-x-2">
                          <button onClick={() => handleToggleStatus(designation.id, designation.status)}>
                            {designation.status === "Active" ? <FaTimes className="text-red-500" /> : <FaCheck className="text-green-500" />}
                          </button>
                          <button onClick={() => handleEditDesignation(designation.id)}>
                            <FaEdit className="text-blue-500" />
                          </button>
                          <button onClick={() => handleDeleteDesignation(designation.id)}>
                            <FaTrash className="text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default MCSAISDesignationMaster;
