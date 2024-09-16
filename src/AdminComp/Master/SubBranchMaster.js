import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const SubBranchMaster = () => {
  const [subBranches, setSubBranches] = useState([]);
  const [formState, setFormState] = useState({ mainDept: "", subBranch: "", status: "Inactive" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubBranches();
  }, []);

  // Fetch all sub-branches from the backend
  const fetchSubBranches = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/subbranches");
      setSubBranches(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddOrUpdateSubBranch = async () => {
    if (!formState.mainDept || !formState.subBranch) {
      alert("Both Main Department and Sub-Branch fields are required!");
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/subbranches/${isEditing}`, formState);
        alert("Sub-Branch updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/subbranches", { ...formState, status: "Inactive" });
        alert("Sub-Branch added with Inactive status!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchSubBranches();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateSubBranch();
  };

  const handleEditSubBranch = (id) => {
    const subBranch = subBranches.find((b) => b.id === id);
    setFormState({
      mainDept: subBranch.mainDept,
      subBranch: subBranch.subBranch,
      status: subBranch.status || "Inactive",
    });
    setIsEditing(id);
  };

  const handleDeleteSubBranch = async (id) => {
    if (window.confirm("Are you sure you want to delete this sub-branch?")) {
      try {
        await axios.delete(`http://localhost:8080/api/subbranches/${id}`);
        setSubBranches(subBranches.filter((b) => b.id !== id));
        alert("Sub-Branch deleted successfully!");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`http://localhost:8080/api/subbranches/${id}/status`, { status: newStatus });
      fetchSubBranches();
      alert(`Sub-Branch status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSubBranches = subBranches.filter((b) =>
    b.subBranch?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({ mainDept: "", subBranch: "", status: "Inactive" });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      alert(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
    } else if (error.request) {
      alert("No response received from the server. Please try again.");
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
      <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl sm:text-3xl font-bold">
            <span className="mx-2">Sub</span>
            <span className="mx-2">Branch</span>
            <span className="mx-2">Master</span>
          </marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Sub-Branch"
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

      {/* Add/Update Sub-Branch Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold">
            {isEditing ? "Edit Sub-Branch" : "Add Sub-Branch"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Main Department</label>
                <input
                  type="text"
                  value={formState.mainDept}
                  onChange={(e) => setFormState({ ...formState, mainDept: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300 w-1/2"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Sub-Branch</label>
                <input
                  type="text"
                  value={formState.subBranch}
                  onChange={(e) => setFormState({ ...formState, subBranch: e.target.value })}
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

      {/* Sub-Branch List Table */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="px-6 py-4">
          <table className="w-full bg-white rounded-lg shadow-md mb-6">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2 hover:text-black cursor-pointer">Sr.No</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Main Department</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Sub-Branch</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Status</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubBranches.map((branch) => (
                <tr key={branch.id}>
                  <td className="px-4 py-2">{branch.id}</td>
                  <td className="px-4 py-2">{branch.mainDept}</td>
                  <td className="px-4 py-2">{branch.subBranch}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`font-bold ${
                        branch.status === "Active" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {branch.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    {branch.status === "Active" ? (
                      <FaCheck
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleToggleStatus(branch.id, "Active")}
                      />
                    ) : (
                      <FaTimes
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleToggleStatus(branch.id, "Inactive")}
                      />
                    )}
                    <FaEdit
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleEditSubBranch(branch.id)}
                    />
                    <FaTrash
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleDeleteSubBranch(branch.id)}
                    />
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

export default SubBranchMaster;
